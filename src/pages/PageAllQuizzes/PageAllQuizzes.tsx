import React, { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  loadAllQuizzes,
  loadMoreAllQuizzes,
  useAllQuizzes,
  useIsAllLoaded,
  useIsLoading,
  useIsLoadingAllMore,
} from "../../store/useQuizzesStore";

import { Loader } from "../../components/Loader/Loader";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { useGuestUserId, useUser } from "../../store/useUserStore";
import { filterQuizzes } from "../../utils/quizUtils";
import { FiltersMenu } from "../../components/FiltersMenu/FiltersMenu";

import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import "./pageAllQuizzes.css";

export const PageAllQuizzes = () => {
  const user = useUser();
  const guestUserId = useGuestUserId();

  const isLoading = useIsLoading();
  const isLoadingAllMore = useIsLoadingAllMore();
  const isAllLoaded = useIsAllLoaded();

  const testsListObj: IQuizzes | null = useAllQuizzes();

  const { category } = useParams();

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const formatter = useMemo(() => {
    const locale = navigator.languages?.[0] || navigator.language;
    return new Intl.DateTimeFormat(locale);
  }, []);

  const testList: IQuizMeta[] = useMemo(() => {
    const quizzes = filterQuizzes(
      Object.values(testsListObj ?? {}),
      category,
      false // public only
    );

    // quizzes.sort((a, b) => b.createdAt - a.createdAt);
    return quizzes;
  }, [testsListObj, category]);

  // 1. initial load
  useEffect(() => {
    document.title = "ВСЕ ТЕСТЫ · ANY QUIZ";
    loadAllQuizzes();
  }, []);

  // 2. stable observer (НЕ пересоздаём постоянно)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        if (isLoading || isLoadingAllMore || isAllLoaded) return;

        loadMoreAllQuizzes();
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [isLoading, isLoadingAllMore, isAllLoaded, testList.length]);

  console.log("RENDER")

  return (
    <div className="tests-container">
      <h2 className="test-list-name">СПИСОК ОБЩЕДОСТУПНЫХ ТЕСТОВ</h2>

      <FiltersMenu category={category} pageQuizzes="allquizzes" />

      <div className="test-list-block">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {testList.map((quiz: IQuizMeta) => (
              <QuizCard
                key={quiz.testId}
                quiz={quiz}
                userUID={user?.uid}
                guestUserId={guestUserId}
                dateFormatter={formatter}
              />
            ))}

            {isLoadingAllMore && (
              <div className="all-quizzes-load-more">
                <Loader />
              </div>
            )}

            <div ref={sentinelRef} className="all-quizzes-sentinel" />
          </>
        )}
      </div>
    </div>
  );
};
