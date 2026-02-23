import React, { useEffect } from "react";
import { loadAllQuizzes, useAllQuizzes, useIsAllLoaded, useIsLoading } from "../../store/useQuizzesStore";
import { Loader } from "../../components/Loader/Loader";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { useUser } from "../../store/useUserStore";
import "./pageAllQuizzes.css";

export const PageAllQuizzes = () => {
  const isAllLoaded = useIsAllLoaded();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const testList: IQuizMeta[] = Object.values(testsListObj ? testsListObj : {});
  testList.sort((a, b) => b.createdAt - a.createdAt);
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
              {testList.map((quiz: IQuizMeta) => (
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
