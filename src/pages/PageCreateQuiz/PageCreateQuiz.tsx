import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateQuizWay } from "../../components/CreateQuizWay/CreateQuizWay";
import { type IWayCardsData, wayCardsData } from "../../components/CreateQuizWay/wayCardsData";
import { showToast } from "../../store/useNoticeStore";
import { ToastType } from "../../types/Quiz";
import { useCanSpend } from "../../store/useTokensStore";
import { clearCurrentQuiz } from "../../store/useCurrentCreatingQuiz";
import "./pageCreateQuiz.css";

export const PageCreateQuiz = () => {
  const navigate = useNavigate();
  const canSpend = useCanSpend();

  const handlerCreateWay = (e: React.MouseEvent<HTMLElement>) => {

    if (e.currentTarget.id === "ai" && !canSpend) {
      showToast("У Вас недостаточно токенов.", ToastType.WARNING);
      return;
    }

    navigate(`/createquiz/${e.currentTarget.id}`);
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
            handlerCreateWay={handlerCreateWay}
          />)
      }
    </div>
  )
}
