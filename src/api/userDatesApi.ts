import { get, getDatabase, ref, update } from "firebase/database";

const db = getDatabase();

export async function setUserAuthDate(userId: string) {
  const userRef = ref(db, `users/${userId}/userDatesInfo`);
  const snapshot = await get(userRef);
  const userRegistrationDate = snapshot.exists() ? snapshot.val() : null
  const dateNow = new Date();
  if (!userRegistrationDate) {
    await update(userRef, {registration: dateNow});
  }
  await update(userRef, {lastVisited: dateNow});
}

export async function setCreatedQuizDate(userId: string) {
  const userRef = ref(db, `users/${userId}/userDatesInfo`);
  await update(userRef, {lastCreatedQuiz: Date.now()});
}

export async function setPassedQuizDate(userId: string) {
  const userRef = ref(db, `users/${userId}/userDatesInfo`);
  await update(userRef, {lastPassedQuiz: Date.now()});
}
