import type { Handler } from "@netlify/functions";
import { nanoid } from "nanoid";
import { ref, set } from "firebase/database";
import { db } from "./utils/firebaseClientServer";

export const handler: Handler = async (event) => {
  try {
    const { userDescription, numQuestions, language, userId } = JSON.parse(event.body || "{}");

    const jobId = nanoid(10);

    // создаём job
    await set(ref(db, `quizJobs/${jobId}`), {
      status: "pending",
      result: null,
      createdAt: Date.now(),
      userId,
    });

    // запускаем background
    await fetch(`${process.env.URL}/.netlify/functions/generate-quiz-background`, {
      method: "POST",
      body: JSON.stringify({ userDescription, numQuestions, language, jobId }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ jobId }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to start job" }),
    };
  }
};
