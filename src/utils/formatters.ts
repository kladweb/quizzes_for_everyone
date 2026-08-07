export const formatScore = (score: number): string => {
  if (Number.isInteger(score)) {
    return score.toString();
  }
  return score.toFixed(2);
};

const locale = navigator.languages?.[0] || navigator.language;

export const formatterDate: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale);
