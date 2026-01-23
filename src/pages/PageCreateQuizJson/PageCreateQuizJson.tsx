import React, { useState } from "react";
import { QuizLoader } from "../../components/QuizLoader/QuizLoader";
import { useUser } from "../../store/useUserStore";
import { useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import "./pageCreateQuizJson.css";
import { QuizLoaderExtraInfo } from "../../components/QuizLoaderExtraInfo/QuizLoaderExtraInfo";

export const PageCreateQuizJson = () => {
  const user = useUser();
  const quizDraft = useQuizDraft();

  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  return (
    <div className='tests-container'>
      {
        (user && !quizDraft) &&
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
          <QuizLoaderExtraInfo/>
        </>
      }
    </div>
  )
}
