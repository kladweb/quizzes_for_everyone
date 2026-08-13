import Unsubscribe = firebase.Unsubscribe;
import { create, StateCreator } from "zustand";
import { fetchUserTokens, createDefaultTokens, updateTokens } from "../api/tokensApi";
import { type ITokens, PLAN_LIMITS } from "../types/Quiz";
import firebase from "firebase/compat/app";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/firebase";

const DAY_MS = 86400000;  //одни сутки;

interface TokensStore {
  tokens: ITokens;
  loadingTokens: boolean;

  loadTokens: (userId: string) => Promise<void>;
  spendTokens: (userId: string, amount: number) => Promise<void>;
  subscribeToUserTokens: (uid: string) => void;
  unsubscribeFromUserTokens: () => void;

  // remaining: number;
  // limit: number;
  // canSpend: boolean;
  // isSubscribed: boolean;
}

function getDefaultTokens(): ITokens {
  return {
    plan: "start",
    expiresAt: 0,
    dailyCount: 50,
    extraCount: 0,
    usedToday: 0,
    lastReset: Date.now(),
  };
}

function getLimit(tokens: ITokens): number {
  const now = Date.now();
  const isActive = tokens.plan !== "start" && now < (tokens.expiresAt || 0);
  if (isActive) {
    return PLAN_LIMITS[tokens.plan];
  }
  return tokens.dailyCount || PLAN_LIMITS.start;
}

export let unsubscribeTokens: Unsubscribe | null = null;

const tokensStore: StateCreator<TokensStore> = (set, get) => ({
  tokens: getDefaultTokens(),
  loadingTokens: true,

  // LOAD
  loadTokens: async (userId) => {
    set({loadingTokens: true});
    try {
      const data = await fetchUserTokens(userId);
      let nextTokens: ITokens = getDefaultTokens();
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
          extraCount: t.extraCount ?? 0,
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

    const currentCount = updated.dailyCount + updated.extraCount;
    let newUsed = updated.usedToday;
    if (amount > currentCount - updated.usedToday) {
      throw new Error("Not enough tokens");
    }
    if (updated.extraCount > 0 && updated.extraCount <= amount) {
      newUsed = updated.usedToday - updated.extraCount + amount;
      updated.extraCount = 0;
    }
    if (updated.extraCount > amount) {
      updated.extraCount = updated.extraCount - amount;
    }
    if (updated.extraCount === 0) {
      newUsed = updated.usedToday + amount;
      if (newUsed > limit) {
        newUsed = limit;
      }
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
        "tokens/extraCount": updated.extraCount,
        "tokens/lastReset": updated.lastReset
      });
    } catch (e) {
      // rollback
      set({tokens: prev});
      throw e;
    }
  },

  subscribeToUserTokens: (uid: string) => {
    const tokensRef = ref(database, `users/${uid}/tokens`);

    unsubscribeTokens = onValue(tokensRef, (snapshot) => {
      const tokens = snapshot.val();
      set({tokens: tokens ?? null});
    });
  },

  unsubscribeFromUserTokens: () => {
    unsubscribeTokens?.();
    unsubscribeTokens = null;
  },
});

const useTokensStore = create<TokensStore>()(tokensStore);

export { useTokensStore };

// export const useTokens = () => useTokensStore((state) => state.tokens);
export const useLoadingTokens = () => useTokensStore((state) => state.loadingTokens);

export const useRemaining = () =>
  useTokensStore((state) => {
    const limit = getLimit(state.tokens);
    return Math.max(0, limit + state.tokens.extraCount - state.tokens.usedToday);
  });

export const useLimit = () =>
  useTokensStore((state) => getLimit(state.tokens));

export const useCanSpend = () =>
  useTokensStore((state) => {
    const limit = getLimit(state.tokens);
    const remaining = limit + state.tokens.extraCount - state.tokens.usedToday;
    return remaining >= 20;
  });

export const loadTokens = (userId: string): Promise<void> =>
  useTokensStore.getState().loadTokens(userId);
export const spendTokens = (userId: string, amount: number): Promise<void> =>
  useTokensStore.getState().spendTokens(userId, amount);
export const subscribeToUserTokens = (uid: string) =>
  useTokensStore.getState().subscribeToUserTokens(uid);
export const unsubscribeFromUserTokens = () =>
  useTokensStore.getState().unsubscribeFromUserTokens();
