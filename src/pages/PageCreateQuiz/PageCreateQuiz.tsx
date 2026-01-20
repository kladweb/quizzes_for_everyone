import React from "react";
import { CreateQuizWay } from "../../components/CreateQuizWay/CreateQuizWay";
import { type IWayCardsData, wayCardsData } from "../../components/CreateQuizWay/wayCardsData";
import "./pageCreateQuiz.css";

export const PageCreateQuiz = () => {

  const handlerCreateWay = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.currentTarget.id);
  }

  return (
    <div className='creating-container'>
      <h1 className="creating-head">Создайте свой тест<br/>любым из способов</h1>
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
