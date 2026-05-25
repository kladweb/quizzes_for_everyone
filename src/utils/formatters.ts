export const formatScore = (score: number): string => {
  if (Number.isInteger(score)) {
    return score.toString();
  }
  return score.toFixed(2);
};
