import { useCallback, useEffect, useState } from "react"
import { getDatabase, ref, get, update } from "firebase/database"

const DAY_MS = 86400000;

const PLAN_LIMITS = {
  start: 50,
  basic: 500,
  pro: 1000
} as const;

type Plan = keyof typeof PLAN_LIMITS

interface Tokens {
  dailyCount: number
  plan: Plan
  usedToday: number
  lastReset: number
  expiresAt: number
}

function getLimit(tokens: Tokens): number {
  const now = Date.now();

  const isActive =
    tokens.plan !== "start" && now < (tokens.expiresAt || 0)

  if (isActive) {
    return PLAN_LIMITS[tokens.plan];
  }

  return tokens.dailyCount || PLAN_LIMITS.start;
}

export function useTokens(userId: string | null) {
  const db = getDatabase()

  const [tokens, setTokens] = useState<Tokens>({
    dailyCount: 50,
    plan: "start",
    usedToday: 0,
    lastReset: Date.now(),
    expiresAt: 0
  })

  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const userRef = ref(db, `users/${userId}`)
    const snapshot = await get(userRef)

    let nextTokens: Tokens = {
      dailyCount: 50,
      plan: "start",
      usedToday: 0,
      lastReset: Date.now(),
      expiresAt: 0
    }

    if (snapshot.exists()) {
      const data = snapshot.val()

      if (data.tokens) {
        const t = data.tokens

        nextTokens = {
          dailyCount: t.dailyCount ?? 50,
          plan: ["start", "basic", "pro"].includes(t.plan)
            ? t.plan
            : "start",
          usedToday: t.usedToday ?? 0,
          lastReset: t.lastReset ?? Date.now(),
          expiresAt: t.expiresAt ?? 0
        }
      }
    }

    const now = Date.now()

    // 🔄 reset раз в 24 часа
    if (now - nextTokens.lastReset > DAY_MS) {
      nextTokens.usedToday = 0
      nextTokens.lastReset = now

      await update(userRef, {
        "tokens.usedToday": 0,
        "tokens.lastReset": now
      })
    }

    setTokens(nextTokens)
    setLoading(false)
  }, [db, userId])

  useEffect(() => {
    if (!userId) return;
    load();
  }, [load, userId])

  const spend = useCallback(
    async (amount: number) => {
      if (!userId) {
        throw new Error("User not authenticated")
      }
      const now = Date.now()

      let updated = {...tokens}

      // 🔄 reset если нужно
      if (now - updated.lastReset > DAY_MS) {
        updated.usedToday = 0
        updated.lastReset = now
      }

      const limit = getLimit(updated)

      if (updated.usedToday + amount > limit) {
        throw new Error("Not enough tokens")
      }

      updated.usedToday += amount

      const userRef = ref(db, `users/${userId}`)

      await update(userRef, {
        "tokens.usedToday": updated.usedToday,
        "tokens.lastReset": updated.lastReset
      })

      setTokens(updated)
    },
    [db, userId, tokens]
  )

  const limit = getLimit(tokens)
  const remaining = Math.max(0, limit - tokens.usedToday)
  const canSpend = remaining > 0

  const isSubscribed =
    tokens.plan !== "start" && Date.now() < tokens.expiresAt

  return {
    canSpend,
    spend,
    remaining,
    used: tokens.usedToday,
    limit,
    loading,
    isSubscribed,
    plan: tokens.plan
  }
}
