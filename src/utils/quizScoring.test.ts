import { describe, expect, it } from "vitest";
import {
  calculateQuestionScore,
  calculateTotalScore,
  isQuestionFullyCorrect,
} from "./quizScoring";

describe("calculateQuestionScore", () => {
  const correct = ["a", "b"];

  it("returns 1 when all correct answers are selected", () => {
    expect(calculateQuestionScore(["a", "b"], correct)).toBe(1);
  });

  it("returns partial score when only some correct answers are selected", () => {
    expect(calculateQuestionScore(["a"], correct)).toBe(0.5);
  });

  it("returns 0 when a wrong answer is selected", () => {
    expect(calculateQuestionScore(["a", "c"], correct)).toBe(0);
    expect(calculateQuestionScore(["c"], correct)).toBe(0);
  });

  it("returns 0 when nothing is selected", () => {
    expect(calculateQuestionScore([], correct)).toBe(0);
  });

  it("handles single correct answer", () => {
    expect(calculateQuestionScore(["x"], ["x"])).toBe(1);
    expect(calculateQuestionScore([], ["x"])).toBe(0);
  });
});

describe("isQuestionFullyCorrect", () => {
  it("returns true only for score of 1", () => {
    expect(isQuestionFullyCorrect(1)).toBe(true);
    expect(isQuestionFullyCorrect(0.5)).toBe(false);
    expect(isQuestionFullyCorrect(0)).toBe(false);
  });
});

describe("calculateTotalScore", () => {
  it("sums scores across all questions", () => {
    const selected = [["a", "b"], ["c"], ["d"]];
    const correct = [["a", "b"], ["c"], ["d", "e"]];

    expect(calculateTotalScore(selected, correct)).toBe(2.5);
  });
});
