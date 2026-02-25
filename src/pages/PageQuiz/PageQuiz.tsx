import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ref, set } from "firebase/database";
import { QuizComponent } from "../../components/QuizComponent/QuizComponent";
import { database } from "../../firebase/firebase";
import type { IStatistics, IQuizMeta, Question } from "../../types/Quiz";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { QuizResultView } from "../../components/QuizResultView/QuizResultView";
import { Loader } from "../../components/Loader/Loader";
import { PageEmpty } from "../PageEmpty/PageEmpty";
import { showToast } from "../../store/useNoticeStore";

export const PageQuiz = () => {
  const params = useParams();
  const testId = params.testid;
  const quizLocation = useLocation();
  const [quiz, setQuiz] = useState<IQuizMeta | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [savedResultStorage, setSavedResultStorage] = useState<IStatistics | null>(null);
  const [isPageEmpty, setIsPageEmpty] = useState(false);

  const handleReset = () => {
    if (testId) {
      const resultStorage = QuizStorageManager.getRecentStatTestId(testId);
      if (resultStorage) {
        QuizStorageManager.saveRecentStat({
          ...resultStorage,
          finishedAt: 0,
        });
      }
    }
    setSavedResultStorage(null);
  };

  const saveStatistic = async (statistics: IStatistics) => {
    await set(ref(database, `statistics/${testId}/${statistics.statId}`), JSON.stringify(statistics));
  }

  const loadQuizAndQuestions = async () => {
    if (testId) {
      try {
        const quizPromise = await Promise.all([QuizStorageManager.fetchCurrentQuiz(testId), QuizStorageManager.fetchQuestions(testId)]);
        setQuiz(quizPromise[0]);
        setQuestions(quizPromise[1]);
      } catch (error) {
        console.log(error);
        showToast("Ошибка загрузки данных!", "error");
      }
    }
  }

  useEffect(() => {
    if (quiz && quiz.testId === testId) {
      showToast("Вы уже на странице этого теста!\nТест пройден!", "info");
    }
  }, [quizLocation.key]);

  useEffect(() => {
    if (!testId) {
      return;
    }

    const existingStat = QuizStorageManager.getRecentStatTestId(testId);
    if (existingStat && existingStat.finishedAt) {
      setSavedResultStorage(existingStat);
    }

    if (!quiz || (quiz && quiz.testId !== testId)) {
      loadQuizAndQuestions();
      if (savedResultStorage) {
        setSavedResultStorage(null);
      }
    }
  }, [testId]);

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
