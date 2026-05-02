import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuestUserId, useUser } from "../../store/useUserStore";
import {
  deleteUserQuiz, loadUserIds, loadUserQuizzes, useAllQuizzes, useIsLoading, useIsMyIdsLoaded,
  useIsMyQuizzesLoaded, useMyQuizzesIds
} from "../../store/useQuizzesStore";
import { clearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { Loader } from "../../components/Loader/Loader";
import { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";
import { PageEmpty } from "../PageEmpty/PageEmpty";
import { filterQuizzes } from "../../utils/quizUtils";
import "./PageMyQuizzes.css";

export const PageMyQuizzes: React.FC = () => {
  const PAGE_SIZE = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
  const {category} = useParams();

  // const testList: IQuizMeta[] = Object.values(testsListObj ?? {})
  //   .filter(q => userQuizzesIds.includes(q.testId))
  //   .sort((a, b) => b.createdAt - a.createdAt);

  const testList = Object.values(testsListObj ?? {})
    .filter(q => userQuizzesIds.includes(q.testId))
    .sort((a, b) => b.createdAt - a.createdAt);

  const filtered = filterQuizzes(testList, category, true);
  const visibleQuizzes = filtered.slice(0, visibleCount);

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
      document.title = "МОИ ТЕСТЫ · ANY QUIZ";

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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [testList.length]);

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
                  />)
                )}
              </>
          }
        </div>
        {
          visibleCount < testList.length && (<div className="all-quizzes-load-more"><Loader/></div>)
        }
      </div>
      {
        quizToDelete &&
        <ModalConfirm
          isModalConfirmOpen={isModalConfirmOpen}
          modalQuestion={`Вы действительно хотите удалить тест\n"${quizToDelete.title}"\nбез возможности восстановления?`}
          handlerConfirmDelete={handlerConfirmDelete}
        />
      }
      <div ref={sentinelRef} className="my-quizzes-sentinel"/>
    </>
  );
};
