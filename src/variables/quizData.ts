export const QUIZ_CATEGORIES = [
  "разное",
  "общий",
  "английский язык",
  "русский язык",
  "математика",
  "алгебра",
  "геометрия",
  "физика",
  "химия",
  "биология",
  "география",
  "история",
  "информатика",
  "логика",
  "IQ",
  "астрономия",
  "строительство",
  "архитектура",
  "инженерия",
  "экономика",
  "финансы",
  "бизнес",
  "психология",
  "социология",
  "музыка",
  "живопись",
  "искусство",
  "литература",
  "кино",
  "спорт",
  "здоровье",
  "питание",
  "путешествия",
  "культура",
  "традиции",
  "автомобили",
  "космос"
].sort((a, b) => a.localeCompare(b, 'ru'));

interface ILabels {
  [key: string]: string;
}

export const CATEGORY_LABELS_RU: ILabels = {
  general: "разное",
  english: "английский язык",
  russian: "русский язык",
  math: "математика",
  algebra: "алгебра",
  geometry: "геометрия",
  physics: "физика",
  chemistry: "химия",
  biology: "биология",
  geography: "география",
  history: "история",
  informatics: "информатика",
  logic: "логика",
  iq: "IQ",
  astronomy: "астрономия",
  engineering: "инженерия",
  building: "строительство",
  economics: "экономика",
  finance: "финансы",
  business: "бизнес",
  psychology: "психология",
  sociology: "социология",
  music: "музыка",
  art: "искусство",
  literature: "литература",
  cinema: "кино",
  sport: "спорт",
  health: "здоровье",
  nutrition: "питание",
  travel: "путешествия",
  culture: "культура",
  traditions: "традиции",
  cars: "автомобили",
  space: "космос"
};

// export const QUIZ_LANGUAGES = ["русский", "беларускi", "english", "polski"]
export const QUIZ_LANGUAGES: ILabels = {ru: "русский", be: "беларускi", en: "english", pl: "polski"}

export const catTitles = {
  category: "Тематика, которой посвящен тест",
  language: "Язык, на котором написаны вопросы теста",
  access: "Будет ли Ваш тест виден в общем списке тестов или только в Вашем"
}
