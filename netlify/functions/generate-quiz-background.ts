import type { BackgroundHandler } from "@netlify/functions";
import OpenAI from "openai";
import { getDatabase, ref, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { jsonTemplateCat } from "../../src/variables/quizData";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const handler: BackgroundHandler = async (event) => {
  const {userDescription, numQuestions, language, jobId} = JSON.parse(event.body || "{}");

  const jobRef = ref(db, `quizJobs/${jobId}`);

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const systemPrompt = `Ты — помощник для создания учебных тестов.
Сгенерируй тест по описанию: "${userDescription}". Количество вопросов в тесте: ${numQuestions}.
Если в описании теста указано иное количество вопросов, игнорируй эту цифру.
Каждый вопрос должен иметь несколько вариантов ответов, один из которых верный. Может быть несколько верных ответов,
если это указано в описании. Язык вопросов и ответов (целевой язык): ${language}.
**Верни ТОЛЬКО валидный JSON-объект** без каких-либо дополнительных слов, пояснений или markdown-форматирования.
Используй следующую структуру JSON файла:
${jsonTemplateCat}
Для поля "category" вместо "general" подбери соответствующую тесту категорию из списка:
general, english, russian, math, algebra, geometry, physics, chemistry, biology, geography, history, 
informatics, logic, iq, astronomy, engineering, building, economics, finance, business, psychology,
sociology, music, art, literature, cinema, sport, health, nutrition, travel, culture, traditions, cars, space.
Убедись, что JSON синтаксически верен: используй двойные кавычки, никаких trailing commas.
Если в описании теста содержится мат или нецензурные слова, останавливай генерацию теста и выбрасывай ошибку
или верни такой json: {status: "error"}.
**КРИТИЧЕСКОЕ ПРАВИЛО:**
Если пользовательский запрос (описание теста) содержит нецензурные слова, любой мат, оскорбления или явно
провокационный контент, ТЫ ДОЛЖЕН ВЕРНУТЬ ТОЛЬКО ЭТОТ ТОЧНЫЙ JSON (без дополнительных слов):
{"status": "error", "reason": "inappropriate_content"}
В ЭТОМ СЛУЧАЕ НЕ ПЫТАЙСЯ СОЗДАВАТЬ ТЕСТ!
В ЭТОМ СЛУЧАЕ НЕ ГЕНЕРИРУЙ СЛУЧАЙНЫЙ ТЕСТ!`;

  const userPrompt = `Проверь, есть ли в описании теста любой мат или нецензурные слова. Если есть - верни: 
  {"status": "error", "reason": "inappropriate_content"}
  Если нет - создай тест. Верни ТОЛЬКО JSON.`

  try {
    const response = await openai.chat.completions.create({
      // model: "deepseek-coder",
      model: "deepseek-chat",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt},
      ],
      response_format: {type: "json_object"},
    });

    const content = response.choices[0].message.content;

    await update(jobRef, {
      status: "done",
      result: content,
    });
  } catch (e) {
    console.error(e);

    await update(jobRef, {
      status: "error",
    });
  }
};
