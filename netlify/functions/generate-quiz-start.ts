import type { Handler } from "@netlify/functions";
import { nanoid } from "nanoid";
import { getDatabase, ref, set } from "firebase/database";
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
