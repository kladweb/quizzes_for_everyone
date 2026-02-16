import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/useUserStore";
import {
  deleteUserQuiz,
  loadUserQuizzes,
  useIsLoading,
  useIsMyLoaded,
  useMyQuizzes
} from "../../store/useQuizzesStore";
import { useClearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { Loader } from "../../components/Loader/Loader";
import type { Quiz } from "../../types/Quiz";
import { QuizCard } from "../../components/TestsList/QuizCard";
import { ModalConfirm } from "../../components/ModalConfirm/ModalConfirm";
import "./PageMyQuizzes.css";

export const PageMyQuizzes: React.FC = () => {
  const user = useUser();
  const isMyLoaded = useIsMyLoaded();
  const isLoading = useIsLoading();
  const testsList = useMyQuizzes();
  const navigate = useNavigate();
  const locale = navigator.languages?.[0] || navigator.language;
  const formatter = new Intl.DateTimeFormat(locale);
  const [quizIdStatistics, setQuizIdStatistics] = useState<string | null>(null);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

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

  const handlerDeleteQuiz = (quiz: Quiz) => {
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
      if (isMyLoaded) {
        console.log("User data already loaded");
        return;
      }
      if (user) {
        console.log('loadUserQuizzes');
        loadUserQuizzes(user.uid);
      }
    }, []);

  return (
    <>
      <div className='tests-container'>
        <button className='btn button-create' onClick={createQuiz}>Создать новый тест</button>
        <h2 className="test-list-name">МОИ ТЕСТЫ</h2>
        <div className='test-list-block'>
          {
            (isLoading) ? <Loader/> :
              <>
                {testsList.map((quiz: Quiz) => (
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
