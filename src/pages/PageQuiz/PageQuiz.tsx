import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { child, get, ref, set } from "firebase/database";
import { QuizComponent } from "../../components/QuizComponent/QuizComponent";
import { database } from "../../firebase/firebase";
import type { IStatistics, IQuizMeta, Question } from "../../types/Quiz";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { QuizResultView } from "../../components/QuizResultView/QuizResultView";
import { Loader } from "../../components/Loader/Loader";
import { PageEmpty } from "../PageEmpty/PageEmpty";

export const PageQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const testId = params.testid;
  // const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState<IQuizMeta | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [savedResultStorage, setSavedResultStorage] = useState<IStatistics | null>(null);
  const [isPageEmpty, setIsPageEmpty] = useState(false);

  const handleReset = () => {
    // QuizStorageManager.clearResult();

    // console.log(testId)
    if (testId) {
      const resultStorage = QuizStorageManager.getRecentStatTestId(testId);
      if (resultStorage) {
        // console.log("Получили данные из localStorage: ", resultStorage);
        resultStorage.finishedAt = 0;
        // console.log("statistics 03: ", resultStorage);
        QuizStorageManager.saveRecentStat(resultStorage);
      }
    }
    setSavedResultStorage(null);
    // setTimeout(() => location.reload(), 0);
  };

  const saveStatistic = async (statistics: IStatistics) => {
    // console.log("saveStatistic", statistics);
    await set(ref(database, `statistics/${testId}/${statistics.statId}`), JSON.stringify(statistics));
  }

  useEffect(() => {
    if (!testId) {
      return;
    }
    const existingStat = QuizStorageManager.getRecentStatTestId(testId);
    if (existingStat && existingStat.finishedAt) {
      setSavedResultStorage(existingStat);
      // if (quiz) {
      //   return;
      // }
    }
    if (!quiz) {
      QuizStorageManager.fetchCurrentQuiz(testId)
        .then(quiz => {
          setQuiz(quiz);
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (!questions) {
      QuizStorageManager.fetchQuestions(testId)
        .then(questions => {
          setQuestions(questions);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return (
    <>
      {
        (savedResultStorage) ? <QuizResultView result={savedResultStorage} onReset={handleReset}/> :
          <>
            {
              (quiz && questions) ? <QuizComponent quiz={quiz} questions={questions} onReset={handleReset}
                                                   saveStatistic={saveStatistic}/> :
                <div className='loader-container'>
                  {
                    isPageEmpty ? <PageEmpty emptyReason="quizDeleted"/> : <Loader/>
                  }
                </div>
            }
          </>
      }
    </>
  )
}
