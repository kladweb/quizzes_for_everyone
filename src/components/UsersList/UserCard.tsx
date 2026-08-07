import React from "react";
import { IUserAdmin } from "../../types/Quiz";
import { NavLink } from "react-router-dom";

interface IUserCardProps {
  userAdmin: IUserAdmin,
  userUid: string
}

export const UserCard: React.FC<IUserCardProps> = ({userAdmin, userUid}) => {

  const dateFormatter = (date: string) => {
    if (date === "unknown") {
      return date;
    }
    return new Date(date).toLocaleDateString('ru-RU')
  }

  const getParamClassName = (date: string) => {
    const dateNow = Date.now();
    if (date === "unknown") {
      return "param-yellow";
    }
    if (dateNow - Number(date) <= 2592000000) {
      return;
    }
    return "param-yellow";
  }

  return (
    <div className="user-card">
      <div className="user-name-container">
        <img src={userAdmin.photoURL} alt={userAdmin.displayName}/>
        <h2 className='user-name'>{userAdmin.displayName}</h2>
      </div>
      <div className="user-params-container">
        <div>uid:</div>
        <div>{userUid}</div>
      </div>
      <div className="user-params-container">
        <div>Количество созданных тестов:</div>
        {
          userAdmin.quizzesCount ?
            <NavLink to={`/admin/userquizzes/${userUid}`}>
              <div>{userAdmin.quizzesCount}</div>
            </NavLink>
            :
            <div>{userAdmin.quizzesCount}</div>
        }
      </div>
      <div className="user-params-container">
        <div>Тарифный план:</div>
        <div>{userAdmin.tokensPlan}</div>
      </div>
      <div className="user-params-container">
        <div>Имеется токенов:</div>
        <div>{userAdmin.tokensCurrentCount}</div>
      </div>
      <div className="user-params-container">
        <div>Дата регистрации:</div>
        <div className={getParamClassName(userAdmin.registrationDate)}>
          {dateFormatter(userAdmin.registrationDate)}
        </div>
      </div>
      <div className="user-params-container">
        <div>Последний визит:</div>
        <div className={getParamClassName(userAdmin.lastVisitedDate)}>
          {dateFormatter(userAdmin.lastVisitedDate)}
        </div>
      </div>
      <div className="user-params-container">
        <div>Последнее создание теста:</div>
        <div className={getParamClassName(userAdmin.lastCreatedQuizDate)}>
          {dateFormatter(userAdmin.lastCreatedQuizDate)}
        </div>
      </div>
      <div className="user-params-container">
        <div>Последнее прохождение:</div>
        <div className={getParamClassName(userAdmin.lastPassedQuizDate)}>
          {dateFormatter(userAdmin.lastPassedQuizDate)}
        </div>
      </div>
    </div>
  )
}
