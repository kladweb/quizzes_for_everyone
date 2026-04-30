import React, { useEffect, useMemo, useRef } from "react";
import {
  loadAllQuizzes,
  loadMoreAllQuizzes,
  useAllQuizzes,
  useIsAllLoaded,
  useIsLoading,
  useIsLoadingAllMore
} from "../../store/useQuizzesStore";
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
  const isLoadingAllMore = useIsLoadingAllMore();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const guestUserId = useGuestUserId();
  const isLoading = useIsLoading();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const testList: IQuizMeta[] = useMemo(() => {
    const quizzes = Object.values(testsListObj ? testsListObj : {}).filter((quiz) => quiz.access !== "private");
    // quizzes.sort((a, b) => b.createdAt - a.createdAt);
    return quizzes;
  }, [testsListObj]);

  useEffect(() => {
    document.title = "ВСЕ ТЕСТЫ · ANY QUIZ";
    loadAllQuizzes();
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || isLoading || isLoadingAllMore || isAllLoaded) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];

      if (firstEntry?.isIntersecting && !isLoading && !isLoadingAllMore && !isAllLoaded) {
        loadMoreAllQuizzes();
      }
    }, {root: null, rootMargin: "300px", threshold: 0.1,});
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, isLoadingAllMore, isAllLoaded, testList.length]);

  return (
    <div className='tests-container'>
      <h2 className="test-list-name">СПИСОК ОБЩЕДОСТУПНЫХ ТЕСТОВ</h2>
      <div className='test-list-block'>
        {
          (isLoading) ?
            <Loader/> :
            <>
              {
                testList.map((quiz: IQuizMeta) => (
                  <QuizCard
                    key={quiz.testId}
                    quiz={quiz}
                    userUID={user?.uid}
                    guestUserId={guestUserId}
                    dateFormatter={formatter}
                  />))
              }
              {
                isLoadingAllMore &&
                <div className="all-quizzes-load-more">
                  <Loader/>
                </div>
              }
              <div ref={sentinelRef} className="all-quizzes-sentinel"/>
            </>
        }
      </div>
    </div>
  )
}
