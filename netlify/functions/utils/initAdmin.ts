import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

export function initAdmin() {
  if (getApps().length > 0) {
    console.log("ADMIN ALREADY INITIALIZED!");
    return;
  }

  console.log("INITIALIZE ADMIN");
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const getAdminDatabase = () => {
  return getDatabase();
};
