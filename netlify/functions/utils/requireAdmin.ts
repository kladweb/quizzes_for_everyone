import { HandlerEvent } from "@netlify/functions";
import { getAuth } from "firebase-admin/auth";

export async function requireAdmin(event: HandlerEvent) {
  try {
    const authHeader = event.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: "Unauthorized"}),
      };
    }

    const token = authHeader.substring(7);

    const decoded = await getAuth().verifyIdToken(token);

    return decoded;

  } catch (e) {
    console.error(e);

    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Unauthorized",
      }),
    };
  }
}
