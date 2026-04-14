import type { BackgroundHandler } from "@netlify/functions";
import OpenAI from "openai";
import { getDatabase, ref, update } from "firebase/database";
import { initializeApp } from "firebase/app";

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
Сгенерируй тест по описанию: "${userDescription}", которое будет приведено ниже из ${numQuestions} количества вопросов.
Правильное количество вопросов должно быть ${numQuestions}. Если в описании теста указано иное количество вопросов, 
игнорируй эту цифру.
Каждый вопрос должен иметь несколько вариантов ответов, один из которых верный. Может быть несколько верных ответов,
если это указано в описании. Язык вопросов и ответов: ${language}.
**Верни ТОЛЬКО валидный JSON-объект** без каких-либо дополнительных слов, пояснений или markdown-форматирования.
Используй следующую структуру JSON файла:
{
  "title": "[название теста на целевом языке]",
  "description": "[краткое описание на целевом языке]",
  "category": "general",
  "questions": [
    {
      "id": "q1",
      "question": "[текст вопроса на целевом языке]",
      "options": [
        { "id": "q1_a", "text": "[вариант ответа на целевом языке]" },
        { "id": "q1_b", "text": "[вариант ответа на целевом языке]" },
        { "id": "q1_c", "text": "[вариант ответа на целевом языке]" },
        { "id": "q1_d", "text": "[вариант ответа на целевом языке]" }
      ],
      "correctAnswers": ["q1_b"],
      "explanation": "[краткое объяснение на целевом языке]"
    },
    {
      "id": "q2",
      "question": "[текст вопроса на целевом языке]",
      "options": [
        { "id": "q2_a", "text": "[вариант ответа на целевом языке]" },
        { "id": "q2_b", "text": "[вариант ответа на целевом языке]" },
        { "id": "q2_c", "text": "[вариант ответа на целевом языке]" },
        { "id": "q2_d", "text": "[вариант ответа на целевом языке]" }
      ],
      "correctAnswers": ["q2_a", "q2_c"],
      "explanation": "[краткое объяснение на целевом языке]"
    }
  ]
}
В возвращаемом файле язык вопросов и ответов, а также язык названия теста должен быть ${language}.
Для поля "category" вместо "general" подбери соответствующую тесту категорию из списка:
general, english, russian, math, algebra, geometry, physics, chemistry, biology, geography, history, 
informatics, logic, iq, astronomy, engineering, building, economics, finance, business, psychology,
sociology, music, art, literature, cinema, sport, health, nutrition, travel, culture, traditions, cars, space.
Убедись, что JSON синтаксически верен: используй двойные кавычки, никаких trailing commas.
Если в описании теста содержится мат, нецензурные слова или произвольный непонятный набор символов, 
в этом случае останавливай генерацию теста и выбрасывай ошибку (status: "error").
Если ты не понимаешь задачу, не можешь надёжно определить тему теста или видишь, что запрос может подпадать под ограничения модерации,
не создавай общий или "примерный" тест: выбрасывай ошибку (status: "error").
`;

  const userPrompt = `Создай тест. Верни ТОЛЬКО JSON. Язык теста ${language}.`

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
