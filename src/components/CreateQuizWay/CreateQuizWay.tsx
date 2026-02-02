import React from "react";
import { IWayCardsData } from "./wayCardsData";
import "./createQuizWay.css";

interface ICreateQuizWayProps {
  card: IWayCardsData;
  handlerCreateWay: (e: React.MouseEvent<HTMLElement>) => void;
}

export const CreateQuizWay: React.FC<ICreateQuizWayProps> = ({card, handlerCreateWay}) => {
  const features = card.features;

  return (
    <div className='card-way-container' id={card.id} onClick={handlerCreateWay}>
      <h2>{card.head}</h2>
      <h3>Особенности метода:</h3>
      <ul>
        {
          features.map((feature, i) => <li key={i}>{feature}</li>)
        }
      </ul>
    </div>
  )
}
