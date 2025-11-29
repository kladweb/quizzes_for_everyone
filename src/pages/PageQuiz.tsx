import { useEffect, useState } from "react";
import { QuizComponent } from "../components/Quiz/Quiz";
import { child, get, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import type { Quiz } from "../types/Quiz";
import { useParams } from "react-router-dom";

export const PageQuiz = () => {
  const params = useParams();
  const testId = params.testid;
  // const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleReset = () => {
    setQuiz(null);
  };

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `tests/${testId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const dataString = snapshot.val();
        let quiz = JSON.parse(dataString);
        console.log("DATA: ", quiz);
        setQuiz(quiz);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <>
      {
        (quiz) ?
          <QuizComponent quiz={quiz} onReset={handleReset}/> :
          <div>LOADING ...</div>
      }
    </>
  )
}
