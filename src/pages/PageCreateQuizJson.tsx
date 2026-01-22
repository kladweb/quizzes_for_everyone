import React, {useState} from "react";
import {QuizLoader} from "../components/QuizLoader/QuizLoader";
import {useUser} from "../store/useUserStore";

export const PageCreateQuizJson = () => {
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const user = useUser();

  return (
    <div className='tests-container'>
      {
        (user) ?
          <QuizLoader
            userUID={user.uid}
            setCurrentTestId={setCurrentTestId}
            setIsCreatingNewTest={setIsCreatingNewTest}
          /> :
          null
      }
    </div>
  )
}