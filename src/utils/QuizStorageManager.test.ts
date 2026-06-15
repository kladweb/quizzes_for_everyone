import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IStatistics } from "../types/Quiz";

vi.mock("../firebase/firebase", () => ({
  database: {},
}));

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  child: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));

import { QuizStorageManager } from "./QuizStorageManager";

const STORAGE_KEY = "recentQuizzes";
const NOW = 1_700_000_000_000;

function makeStat(overrides: Partial<IStatistics> = {}): IStatistics {
  return {
    testId: "quiz-1",
    statId: "stat-1",
    title: "Sample Quiz",
    userName: "Test User",
    startedAt: NOW - 60_000,
    finishedAt: NOW,
    incorrectCount: 0,
    score: 100,
    totalScore: 1,
    maxScore: 1,
    correctCount: 1,
    answers: {},
    ...overrides,
  };
}

describe("QuizStorageManager (localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  describe("getRecentAllStat", () => {
    it("returns null when storage is empty", () => {
      expect(QuizStorageManager.getRecentAllStat()).toBeNull();
    });

    it("returns parsed statistics from localStorage", () => {
      const stats = [makeStat()];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

      expect(QuizStorageManager.getRecentAllStat()).toEqual(stats);
    });
  });

  describe("getRecentStatTestId", () => {
    it("returns null when storage is empty", () => {
      expect(QuizStorageManager.getRecentStatTestId("quiz-1")).toBeNull();
    });

    it("returns statistic for matching testId", () => {
      const stats = [
        makeStat({ testId: "quiz-1", score: 80 }),
        makeStat({ testId: "quiz-2", score: 90 }),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

      expect(QuizStorageManager.getRecentStatTestId("quiz-2")).toEqual(stats[1]);
    });
  });

  describe("saveRecentStat", () => {
    it("saves first statistic to empty storage", () => {
      const stat = makeStat();

      QuizStorageManager.saveRecentStat(stat);

      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([stat]);
    });

    it("updates existing statistic for the same testId", () => {
      const original = makeStat({ testId: "quiz-1", score: 70 });
      const updated = makeStat({ testId: "quiz-1", score: 95, statId: "stat-2" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([original]));
      vi.spyOn(QuizStorageManager, "fetchCurrentQuiz").mockResolvedValue({} as never);

      QuizStorageManager.saveRecentStat(updated);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].score).toBe(95);
    });

    it("appends new statistic when testId is different", () => {
      const first = makeStat({ testId: "quiz-1" });
      const second = makeStat({ testId: "quiz-2", statId: "stat-2" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([first]));
      vi.spyOn(QuizStorageManager, "fetchCurrentQuiz").mockResolvedValue({} as never);

      QuizStorageManager.saveRecentStat(second);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(2);
      expect(stored.map((s: IStatistics) => s.testId)).toEqual(["quiz-1", "quiz-2"]);
    });

    it("removes statistics older than 30 days", () => {
      const oldStat = makeStat({
        testId: "old-quiz",
        finishedAt: NOW - 2_592_000_001,
      });
      const freshStat = makeStat({ testId: "fresh-quiz" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([oldStat, freshStat]));
      vi.spyOn(QuizStorageManager, "fetchCurrentQuiz").mockResolvedValue({} as never);

      QuizStorageManager.saveRecentStat(makeStat({ testId: "new-quiz", statId: "stat-3" }));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.some((s: IStatistics) => s.testId === "old-quiz")).toBe(false);
      expect(stored.some((s: IStatistics) => s.testId === "fresh-quiz")).toBe(true);
    });
  });

  describe("removeRecentStat", () => {
    it("removes statistic by testId and returns updated list", () => {
      const stats = [
        makeStat({ testId: "quiz-1" }),
        makeStat({ testId: "quiz-2", statId: "stat-2" }),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

      const result = QuizStorageManager.removeRecentStat("quiz-1");

      expect(result).toHaveLength(1);
      expect(result![0].testId).toBe("quiz-2");
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(result);
    });

    it("returns null when storage is empty", () => {
      expect(QuizStorageManager.removeRecentStat("quiz-1")).toBeNull();
    });
  });

  describe("clearResult", () => {
    it("removes recentQuizzes from localStorage", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([makeStat()]));

      QuizStorageManager.clearResult();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("getAllCompletedQuizzes", () => {
    it("returns test ids from quiz_result_* keys", () => {
      localStorage.setItem("quiz_result_abc", "{}");
      localStorage.setItem("quiz_result_xyz", "{}");
      localStorage.setItem("recentQuizzes", "[]");
      localStorage.setItem("other_key", "1");

      expect(QuizStorageManager.getAllCompletedQuizzes()).toEqual(["abc", "xyz"]);
    });

    it("returns empty array when no completed quizzes exist", () => {
      expect(QuizStorageManager.getAllCompletedQuizzes()).toEqual([]);
    });
  });
});
