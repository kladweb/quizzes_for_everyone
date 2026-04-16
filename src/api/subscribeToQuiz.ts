import { getDatabase, ref, onValue, remove } from "firebase/database";

export function subscribeToQuiz(
  jobId: string,
  onDone: (data: any) => void,
  onError?: () => void
) {
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
      onError?.();
      unsubscribe();
    }
  });

  return unsubscribe;
}

export async function removeQuizJob(userId: string, jobId: string) {
  const db = getDatabase();
  const jobRef = ref(db, `quizJobs/${jobId}`);
  await remove(jobRef);
  // console.log("delete");
}
