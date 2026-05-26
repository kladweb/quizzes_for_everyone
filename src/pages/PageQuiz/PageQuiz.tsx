import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ref, set } from "firebase/database";
import { QuizComponent } from "../../components/QuizComponent/QuizComponent";
import { database } from "../../firebase/firebase";
import { IStatistics, IQuizMeta, Question, ToastType, IAnswer } from "../../types/Quiz";
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
    console.log("сделали сброс");
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

  // const loadQuizAndQuestions = async () => {
  //   if (testId) {
  //     try {
  //       const [quizData, questionData] = await Promise.all([QuizStorageManager.fetchCurrentQuiz(testId), QuizStorageManager.fetchQuestions(testId)]);
  //       if (quizData && questionData) {
  //         setQuiz(quizData);
  //         setQuestions(questionData);
  //       } else {
  //         setIsPageEmpty(true);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       showToast("Ошибка загрузки данных!", ToastType.ERROR);
  //     }
  //   }
  // }

  useEffect(() => {
    if (quiz && quiz.testId === testId) {
      showToast("Вы уже на странице этого теста!\nТест пройден!", ToastType.INFO);
    }
  }, [quizLocation.key]);

  useEffect(() => {
    if (!testId) {
      return;
    }
    let existingStat = QuizStorageManager.getRecentStatTestId(testId);

    if (existingStat && existingStat.finishedAt) {

      // Template format old data for statistics from localStorage
      if (Array.isArray(existingStat.answers)) {
        const answersMod: Record<string, any> = {};
        existingStat.answers.forEach((answer) => {
          answersMod[answer.questionId] = {};
          Object.keys(answer).forEach((key) => {
            answersMod[answer.questionId][key] = answer[key];
          });
        });
        console.log(answersMod);
        existingStat.answers = answersMod;
      }

      setSavedResultStorage(existingStat);
    }

    // if (!quiz || (quiz && quiz.testId !== testId)) {
    //   loadQuizAndQuestions();
    //   if (savedResultStorage) {
    //     setSavedResultStorage(null);
    //   }
    // }

    if (quiz?.testId !== testId) {
      setQuiz(null);
      setQuestions(null);
      QuizStorageManager.loadQuizAndQuestions(testId)
        .then((quiz) => {
          if (quiz && quiz.questions) {
            setQuiz({...quiz});
            setQuestions([...quiz.questions]);
          } else {
            setIsPageEmpty(true);
          }
        })
        .catch((err) => {
          console.error(err);
          showToast('Ошибка загрузки теста...', ToastType.ERROR);
        })
      if (savedResultStorage) {
        setSavedResultStorage(null);
      }
    }

    if (quiz?.title) {
      document.title = `${quiz.title} | ANY QUIZ`;
    }

  }, [testId, quiz?.title]);

  if (savedResultStorage && quiz) {
    return <QuizResultView result={savedResultStorage} quiz={quiz} onReset={handleReset}/>;
  }

  if (!quiz || !questions) {
    return (
      <div className="loader-container">
        {isPageEmpty ? <PageEmpty emptyReason="quizDeleted"/> : <Loader/>}
      </div>
    );
  }

  return (
    <QuizComponent
      quiz={quiz}
      questions={questions}
      onReset={handleReset}
      saveStatistic={saveStatistic}
    />
  );
}
