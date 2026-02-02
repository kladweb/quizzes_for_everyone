import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {CreateQuizWay} from "../../components/CreateQuizWay/CreateQuizWay";
import {type IWayCardsData, wayCardsData} from "../../components/CreateQuizWay/wayCardsData";
import {useUser} from "../../store/useUserStore";
import "./pageCreateQuiz.css";

export const PageCreateQuiz = () => {
  const navigate = useNavigate();
  const user = useUser();
  const handlerCreateWay = (e: React.MouseEvent<HTMLElement>) => {
    navigate(`/createquiz/${e.currentTarget.id}`);
    console.log(e.currentTarget.id);
  }

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, [user]);

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
