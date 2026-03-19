import OpenAI from "openai";

export const useOpenAiQuizCreator = () => {
  const DEEPSEEK_API_URL = 'https://api.deepseek.com';
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const MODEL = "deepseek-ai/DeepSeek-V3.2-Exp";

  // const openai = new OpenAI({
  //   baseURL: 'https://api.deepseek.com',
  //   apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  //   dangerouslyAllowBrowser: true
  // });

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
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {role: 'system', content: systemPrompt},
          {role: 'user', content: 'Создай тест.'}, // пользовательский запрос короткий, т.к. всё в system
        ],
        temperature: 0.3,          // низкая температура для более предсказуемого JSON
        max_tokens: 2000,
        // DeepSeek поддерживает response_format, но оставим универсальным
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({error: 'DeepSeek API error', details: data}),
      };
    }

    // Извлекаем содержимое ответа
    let content = data.choices[0].message.content;

    console.log(content);
  }

  return {
    generateQuiz
  };
}
