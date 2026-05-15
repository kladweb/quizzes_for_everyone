import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuestUserId, useUser } from "../../store/useUserStore";
import {
  deleteUserQuiz, loadUserIds, loadUserQuizzes, useAllQuizzes, useIsLoading, useIsMyIdsLoaded,
  useIsMyQuizzesLoaded, useMyQuizzesIds
} from "../../store/useQuizzesStore";
import { clearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { Loader } from "../../components/Loader/Loader";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";
import { PageEmpty } from "../PageEmpty/PageEmpty";
import { filterQuizzes, getUniqueCategories } from "../../utils/quizUtils";
import { PAGE_SIZE } from "../../variables/quizData";
import { FiltersMenu } from "../../components/FiltersMenu/FiltersMenu";
import "./PageMyQuizzes.css";
import { ModalQRCode } from "../../components/ModalQRCode/ModalQRCode";

export const PageMyQuizzes: React.FC = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {category} = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const isMyIdsLoaded = useIsMyIdsLoaded();
  const isMyQuizzesLoaded = useIsMyQuizzesLoaded();
  const isLoading = useIsLoading();
  const userQuizzesIds = useMyQuizzesIds();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const guestUserId = useGuestUserId();
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const [quizIdStatistics, setQuizIdStatistics] = useState<string | null>(null);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [quizToDelete, setQuizToDelete] = useState<IQuizMeta | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [qrCodeToShow, setQrCodeToShow] = useState<string | null>(null);

  const testList = useMemo(() => {
    return Object.values(testsListObj ?? {})
      .filter(q => userQuizzesIds.includes(q.testId))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [testsListObj, userQuizzesIds]);

  const uniqueCategories = getUniqueCategories(testList);

  const filtered = useMemo(() => {
    return filterQuizzes(testList, category, true);
  }, [testList, category]);

  const visibleQuizzes = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const createQuiz = () => {
    clearCurrentQuiz();
    navigate("/createquiz");
  }

  const openStatistic = (testId: string) => {
    if (quizIdStatistics !== testId) {
      setQuizIdStatistics(testId);
    } else {
      setQuizIdStatistics(null);
    }
  }

  const handlerDeleteQuiz = (quiz: IQuizMeta) => {
    setQuizToDelete(quiz);
    setIsModalConfirmOpen(true);
  }

  const handlerConfirmDelete = async (toDelete: boolean) => {
    if (!user || !quizToDelete?.testId) {
      return;
    }
    if (toDelete) {
      await deleteUserQuiz(quizToDelete?.testId, user.uid);
    }
    setIsModalConfirmOpen(false);
  }

  useEffect(
    () => {
      document.title = "МОИ ТЕСТЫ | ANY QUIZ";

      if (isMyQuizzesLoaded) {
        // console.log("User data already loaded");
        return;
      }
      if (!isMyIdsLoaded && user?.uid) {
        loadUserIds(user.uid)
      }
      if (isMyIdsLoaded && user?.uid) {
        // console.log('loadUserQuizzes');
        loadUserQuizzes(user.uid);
      }
    }, [isMyIdsLoaded]);

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

  if (userQuizzesIds.length === 0 && !isLoading) {
    return (
      <PageEmpty emptyReason="noCreatedQuizzes"/>
    )
  }

  return (
    <>
      <div className='tests-container'>
        <button className='btn button-create' onClick={createQuiz}>Создать новый тест</button>
        <h2 className="test-list-name">МОИ ТЕСТЫ</h2>
        <FiltersMenu category={category} uniqueCategories={uniqueCategories} pageQuizzes="myquizzes"/>
        <div className='test-list-block'>
          {
            (isLoading) ? <Loader/> :
              <>
                {visibleQuizzes.map((quiz: IQuizMeta) => (
                  <QuizCard
                    key={quiz.testId}
                    quiz={quiz}
                    userUID={user?.uid}
                    guestUserId={guestUserId}
                    dateFormatter={formatter}
                    openStatistic={openStatistic}
                    isShowStatistics={!!quizIdStatistics && quizIdStatistics === quiz.testId}
                    handlerDeleteQuiz={handlerDeleteQuiz}
                    setQrCodeToShow={setQrCodeToShow}
                  />)
                )}
              </>
          }
        </div>
        {
          visibleCount < testList.length && (<div className="all-quizzes-load-more"><Loader/></div>)
        }
      </div>
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        modalQuestion={`Вы действительно хотите удалить тест\n"${quizToDelete?.title}"\nбез возможности восстановления?`}
        handlerConfirmDelete={handlerConfirmDelete}
      />
      <ModalQRCode
        url={`https://any-quiz.netlify.app/quizzes/${qrCodeToShow}`}
        qrCodeToShow={qrCodeToShow}
        setQrCodeToShow={setQrCodeToShow}
      />
      <div ref={sentinelRef} className="my-quizzes-sentinel"/>
    </>
  );
};
