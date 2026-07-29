import type { Handler } from "@netlify/functions";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const handler: Handler = async (event) => {
  try {
    const authHeader = event.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = authHeader.substring(7);

    const decoded = await getAuth().verifyIdToken(token);

    return {
      statusCode: 200,
      body: JSON.stringify({
        role:
          decoded.uid === process.env.ADMIN_UID
            ? "admin"
            : "user",
      }),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }
};
