import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/useUserStore";
import {
  deleteUserQuiz, loadUserIds, loadUserQuizzes, useAllQuizzes, useIsAllLoaded, useIsLoading, useIsMyIdsLoaded,
  useIsMyQuizzesLoaded, useMyQuizzesIds
} from "../../store/useQuizzesStore";
import { useClearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { Loader } from "../../components/Loader/Loader";
import { IQuizMeta, IQuizzes } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";
import "./PageMyQuizzes.css";

export const PageMyQuizzes: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const isMyIdsLoaded = useIsMyIdsLoaded();
  const isMyQuizzesLoaded = useIsMyQuizzesLoaded();
  const isAllLoaded = useIsAllLoaded();
  const isLoading = useIsLoading();
  const userQuizzesIds = useMyQuizzesIds();
  const testsListObj: IQuizzes | null = useAllQuizzes();
  const testList: IQuizMeta[] = [];
  // const testList: IQuizMeta[] = Object.values(testsListObj ? testsListObj : {});
  // testList.sort((a, b) => b.createdAt - a.createdAt);
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const [quizIdStatistics, setQuizIdStatistics] = useState<string | null>(null);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [quizToDelete, setQuizToDelete] = useState<IQuizMeta | null>(null);

  for (let key in testsListObj) {
    if (userQuizzesIds.includes(key)) {
      testList.push(testsListObj[key]);
    }
  }
  testList.sort((a, b) => b.createdAt - a.createdAt);

  const createQuiz = () => {
    useClearCurrentQuiz();
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
      if (!isMyIdsLoaded && user?.uid) {
        loadUserIds(user.uid)
      }

      if (isAllLoaded || isMyQuizzesLoaded) {
        console.log("User data already loaded");
        return;
      }

      if (user) {
        console.log('loadUserQuizzes');
        loadUserQuizzes(user.uid);
      }
      // if (isMyLoaded) {
      //   console.log("User data already loaded");
      //   return;
      // }
      // if (user) {
      //   console.log('loadUserQuizzes');
      //   loadUserQuizzes(user.uid);
      // }
    }, [isMyIdsLoaded]);

  return (
    <>
      <div className='tests-container'>
        <button className='btn button-create' onClick={createQuiz}>Создать новый тест</button>
        <h2 className="test-list-name">МОИ ТЕСТЫ</h2>
        <div className='test-list-block'>
          {
            (isLoading) ? <Loader/> :
              <>
                {testList.map((quiz: IQuizMeta) => (
                  <QuizCard
                    key={quiz.testId}
                    quiz={quiz}
                    openStatistic={openStatistic}
                    dateFormatter={formatter}
                    userUID={user?.uid}
                    isShowStatistics={!!quizIdStatistics && quizIdStatistics === quiz.testId}
                    handlerDeleteQuiz={handlerDeleteQuiz}
                  />)
                )}
              </>
          }
        </div>
      </div>
      {
        quizToDelete &&
        <ModalConfirm
          isModalConfirmOpen={isModalConfirmOpen}
          modalQuestion={`Вы действительно хотите удалить тест\n"${quizToDelete.title}"\nбез возможности восстановления?`}
          handlerConfirmDelete={handlerConfirmDelete}
        />
      }
    </>
  );
};
