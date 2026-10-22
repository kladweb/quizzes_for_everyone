import type { BackgroundHandler } from "@netlify/functions";
import OpenAI from "openai";
import { ref, update } from "firebase/database";
import { jsonTemplateCat } from "../../src/variables/quizData";
import { db } from "./utils/firebaseClientServer";

export const handler: BackgroundHandler = async (event) => {
  const {userDescription, numQuestions, language, jobId} = JSON.parse(event.body || "{}");

  const jobRef = ref(db, `quizJobs/${jobId}`);

  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const systemPrompt = `
    You generate educational quizzes.
    User request:
    "${userDescription}"
    Generate exactly ${numQuestions} questions. Ignore any different number mentioned in the request.
    Output language: ${language}.
    Return ONLY a valid JSON object following this JSON template: ${jsonTemplateCat}. Treat example array lengths as illustrative unless explicitly specified by the user.
    
    Rules:
    - If the user request contains profanity, obscene language, insults or offensive content, return exactly: {"status":"error","reason":"inappropriate_content"} instead of JSON with the test. In this case, no other rules need to be followed.
    - Make all incorrect options plausible.
    - Each question must have one or more correct answers, consistent with the requested question type.
    - The number of answer options per question must follow the user's request. If unspecified, use 4 options. Treat the number of options shown in the JSON template as an example, not a fixed requirement.
    - Use \\( ... \\) for inline math and \\[ ... \\] for display math; never use $...$ or $$...$$ as math delimiters.
    - Choose "category" only from:
    general, english, russian, math, algebra, geometry, physics, chemistry, biology, geography, history, informatics, logic, iq, astronomy, engineering, building, economics, finance, business, psychology, sociology, music, art, literature, cinema, sport, health, nutrition, travel, culture, traditions, cars, space.
    - Return valid JSON only.
    - Use double quotes.
    - Do not use trailing commas.
    
    Use only well-established facts.
    Never guess or fabricate information.
    Before generating the quiz, ensure every correct answer is based on reliable knowledge.
    If even one correct answer depends on uncertain, future, recent, ambiguous or unverifiable information, return exactly: {"status":"error","reason":"insufficient_reliable_information"}, do not substitute unknown facts with plausible guesses, do not generate a quiz in this case.
   `;

  const userPrompt = `Generate the quiz according to the system instructions. If the requested topic requires knowledge of events after May 2025, please return exactly: {"status":"error","reason":"insufficient_reliable_information"} instead of JSON with the test. In this case, no other rules need to be followed.`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt},
      ],
      response_format: {type: "json_object"},
      temperature: 0,
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
