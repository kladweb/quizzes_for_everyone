import { create, StateCreator } from "zustand";
import {
  fetchUserTokens,
  createDefaultTokens,
  updateTokens
} from "../api/tokensApi";

const DAY_MS = 86400000;

const PLAN_LIMITS = {
  start: 50,
  basic: 500,
  pro: 1000
} as const;

type Plan = keyof typeof PLAN_LIMITS;

interface Tokens {
  dailyCount: number;
  plan: Plan;
  usedToday: number;
  lastReset: number;
  expiresAt: number;
}

interface TokensStore {
  tokens: Tokens;
  loading: boolean;

  loadTokens: (userId: string) => Promise<void>;
  spendTokens: (userId: string, amount: number) => Promise<void>;

  // remaining: number;
  // limit: number;
  // canSpend: boolean;
  // isSubscribed: boolean;
}

function getDefaultTokens(): Tokens {
  return {
    dailyCount: 50,
    plan: "start",
    usedToday: 0,
    lastReset: Date.now(),
    expiresAt: 0
  };
}

function getLimit(tokens: Tokens): number {
  const now = Date.now();
  const isActive =
    tokens.plan !== "start" && now < (tokens.expiresAt || 0);
  if (isActive) {
    return PLAN_LIMITS[tokens.plan];
  }
  return tokens.dailyCount || PLAN_LIMITS.start;
}

const tokensStore: StateCreator<TokensStore> = (set, get) => ({
  tokens: getDefaultTokens(),
  loading: true,


  // LOAD
  loadTokens: async (userId) => {
    set({loading: true});
    try {
      const data = await fetchUserTokens(userId);
      let nextTokens: Tokens = getDefaultTokens();
      if (!data?.tokens) {
        await createDefaultTokens(userId, nextTokens);
        nextTokens = getDefaultTokens();
      } else {
        const t = data.tokens;
        nextTokens = {
          dailyCount: t.dailyCount ?? 50,
          plan: ["start", "basic", "pro"].includes(t.plan)
            ? t.plan
            : "start",
          usedToday: t.usedToday ?? 0,
          lastReset: t.lastReset ?? Date.now(),
          expiresAt: t.expiresAt ?? 0
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
      set(() => ({loading: false}));
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
    if (updated.usedToday + amount > limit) {
      throw new Error("Not enough tokens");
    }
    const newUsed = updated.usedToday + amount;
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

  //DERIVED STATE
  // get remaining() {
  //   const {tokens} = get();
  //   const limit = getLimit(tokens);
  //   return Math.max(0, limit - tokens.usedToday);
  // },
  //
  // get limit() {
  //   return getLimit(get().tokens);
  // },
  //
  // get canSpend() {
  //   return get().remaining >= 20;
  // },
  //
  // get isSubscribed() {
  //   const {tokens} = get();
  //   return tokens.plan !== "start" && Date.now() < tokens.expiresAt;
  // }
});

const useTokensStore = create<TokensStore>()(tokensStore);

export const useTokens = () => useTokensStore((state) => state.tokens);
export const useLoading = () => useTokensStore((state) => state.loading);

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

export const useIsSubscribed = () =>
  useTokensStore((state) => {
    return (
      state.tokens.plan !== "start" &&
      Date.now() < state.tokens.expiresAt
    );
  });

export const loadTokens = (userId: string) =>
  useTokensStore.getState().loadTokens(userId);
export const spendTokens = (userId: string, amount: number) =>
  useTokensStore.getState().spendTokens(userId, amount);
