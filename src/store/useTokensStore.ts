import { create, StateCreator } from "zustand";
import {
  fetchUserTokens,
  createDefaultTokens,
  updateTokens
} from "../api/tokensApi";

const DAY_MS = 86400000;  //одни сутки;

const PLAN_LIMITS = {
  start: 50,
  pro: 200,
  vip: 500
} as const;

type Plan = keyof typeof PLAN_LIMITS;

export interface Tokens {
  plan: Plan;
  expiresAt: number;
  dailyCount: number;
  extraCount: number;
  usedToday: number;
  lastReset: number;
}

interface TokensStore {
  tokens: Tokens;
  loadingTokens: boolean;

  loadTokens: (userId: string) => Promise<void>;
  spendTokens: (userId: string, amount: number) => Promise<void>;

  // remaining: number;
  // limit: number;
  // canSpend: boolean;
  // isSubscribed: boolean;
}

function getDefaultTokens(): Tokens {
  return {
    plan: "start",
    expiresAt: 0,
    dailyCount: 50,
    extraCount: 0,
    usedToday: 0,
    lastReset: Date.now(),
  };
}

function getLimit(tokens: Tokens): number {
  const now = Date.now();
  const isActive = tokens.plan !== "start" && now < (tokens.expiresAt || 0);
  if (isActive) {
    return PLAN_LIMITS[tokens.plan];
  }
  return tokens.dailyCount || PLAN_LIMITS.start;
}

const tokensStore: StateCreator<TokensStore> = (set, get) => ({
  tokens: getDefaultTokens(),
  loadingTokens: true,

  // LOAD
  loadTokens: async (userId) => {
    set({loadingTokens: true});
    try {
      const data = await fetchUserTokens(userId);
      let nextTokens: Tokens = getDefaultTokens();
      if (!data?.tokens) {
        await createDefaultTokens(userId, nextTokens);
        nextTokens = getDefaultTokens();
      } else {
        const t = data.tokens;
        nextTokens = {
          plan: ["start", "pro", "vip"].includes(t.plan)
            ? t.plan
            : "start",
          expiresAt: t.expiresAt ?? 0,
          dailyCount: t.dailyCount ?? 50,
          extraCount: t.dailyCount ?? 0,
          usedToday: t.usedToday ?? 0,
          lastReset: t.lastReset ?? Date.now(),
        };
      }
      const now = Date.now();
      // reset
      if (now - nextTokens.lastReset > DAY_MS) {
        nextTokens.usedToday = 0;
        nextTokens.lastReset = now;
        await updateTokens(userId, {
          "tokens/usedToday": 0,
          "tokens/lastReset": now
        });
      }
      set({
        tokens: nextTokens,
      });
    } catch (e) {
      console.error(e);
    } finally {
      set(() => ({loadingTokens: false}));
    }
  },

  // SPEND
  spendTokens: async (userId, amount) => {
    const {tokens} = get();
    const now = Date.now();
    let updated = {...tokens};
    // reset если нужно
    if (now - updated.lastReset > DAY_MS) {
      updated.usedToday = 0;
      updated.lastReset = now;
    }
    const limit = getLimit(updated);
    let newUsed = 0;
    if (updated.usedToday + amount > limit + updated.extraCount) {
      throw new Error("Not enough tokens");
    }
    if (updated.extraCount > amount) {
      updated.extraCount = updated.extraCount - amount;
    }
    if (updated.extraCount > 0 && updated.extraCount <= amount) {
      newUsed = updated.usedToday - updated.extraCount + amount;
      updated.extraCount = 0;
    }
    if (updated.extraCount === 0) {
      newUsed = updated.usedToday + amount;
    }

    // сначала обновляем локально (моментальный UI)
    const prev = {...tokens};
    set({
      tokens: {
        ...updated,
        usedToday: newUsed
      }
    });
    try {
      await updateTokens(userId, {
        "tokens/usedToday": newUsed,
        "tokens/lastReset": updated.lastReset
      });
    } catch (e) {
      // rollback
      set({tokens: prev});
      throw e;
    }
  },
});

const useTokensStore = create<TokensStore>()(tokensStore);

export { useTokensStore };

// export const useTokens = () => useTokensStore((state) => state.tokens);
export const useLoadingTokens = () => useTokensStore((state) => state.loadingTokens);

export const useRemaining = () =>
  useTokensStore((state) => {
    const limit = getLimit(state.tokens);
    return Math.max(0, limit - state.tokens.usedToday);
  });

export const useLimit = () =>
  useTokensStore((state) => getLimit(state.tokens));

export const useCanSpend = () =>
  useTokensStore((state) => {
    const limit = getLimit(state.tokens);
    const remaining = limit - state.tokens.usedToday;
    return remaining >= 20;
  });

export const loadTokens = (userId: string): Promise<void> =>
  useTokensStore.getState().loadTokens(userId);
export const spendTokens = (userId: string, amount: number): Promise<void> =>
  useTokensStore.getState().spendTokens(userId, amount);
