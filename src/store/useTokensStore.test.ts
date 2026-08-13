import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadTokens, spendTokens, useTokensStore } from "./useTokensStore";
import * as tokensApi from "../api/tokensApi";
import type { ITokens } from "../types/Quiz";

vi.mock("../api/tokensApi", () => ({
  fetchUserTokens: vi.fn(),
  createDefaultTokens: vi.fn(),
  updateTokens: vi.fn(),
}));

const DAY_MS = 86_400_000;
const USER_ID = "user-123";
const NOW = 1_700_000_000_000;

function makeTokens(overrides: Partial<ITokens> = {}): ITokens {
  return {
    plan: "start",
    expiresAt: 0,
    dailyCount: 50,
    extraCount: 0,
    usedToday: 0,
    lastReset: NOW,
    ...overrides,
  };
}

function resetStore(tokens: ITokens = makeTokens()) {
  useTokensStore.setState({tokens, loadingTokens: false});
}

describe("useTokensStore", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(NOW);
    resetStore();
    vi.mocked(tokensApi.fetchUserTokens).mockReset();
    vi.mocked(tokensApi.createDefaultTokens).mockReset();
    vi.mocked(tokensApi.updateTokens).mockReset();
    vi.mocked(tokensApi.updateTokens).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadTokens", () => {
    it("creates default tokens when user has no tokens", async () => {
      vi.mocked(tokensApi.fetchUserTokens).mockResolvedValue(null);
      vi.mocked(tokensApi.createDefaultTokens).mockResolvedValue(undefined);

      await loadTokens(USER_ID);

      expect(tokensApi.createDefaultTokens).toHaveBeenCalledWith(
        USER_ID,
        expect.objectContaining({dailyCount: 50, plan: "start", usedToday: 0})
      );
      expect(useTokensStore.getState().loadingTokens).toBe(false);
      expect(useTokensStore.getState().tokens.plan).toBe("start");
    });

    it("loads existing tokens from API", async () => {
      vi.mocked(tokensApi.fetchUserTokens).mockResolvedValue({
        tokens: {
          plan: "pro",
          expiresAt: NOW + 1_000_000,
          dailyCount: 30,
          extraCount: 0,
          usedToday: 10,
          lastReset: NOW,
        },
      });

      await loadTokens(USER_ID);

      expect(tokensApi.createDefaultTokens).not.toHaveBeenCalled();
      expect(useTokensStore.getState().tokens).toMatchObject({
        dailyCount: 30,
        plan: "pro",
        usedToday: 10,
      });
    });

    it("normalizes invalid plan to start", async () => {
      vi.mocked(tokensApi.fetchUserTokens).mockResolvedValue({
        tokens: {
          plan: "invalid",
          expiresAt: 0,
          dailyCount: 50,
          extraCount: 0,
          usedToday: 0,
          lastReset: NOW,
        },
      });

      await loadTokens(USER_ID);

      expect(useTokensStore.getState().tokens.plan).toBe("start");
    });

    it("resets usedToday when last reset was more than a day ago", async () => {
      vi.mocked(tokensApi.fetchUserTokens).mockResolvedValue({
        tokens: {
          plan: "start",
          expiresAt: 0,
          dailyCount: 50,
          extraCount: 0,
          usedToday: 25,
          lastReset: NOW - DAY_MS - 1,
        },
      });

      await loadTokens(USER_ID);

      expect(tokensApi.updateTokens).toHaveBeenCalledWith(USER_ID, {
        "tokens/usedToday": 0,
        "tokens/lastReset": NOW,
      });
      expect(useTokensStore.getState().tokens.usedToday).toBe(0);
      expect(useTokensStore.getState().tokens.lastReset).toBe(NOW);
    });
  });

  describe("spendTokens", () => {
    it("spends tokens and updates API", async () => {
      resetStore(makeTokens({usedToday: 10}));

      await spendTokens(USER_ID, 5);

      expect(useTokensStore.getState().tokens.usedToday).toBe(15);
      expect(tokensApi.updateTokens).toHaveBeenCalledWith(USER_ID, {
        "tokens/usedToday": 15,
        "tokens/extraCount": 0,
        "tokens/lastReset": NOW,
      });
    });

    it("throws when not enough tokens remain", async () => {
      resetStore(makeTokens({usedToday: 45}));

      await expect(spendTokens(USER_ID, 10)).rejects.toThrow("Not enough tokens");
      expect(tokensApi.updateTokens).not.toHaveBeenCalled();
      expect(useTokensStore.getState().tokens.usedToday).toBe(45);
    });

    it("rolls back local state when API update fails", async () => {
      resetStore(makeTokens({usedToday: 10}));
      vi.mocked(tokensApi.updateTokens).mockRejectedValue(new Error("Network error"));

      await expect(spendTokens(USER_ID, 5)).rejects.toThrow("Network error");
      expect(useTokensStore.getState().tokens.usedToday).toBe(10);
    });

    it("resets daily usage before spending when a day has passed", async () => {
      resetStore(makeTokens({usedToday: 40, lastReset: NOW - DAY_MS - 1}));

      await spendTokens(USER_ID, 20);

      expect(useTokensStore.getState().tokens.usedToday).toBe(20);
    });

    it("uses vip plan limit for active subscription", async () => {
      resetStore(makeTokens({
        plan: "vip",
        dailyCount: 500,
        usedToday: 480,
        expiresAt: NOW + 1_000_000,
      }));

      await spendTokens(USER_ID, 20);

      expect(useTokensStore.getState().tokens.usedToday).toBe(500);
    });

    it("uses dailyCount when subscription has expired", async () => {
      resetStore(makeTokens({
        plan: "pro",
        expiresAt: NOW - 1,
        dailyCount: 50,
        extraCount: 0,
        usedToday: 40,
      }));

      await expect(spendTokens(USER_ID, 15)).rejects.toThrow("Not enough tokens");
    });
  });
});
