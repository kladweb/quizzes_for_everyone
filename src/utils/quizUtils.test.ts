import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IQuizMeta } from "../types/Quiz";

vi.mock("nanoid", () => ({
  nanoid: () => "mock-test-id-12",
}));

vi.mock("../firebase/firebase", () => ({
  database: {},
}));

vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  set: vi.fn(),
}));

vi.mock("../store/useNoticeStore", () => ({
  showToast: vi.fn(),
}));

import {
  filterQuizzes,
  getSafeFileName,
  getUniqueCategories,
  prepareQuiz,
} from "./quizUtils";

function makeQuiz(overrides: Partial<IQuizMeta> = {}): IQuizMeta {
  return {
    testId: "existing-id",
    createdBy: "user-old",
    title: "Sample Quiz",
    createdAt: 1000,
    category: "general",
    lang: "ru",
    access: "public",
    executionCount: 0,
    likeUsers: {},
    ...overrides,
  };
}

const validQuizJson = JSON.stringify({
  title: "Imported Quiz",
  category: "math",
  lang: "ru",
  access: "public",
  questions: [
    {
      id: "q1",
      question: "2 + 2?",
      options: [
        { id: "q1_a", text: "3" },
        { id: "q1_b", text: "4" },
      ],
      correctAnswers: ["q1_b"],
    },
  ],
});

describe("prepareQuiz", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
  });

  it("parses valid JSON and assigns metadata", () => {
    const quiz = prepareQuiz(validQuizJson, "user-123");

    expect(quiz.testId).toBe("mock-test-id-12");
    expect(quiz.createdBy).toBe("user-123");
    expect(quiz.createdAt).toBe(1_700_000_000_000);
    expect(quiz.modifiedAt).toBe(1_700_000_000_000);
    expect(quiz.title).toBe("Imported Quiz");
    expect(quiz.questions).toHaveLength(1);
  });

  it("throws when title or questions are missing", () => {
    expect(() => prepareQuiz(JSON.stringify({ title: "No questions" }), "u1"))
      .toThrow("Неверный формат файла.");
    expect(() => prepareQuiz(JSON.stringify({ questions: [] }), "u1"))
      .toThrow("Неверный формат файла.");
  });

  it("throws when question structure is invalid", () => {
    const noId = JSON.stringify({
      title: "Quiz",
      questions: [{ options: [], correctAnswers: [] }],
    });
    const noOptions = JSON.stringify({
      title: "Quiz",
      questions: [{ id: "q1", correctAnswers: [] }],
    });
    const noCorrect = JSON.stringify({
      title: "Quiz",
      questions: [{ id: "q1", options: [] }],
    });

    expect(() => prepareQuiz(noId, "u1")).toThrow("Question 1 missing id");
    expect(() => prepareQuiz(noOptions, "u1")).toThrow("Question 1 missing options");
    expect(() => prepareQuiz(noCorrect, "u1")).toThrow("Question 1 missing correctAnswers");
  });
});

describe("filterQuizzes", () => {
  const quizzes = [
    makeQuiz({ testId: "1", access: "public", category: "math" }),
    makeQuiz({ testId: "2", access: "private", category: "math" }),
    makeQuiz({ testId: "3", access: "public", category: "history" }),
  ];

  it("hides private quizzes by default", () => {
    const result = filterQuizzes(quizzes);
    expect(result).toHaveLength(2);
    expect(result.every(q => q.access !== "private")).toBe(true);
  });

  it("includes private quizzes when includePrivate is true", () => {
    expect(filterQuizzes(quizzes, undefined, true)).toHaveLength(3);
  });

  it("filters by category", () => {
    const result = filterQuizzes(quizzes, "math");
    expect(result).toHaveLength(1);
    expect(result[0].testId).toBe("1");
  });

  it("returns all public quizzes when category is not set", () => {
    expect(filterQuizzes(quizzes)).toHaveLength(2);
  });
});

describe("getUniqueCategories", () => {
  it('starts with "all" and removes duplicates', () => {
    const quizzes = [
      makeQuiz({ category: "math" }),
      makeQuiz({ category: "math" }),
      makeQuiz({ category: "history" }),
    ];

    const categories = getUniqueCategories(quizzes);

    expect(categories[0]).toBe("all");
    expect(categories).toEqual(["all", "history", "math"]);
  });
});

describe("getSafeFileName", () => {
  it('returns "quiz" for empty title', () => {
    expect(getSafeFileName(undefined)).toBe("quiz");
    expect(getSafeFileName("   ")).toBe("quiz");
  });

  it("replaces special characters with underscore", () => {
    expect(getSafeFileName("Test: Quiz #1!")).toBe("Test_ Quiz _1_");
  });

  it("preserves cyrillic characters", () => {
    expect(getSafeFileName("Тест по математике")).toBe("Тест по математике");
  });

  it("truncates long titles at word boundary", () => {
    const longTitle = "Очень длинное название квиза для проверки обрезки";
    const result = getSafeFileName(longTitle, 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result).not.toMatch(/_$/);
  });
});
