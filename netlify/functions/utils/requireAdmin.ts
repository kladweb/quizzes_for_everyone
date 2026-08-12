import { HandlerEvent } from "@netlify/functions";
import { getAuth } from "firebase-admin/auth";

export async function requireAdmin(event: HandlerEvent) {
  const authHeader = event.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("ERR001");
    throw new Error("Unauthorized");
  }

  const token = authHeader.substring(7);
  const decoded = await getAuth().verifyIdToken(token);
  if (decoded.uid === process.env.ADMIN_UID) {
    console.log("Вернули decoded !!!");
    return decoded;
  } else {
    throw new Error("Forbidden");
  }
}
