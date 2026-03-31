// export const useOpenAiQuizCreator = () => {
//
//   async function generateQuiz(userDescription: string, numQuestions: number) {
//     const res = await fetch("/.netlify/functions/generate-quiz", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({userDescription, numQuestions}),
//     });
//     if (!res.ok) {
//       throw new Error("Ошибка генерации теста");
//     }
//     const data = await res.json();
//     return data.content;
//   }
//
//   return {
//     generateQuiz
//   };
// };
