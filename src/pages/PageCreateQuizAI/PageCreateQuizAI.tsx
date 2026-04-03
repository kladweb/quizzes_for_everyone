import React, { useEffect, useState } from "react";
import { QuizAiLoader } from "../../components/QuizAiLoader/QuizAiLoader";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import { Loader } from "../../components/Loader/Loader";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { type IUser, useUser } from "../../store/useUserStore";
import { clearCurrentQuiz, useIsJsonLoading, useQuizComplete, useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { steps } from "../../variables/quizData";
import "./pageCreateQuizAI.css";

export const PageCreateQuizAI = () => {
  const user = useUser() as IUser;
  const userUID = user.uid;
  const quizDraft = useQuizDraft();
  const quizComplete = useQuizComplete();
  const isCreatingQuiz = useIsJsonLoading();
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  // const [jobUID, setJobUID] = useState<string | null>(null);

  const changeStepIndex = (questionCount: number) => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          clearInterval(interval);
        }
        return next;
      });
    }, questionCount * 750);
  };

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
          <p>{steps[stepIndex]}</p>
        </div>
        <Loader/>
      </div>
    );
  }

  return (
    <div className='tests-container'>
      {
        (user && (!quizDraft && !quizComplete)) &&
        <QuizAiLoader
          userUID={userUID}
          changeStepIndex={changeStepIndex}
        />
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
