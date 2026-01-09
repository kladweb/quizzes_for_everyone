import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {child, get, ref, set} from "firebase/database";
import {QuizComponent} from "../../components/Quiz/Quiz";
import {database} from "../../firebase/firebase";
import type {IStatistics, Quiz} from "../../types/Quiz";
import {QuizStorageManager} from "../../utils/QuizStorageManager";
import {QuizResultView} from "../../components/QuizResultView/QuizResultView";
import {Loader} from "../../components/Loader/Loader";
import {PageEmpty} from "../PageEmpty/PageEmpty";

export const PageQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const testId = params.testid;
  // const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [savedResultStorage, setSavedResultStorage] = useState<IStatistics | null>(null);
  const [isPageEmpty, setIsPageEmpty] = useState(false);

  const handleReset = async () => {
    // QuizStorageManager.clearResult();
    console.log(testId)
    if (testId) {
      const resultStorage = await QuizStorageManager.getRecentStatTestId(testId);
      if (resultStorage) {
        console.log("Получили данные из localStorage: ", resultStorage);
        resultStorage.finishedAt = 0;
        console.log("statistics 03: ", resultStorage);
        await QuizStorageManager.saveRecentStat(resultStorage);
      }
    }
    setSavedResultStorage(null);
    // setTimeout(() => location.reload(), 0);
  };

  const saveStatistic = async (statistics: IStatistics) => {
    console.log("saveStatistic", statistics);
    await set(ref(database, `tests/${testId}/statistics/${statistics.finishedAt}`), JSON.stringify(statistics));
  }

  useEffect(() => {
    if (testId) {
      const existingStat = QuizStorageManager.getRecentStatTestId(testId);
      if (existingStat && existingStat.finishedAt) {
        setSavedResultStorage(existingStat);
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
        // console.log("DATA: ", quiz);
        setQuiz(quiz);
        // QuizStorageManager.saveRecentQuiz(recentQuiz);
      } else {
        console.log("No data available");
        setIsPageEmpty(true)
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <>
      {
        (savedResultStorage) ? <QuizResultView result={savedResultStorage} onReset={handleReset}/> :
          <>
            {
              (quiz) ? <QuizComponent quiz={quiz} onReset={handleReset} saveStatistic={saveStatistic}/> :
                <div className='loader-container'>
                  {
                    isPageEmpty ? <PageEmpty/> : <Loader/>
                  }
                </div>
            }
          </>
      }
    </>
  )
}
