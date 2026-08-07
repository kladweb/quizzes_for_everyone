import React, { useEffect, useMemo, useRef, useState } from "react";
import { useUsers } from "../../store/useAdminStore";
import { useParams } from "react-router-dom";
import { ToastType } from "../../types/Quiz";
import type { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { deleteUserQuiz, loadAllQuizzes, useAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { showToast } from "../../store/useNoticeStore";
import { PAGE_SIZE } from "../../variables/quizData";
import { QuizCard } from "../../components/QuizCard/QuizCard";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";

export const PageUserQuizzes = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isAllLoaded = useIsAllLoaded();
  const users = useUsers();
  const params = useParams();
  const userID = params.userid;
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [testList, setTestList] = useState<IQuizMeta[]>([]);
  const [quizToDelete, setQuizToDelete] = useState<IQuizMeta | null>(null);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);

  const visibleQuizzes: IQuizMeta[] = useMemo(() => {
    return testList.slice(0, visibleCount);
  }, [testList, visibleCount]);

  const handlerDeleteQuiz = (quiz: IQuizMeta) => {
    setQuizToDelete(quiz);
    setIsModalConfirmOpen(true);
  }

  useEffect(
    () => {
      if (!isAllLoaded) {
        loadAllQuizzes();
      }
    }, []);

  const handlerConfirmDelete = async (toDelete: boolean) => {
    if (!quizToDelete?.testId) {
      return;
    }
    if (toDelete && userID) {
      await deleteUserQuiz(quizToDelete?.testId, userID);
    }
    setIsModalConfirmOpen(false);
  }

  useEffect(() => {
    if (!(userID && testsListObj)) {
      return;
    }
    QuizStorageManager.fetchUserQuizIds(userID)
      .then((quizzesIds) => {
        const testList = Object.values(testsListObj)
          .filter(q => quizzesIds.includes(q.testId))
          .sort((a, b) => b.createdAt - a.createdAt);
        setTestList(testList);
      })
      .catch((error) => {
        console.log(error);
        showToast('Ошибка загрузки данных!', ToastType.ERROR);
      });
  }, [isAllLoaded]);

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
    <>
      {
        (users && userID) &&
        <h2 className="test-list-name">ТЕСТЫ ПОЛЬЗОВАТЕЛЯ: <span>{users[userID].displayName}</span></h2>
      }
      <div className='test-list-block'>
        {
          visibleQuizzes &&
          <>
            {visibleQuizzes.map((quiz: IQuizMeta) => (
              <QuizCard
                key={quiz.testId}
                quiz={quiz}
                userUID={userID}
                guestUserId={null}
                handlerDeleteQuiz={handlerDeleteQuiz}
              />)
            )}
          </>
        }
      </div>
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        modalQuestion={`Вы действительно хотите удалить тест\n"${quizToDelete?.title}"\nбез возможности восстановления?`}
        handlerConfirmDelete={handlerConfirmDelete}
      />
      <div ref={sentinelRef} className="my-quizzes-sentinel"/>
    </>
  );
}
