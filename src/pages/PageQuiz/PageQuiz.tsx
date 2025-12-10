import { useEffect, useState } from "react";
import { QuizComponent } from "../../components/Quiz/Quiz";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { IStatistics, Quiz } from "../../types/Quiz";
import { useParams } from "react-router-dom";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { QuizResultView } from "../../components/QuizResultView/QuizResultView";

export const PageQuiz = () => {
  const params = useParams();
  const testId = params.testid;
  // const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [savedResult, setSavedResult] = useState<IStatistics | null>(null);

  const handleReset = () => {
    QuizStorageManager.clearResult(testId as string);
    location.reload();
  };

  const saveStatistic = async (statistics: IStatistics) => {
    console.log("saveStatistic", statistics);
    await set(ref(database, `tests/${testId}/statistics/${statistics.finishedAt}`), JSON.stringify(statistics));
  }

  useEffect(() => {
    if (testId) {
      // Check if quiz was already completed
      const existingResult = QuizStorageManager.getResult(testId);
      if (existingResult) {
        setSavedResult(existingResult);
      }
    }
    if (quiz) {
      return;
    }
    const dbRef = ref(database);
    get(child(dbRef, `tests/${testId}/test`)).then((snapshot) => {
      console.log("Загружаем данные");
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
  }, [testId]);

  return (
    <>
      {
        (savedResult) ? <QuizResultView result={savedResult} onReset={handleReset}/> :
          <>
            {
              (quiz) ? <QuizComponent quiz={quiz} onReset={handleReset} saveStatistic={saveStatistic}/> :
                <div>LOADING ...</div>
            }
          </>
      }
    </>
  )
}
