import { getDatabase, ref, onValue } from "firebase/database";

export function subscribeToQuiz(jobId: string, onDone: (data: any) => void) {
  const db = getDatabase();
  const jobRef = ref(db, `quizJobs/${jobId}`);

  const unsubscribe = onValue(jobRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) return;

    if (data.status === "done") {
      onDone(data.result);
      unsubscribe();
    }

    if (data.status === "error") {
      console.error("Ошибка генерации");
      unsubscribe();
    }
  });

  return unsubscribe;
}
