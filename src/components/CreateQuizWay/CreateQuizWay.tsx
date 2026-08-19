import React from "react";
import { Link } from "react-router-dom";
import { IWayCardsData } from "./wayCardsData";
import "./createQuizWay.css";

interface ICreateQuizWayProps {
  card: IWayCardsData;
  handleStartCreating: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const CreateQuizWay: React.FC<ICreateQuizWayProps> = ({card, handleStartCreating}) => {
  const features = card.features;

  return (
    <Link
      className='card-way-container'
      id={card.id}
      to={`/createquiz/${card.id}`}
      onClick={handleStartCreating}
    >
      <h3>{card.head}</h3>
      <h4>Особенности метода:</h4>
      <ul>
        {
          features.map((feature, i) => <li key={i}>{feature}</li>)
        }
      </ul>
    </Link>
  )
}
