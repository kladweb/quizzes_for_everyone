import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

export const handler: Handler = async (event) => {
  try {
    const {userDescription, numQuestions} = JSON.parse(event.body || "{}");

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const systemPrompt = `Ты — помощник для создания учебных тестов.
Сгенерируй тест по описанию: "${userDescription}", которое будет приведено ниже из ${numQuestions} количества вопросов.
Если в описании указано иное количество вопросов, игнорируй эту цифру.
Правильное количество вопросов должно быть ${numQuestions}.
Каждый вопрос должен иметь несколько вариантов ответов, один из которых верный. Может быть несколько верных ответов,
если это указано в описании.
Вопросы должны быть на русском языке, если иное не указано в описании теста.
**Верни ТОЛЬКО валидный JSON-объект** без каких-либо дополнительных слов, пояснений или markdown-форматирования.
Используй следующую структуру JSON файла:
{
  "title": "English Test: Present Simple",
  "description": "Mini test",
  "category": "general",
  "questions": [
    {
      "id": "q1",
      "question": "She ___ to school.",
      "options": [
        { "id": "q1_a", "text": "go" },
        { "id": "q1_b", "text": "goes" },
        { "id": "q1_c", "text": "went" },
        { "id": "q1_d", "text": "going" }
      ],
      "correctAnswers": ["q1_b"],
      "explanation": "He/She/It → goes"
    },
    {
      "id": "q2",
      "question": "Which are correct present simple forms?",
      "options": [
        { "id": "q2_a", "text": "I am" },
        { "id": "q2_b", "text": "He are" },
        { "id": "q2_c", "text": "They are" },
        { "id": "q2_d", "text": "She am" }
      ],
      "correctAnswers": ["q2_a", "q2_c"],
      "explanation": "I am, They are - correct forms"
    }
  ]
}
Для поля "category" вместо "general" подбери соответствующую тесту категорию из списка:
general, english, russian, math, algebra, geometry, physics, chemistry, biology, geography, history, 
informatics, logic, iq, astronomy, engineering, building, economics, finance, business, psychology,
sociology, music, art, literature, cinema, sport, health, nutrition, travel, culture, traditions, cars, space.
Убедись, что JSON синтаксически верен: используй двойные кавычки, никаких trailing commas.`;

    const userPrompt = `Создай тест.`

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt},
      ],
      response_format: {
        type: "json_object",
      },
      // temperature: 0.4,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: response.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({error: "Failed to generate quiz"}),
    };
  }
};
