import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateQuizWay } from "../../components/CreateQuizWay/CreateQuizWay";
import { type IWayCardsData, wayCardsData } from "../../components/CreateQuizWay/wayCardsData";
import { clearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import { loginGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";
import { showToast } from "../../store/useNoticeStore";
import { ToastType } from "../../types/Quiz";
import "./pageCreateQuiz.css";

export const PageCreateQuiz = () => {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();
  const [isStartedCreating, setIsStartedCreating] = useState(0);

  const handleStartCreating = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isStartedCreating > 5) {
      showToast("Превышено количество попыток...", ToastType.ERROR);
      navigate("/");
      return;
    }
    if (!user) {
      if (isStartedCreating) {
        showToast("Пожалуйста, авторизуйтесь для продолжения...", ToastType.WARNING);
      }
      setIsStartedCreating(prevState => prevState + 1);
      e.preventDefault();
      e.stopPropagation();
    } else {
      setIsStartedCreating(0);
    }
  }

  useEffect(() => {
    document.title = "Создать интерактивный тест или викторину | ANY QUIZ";
    clearCurrentQuiz();
    return () => {
      document.title = "ANY QUIZ";
    };
  }, []);

  return (
    <div className='creating-container'>
      <h2 className="creating-head">Создайте свой тест<br/>любым из способов</h2>
      {
        wayCardsData.map((card: IWayCardsData) =>
          <CreateQuizWay
            key={card.id}
            card={card}
            handleStartCreating={handleStartCreating}
          />)
      }
      {
        (!user && isStartedCreating) &&
        <div className='noticeBlock'>
          <p className='noticeText'>Авторизуйтесь, чтобы начать создавать свои тесты...</p>
          <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
            {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
          </button>
        </div>
      }
    </div>
  )
}
