import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {QuizLoader} from "../../components/QuizLoader/QuizLoader";
import {QuizLoaderExtraInfo} from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import {Loader} from "../../components/Loader/Loader";
import {LinkQuiz} from "../../components/LinkQuiz/LinkQuiz";
import {useQuizComplete, useQuizDraft} from "../../store/useCurrentCreatingQuiz";
import {useUser} from "../../store/useUserStore";
import "./pageCreateQuizJson.css";

export const PageCreateQuizJson = () => {
  const user = useUser();
  const quizDraft = useQuizDraft();
  const quizComplete = useQuizComplete();
  const navigate = useNavigate();
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user?.uid])

  return (
    <div className='tests-container'>
      {
        (user && (!quizDraft && !quizComplete)) &&
        <QuizLoader
          userUID={user.uid}
          setCurrentTestId={setCurrentTestId}
          setIsCreatingNewTest={setIsCreatingNewTest}
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
        (user && quizComplete && quizComplete) &&
        <LinkQuiz testId={quizComplete.testId}/>
      }
    </div>
  )
}
