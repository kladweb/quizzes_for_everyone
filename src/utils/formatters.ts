export const formatScore = (score: number): string => {
  if (Number.isInteger(score)) {
    return score.toString();
  }
  return score.toFixed(2);
};

const locale = navigator.languages?.[0] || navigator.language;

export const formatterDate: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale);

export const dateFormatter = (date: number) => {
  if (date === 0) {
    return date;
  }
  return new Date(date).toLocaleDateString('ru-RU')
}

export const getParamClassName = (date: number) => {
  const dateNow = Date.now();
  if (date === 0) {
    return "param-yellow";
  }
  if (dateNow - date <= 2592000000) {
    return;
  }
  return "param-yellow";
}
