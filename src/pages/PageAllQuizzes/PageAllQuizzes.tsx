import React, { useEffect } from "react";
import { loadAllQuizzes, useAllQuizzes, useIsAllLoaded, useIsLoading } from "../../store/useQuizzesStore";
import { Loader } from "../../components/Loader/Loader";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { useGuestUserId, useUser } from "../../store/useUserStore";
import "./pageAllQuizzes.css";

export const PageAllQuizzes = () => {
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const user = useUser();
  const isAllLoaded = useIsAllLoaded();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const guestUserId = useGuestUserId();
  const isLoading = useIsLoading();
  const testList: IQuizMeta[] = Object.values(testsListObj ? testsListObj : {})
    .filter(quiz => quiz.access !== "private");
  testList.sort((a, b) => b.createdAt - a.createdAt);

  useEffect(
    () => {
      document.title = "ВСЕ ТЕСТЫ · ANY QUIZ";
      if (isAllLoaded) {
        console.log("All Quizzes already loaded");
        return;
      }
      console.log('loadAllQuizzes');
      loadAllQuizzes();
    }, []);

  if (testsListObj) {
    console.log(Object.keys(testsListObj).length)
  }
  if (testList) {
    console.log(testList.length);
  }

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
                  guestUserId={guestUserId}
                  dateFormatter={formatter}
                />)
              )}
            </>
        }
      </div>
    </div>
  )
}
