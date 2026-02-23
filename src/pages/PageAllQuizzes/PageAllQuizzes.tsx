import React, { useEffect } from "react";
import { loadAllQuizzes, useAllQuizzes, useIsAllLoaded, useIsLoading } from "../../store/useQuizzesStore";
import "./pageAllQuizzes.css";
import { Loader } from "../../components/Loader/Loader";
import type { IQuizMeta } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { useUser } from "../../store/useUserStore";

export const PageAllQuizzes = () => {
  const isAllLoaded = useIsAllLoaded();
  const testsList = useAllQuizzes();
  const isLoading = useIsLoading();
  const user = useUser();
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);

  useEffect(
    () => {
      if (isAllLoaded) {
        console.log("All Quizzes already loaded");
        return;
      }
      console.log('loadAllQuizzes');
      loadAllQuizzes();
    }, []);


  return (
    <div className='tests-container'>
      <h2 className="test-list-name">СПИСОК ОБЩЕДОСТУПНЫХ ТЕСТОВ</h2>
      <div className='test-list-block'>
        {
          (isLoading) ? <Loader/> :
            <>
              {testsList.map((quiz: IQuizMeta) => (
                <QuizCard
                  key={quiz.testId}
                  quiz={quiz}
                  userUID={user?.uid}
                  dateFormatter={formatter}
                />)
              )}
            </>
        }
      </div>
    </div>
  )
}
