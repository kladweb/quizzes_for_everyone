export async function startQuizGeneration(
  userDescription: string,
  numQuestions: number,
  userId: string
) {
  const res = await fetch("/.netlify/functions/generate-quiz-start", {
    method: "POST",
    body: JSON.stringify({ userDescription, numQuestions, userId }),
  });

  if (!res.ok) {
    throw new Error("Ошибка запуска генерации");
  }

  return res.json(); // { jobId }
}
