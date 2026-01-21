import React, {useEffect, useState} from "react";
import {QuizLoader} from "../../components/QuizLoader/QuizLoader";
import {LinkQuiz} from "../../components/LinkQuiz/LinkQuiz";
import {TestList} from "../../components/TestList/TestList";
import {loginGoogle, logoutGoogle, initUser, useUser} from "../../store/useUserStore";
import {loadUserQuizzes, useMyQuizzes} from "../../store/useMyQuizzesStore";
import "./PageMyQuizzes.css";

export const PageMyQuizzes: React.FC = () => {
  const user = useUser();
  const testList = useMyQuizzes();
  const [isNotice, setIsNotice] = useState(true);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  useEffect(
    () => {
      if (user) {
        loadUserQuizzes(user.uid);
      }
    }, [user?.uid]);

  const createTest = () => {
    console.log('Creating test...');
    if (user) {
      setCurrentTestId(null);
      setIsCreatingNewTest(true);
    } else {
      setIsNotice(false);
      setTimeout(() => setIsNotice(true), 2000);
    }
  }

  return (
    <>
      <div className='tests-container'>
        <button className='btn button-create' onClick={createTest}>Создать новый тест</button>
        <div className={`noticeBlock${(isNotice ? " close" : "")}`}>
          <p className='noticeText'>Сначала нужно войти в систему!</p>
          <p className='noticeText'>Нажните кнопку GOOGLE LOGIN!</p>
        </div>
        {
          (user && isCreatingNewTest) ?
            <QuizLoader
              userUID={user.uid}
              setCurrentTestId={setCurrentTestId}
              setIsCreatingNewTest={setIsCreatingNewTest}
            /> :
            null
        }
        {
          currentTestId ? <LinkQuiz testId={currentTestId}/> : null
        }
      </div>
      {
        user ? <TestList testList={testList} userUID={user.uid}/> : null
      }
    </>
  );
};
