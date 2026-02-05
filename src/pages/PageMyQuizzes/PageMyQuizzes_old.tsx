import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizLoader } from "../../components/QuizLoader/QuizLoader";
import { LinkQuiz } from "../../components/LinkQuiz/LinkQuiz";
import { TestList } from "../../components/TestList/TestList";
import { useUser } from "../../store/useUserStore";
import { loadUserQuizzes, useIsMyLoaded, useMyQuizzes } from "../../store/useQuizzesStore";
import { useClearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import "./PageMyQuizzes.css";

export const PageMyQuizzes: React.FC = () => {
  const user = useUser();
  const testList = useMyQuizzes();
  const isMyLoaded = useIsMyLoaded();
  const navigate = useNavigate();
  const [isNotice, setIsNotice] = useState(true);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  const createQuiz = () => {
    useClearCurrentQuiz();
    navigate("/createquiz");
  }

  useEffect(
    () => {
      if (isMyLoaded) {
        console.log("User data already loaded");
        return;
      }
      if (user) {
        console.log('loadUserQuizzes');
        loadUserQuizzes(user.uid);
      }
    }, []);

  return (
    <>
      <div className='tests-container'>
        <button className='btn button-create' onClick={createQuiz}>Создать новый тест</button>
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
