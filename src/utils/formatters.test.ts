import { describe, expect, it } from "vitest";
import { formatScore } from "./formatters";

describe("formatScore", () => {
  it("returns integer as string without decimals", () => {
    expect(formatScore(5)).toBe("5");
    expect(formatScore(0)).toBe("0");
  });

  it("formats fractional score with two decimal places", () => {
    expect(formatScore(3.333)).toBe("3.33");
    expect(formatScore(0.5)).toBe("0.50");
  });
});
