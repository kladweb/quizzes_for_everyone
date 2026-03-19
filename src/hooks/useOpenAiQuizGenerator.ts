import OpenAI from "openai";

export const useOpenAiQuizCreator = () => {

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    // baseURL: 'https://api.deepseek.com/v3.1_terminus_expires_on_20251015',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function generateQuiz(userPrompt: string, numQuestions: number) {
    const systemPrompt = `Ты — помощник для создания учебных тестов.
Сгенерируй тест по описанию "${userPrompt}" из ${numQuestions} вопросов.
Каждый вопрос должен иметь несколько вариантов ответов, один из которых верный.
Вопросы должны быть на русском языке, если иное не указано в описании выше.
**Верни ТОЛЬКО валидный JSON-объект** без каких-либо дополнительных слов, пояснений или markdown-форматирования.
Используй следующую структуру JSON файла:
{
  "title": "English Test: Present Simple",
  "description": "Mini test",
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
Убедись, что JSON синтаксически верен: используй двойные кавычки, никаких trailing commas.`;


    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     {role: "system", content: "You are a helpful assistant."},
    //     {role: "user", content: userPrompt}
    //   ],
    //   model: "deepseek-ai/DeepSeek-V3.2-Exp",
    // });

    const response = await openai.chat.completions.create(
      {
        model: "deepseek-chat",
        // model: "deepseek-ai/DeepSeek-V3.2-Exp",
        messages: [
          {role: 'system', content: systemPrompt},
          {role: 'user', content: 'Создай тест.'},
        ],
        response_format: {
          'type': 'json_object'
        }
      }
    );
    console.log(response);
    return response.choices[0].message.content;
  }

  return {
    generateQuiz
  };
}
