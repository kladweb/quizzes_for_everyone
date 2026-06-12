import { getDatabase, ref, get, update } from "firebase/database";
import { Tokens } from "../store/useTokensStore";

const db = getDatabase();

export async function fetchUserTokens(userId: string) {
  const userRef = ref(db, `users/${userId}`);
  const snapshot = await get(userRef);

  return snapshot.exists() ? snapshot.val() : null;
}

export async function createDefaultTokens(userId: string, tokens: Tokens) {
  const userRef = ref(db, `users/${userId}`);

  await update(userRef, {tokens})
}

export async function updateTokens(userId: string, data: Record<string, any>) {
  const userRef = ref(db, `users/${userId}`);

  await update(userRef, data);
}
