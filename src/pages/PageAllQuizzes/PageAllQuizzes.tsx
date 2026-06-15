import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { loadAllQuizzes, useAllQuizzes, useIsAllLoaded, useIsLoading } from "../../store/useQuizzesStore";
import { Loader } from "../../components/Loader/Loader";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/QuizCard/QuizCard";
import { useGuestUserId, useUser } from "../../store/useUserStore";
import { PAGE_SIZE } from "../../variables/quizData";
import { filterQuizzes, getUniqueCategories } from "../../utils/quizUtils";
import { FiltersMenu } from "../../components/FiltersMenu/FiltersMenu";
import "./pageAllQuizzes.css";

const ModalQRCodeLazy = lazy(() =>
  import("../../components/ModalQRCode/ModalQRCodeLazy").then((module) => ({
    default: module.ModalQRCodeLazy,
  })));

export const PageAllQuizzes = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {category} = useParams();
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const user = useUser();
  const isAllLoaded = useIsAllLoaded();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const guestUserId = useGuestUserId();
  const isLoading = useIsLoading();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [qrCodeToShow, setQrCodeToShow] = useState<string | null>(null);

  const testList = useMemo(() => {
    return Object.values(testsListObj ?? {})
      .filter(quiz => quiz.access !== "private")
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [testsListObj]);

  const uniqueCategories = getUniqueCategories(testList);

  const filtered = useMemo(() => {
    return filterQuizzes(testList, category, true);
  }, [testList, category]);

  const visibleQuizzes = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  useEffect(
    () => {
      document.title = "ВСЕ ТЕСТЫ | ANY QUIZ";
      if (isAllLoaded) {
        // console.log("All Quizzes already loaded");
        return;
      }
      // console.log('loadAllQuizzes');
      loadAllQuizzes();
    }, []);

  useEffect(
    () => {
      setVisibleCount(PAGE_SIZE);
    }, [testList.length, category]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry?.isIntersecting && visibleCount < testList.length) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    }, {root: null, rootMargin: "200px", threshold: 0.1,});
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, testList.length]);

  return (
    <div className='tests-container'>
      <h2 className="test-list-name">СПИСОК ОБЩЕДОСТУПНЫХ ТЕСТОВ</h2>
      <FiltersMenu category={category} uniqueCategories={uniqueCategories} pageQuizzes="allquizzes"/>
      <div className='test-list-block'>
        {
          (isLoading) ? <Loader/> :
            <AnimatePresence>
              {visibleQuizzes.map((quiz: IQuizMeta) => (
                <QuizCard
                  key={quiz.testId}
                  quiz={quiz}
                  userUID={user?.uid}
                  category={category}
                  guestUserId={guestUserId}
                  dateFormatter={formatter}
                  setQrCodeToShow={setQrCodeToShow}
                />)
              )}
            </AnimatePresence>
        }
      </div>
      {qrCodeToShow &&
        <Suspense fallback={null}>
          <ModalQRCodeLazy
            url={`https://any-quiz.netlify.app/quizzes/${qrCodeToShow}`}
            qrCodeToShow={qrCodeToShow}
            setQrCodeToShow={setQrCodeToShow}
          />
        </Suspense>
      }
      <div ref={sentinelRef} className="my-quizzes-sentinel"/>
    </div>
  )
}
