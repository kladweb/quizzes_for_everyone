import React, { useEffect, useState } from "react";
import { QuizAiLoader } from "../../components/QuizAiLoader/QuizAiLoader";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import { Loader } from "../../components/Loader/Loader";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { useUser } from "../../store/useUserStore";
import { clearCurrentQuiz, useIsJsonLoading, useQuizComplete, useQuizDraft } from "../../store/useCurrentCreatingQuiz";

export const PageCreateQuizAI = () => {
  const user = useUser();
  const quizDraft = useQuizDraft();
  const quizComplete = useQuizComplete();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const isCreatingQuiz = useIsJsonLoading();

  useEffect(() => {
    return (
      () => {
        clearCurrentQuiz();
      }
    )
  }, []);

  if (isCreatingQuiz) {
    return (
      <div className='loader-container'>
        <div className="loader-info-text">
          <p>Идёт создание теста...</p>
          <p>Это может занять несколько минут...</p>
        </div>
        <Loader/>
      </div>
    );
  }

  return (
    <div className='tests-container'>
      {
        (user && (!quizDraft && !quizComplete)) &&
        <QuizAiLoader/>
      }
      {
        (user && quizDraft) &&
        <>
          <h2 className="test-load-info">
            Тест
            <br/>
            <span>{`"${quizDraft.title}"`}</span>
            <br/>
            создан!
          </h2>
          <QuizLoaderExtraInfo userUID={user.uid} setIsCreatingNewTest={setIsCreatingNewTest}/>
        </>
      }
      {
        isCreatingNewTest &&
        <Loader/>
      }
      {
        (user && quizComplete) &&
        <LinkQuiz testId={quizComplete.testId}/>
      }
    </div>
  )
}
