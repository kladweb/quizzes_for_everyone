import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { QuizAiLoader } from "../../components/QuizAiLoader/QuizAiLoader";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import { Loader } from "../../components/Loader/Loader";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { useUser } from "../../store/useUserStore";
import { clearCurrentQuiz, useIsJsonLoading, useQuizComplete, useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { useCanSpend } from "../../store/useTokensStore";

export const PageCreateQuizAI = () => {
  const navigate = useNavigate();
  const user = useUser();
  const quizDraft = useQuizDraft();
  const quizComplete = useQuizComplete();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const isCreatingQuiz = useIsJsonLoading();
  const canSpend = useCanSpend();

  useEffect(() => {
    return (
      () => {
        clearCurrentQuiz();
      }
    )
  }, []);

  if (!canSpend) {
    return <Navigate to="/createquiz" replace/>;
  }

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
