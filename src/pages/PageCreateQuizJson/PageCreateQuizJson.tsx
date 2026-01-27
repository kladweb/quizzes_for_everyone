import React, {useState} from "react";
import {QuizLoader} from "../../components/QuizLoader/QuizLoader";
import {useUser} from "../../store/useUserStore";
import {useQuizComplete, useQuizDraft} from "../../store/useCurrentCreatingQuiz";
import "./pageCreateQuizJson.css";
import {QuizLoaderExtraInfo} from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";
import {Loader} from "../../components/Loader/Loader";

export const PageCreateQuizJson = () => {
  const user = useUser();
  const quizDraft = useQuizDraft();
  const quizComplete = useQuizComplete();

  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

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
          <h1 className="test-load-info">
            Тест
            <br/>
            <span>{` "${quizDraft.title}" `}</span>
            <br/>
            создан!
          </h1>
          <QuizLoaderExtraInfo userUID={user.uid} setIsCreatingNewTest={setIsCreatingNewTest}/>
        </>
      }
      {
        isCreatingNewTest &&
        <Loader/>
      }
    </div>
  )
}
