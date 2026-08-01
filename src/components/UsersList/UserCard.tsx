import React from "react";
import { IUserAdmin } from "../../types/Quiz";

interface IUserCardProps {
  userAdmin: IUserAdmin,
  userUid: string
}

export const UserCard: React.FC<IUserCardProps> = ({userAdmin, userUid}) => {

  return (
    <div className="user-card">
      <div className="user-name-container">
        <img src={userAdmin.photoURL} alt={userAdmin.displayName}/>
        <h2 className='user-name'>{userAdmin.displayName}</h2>
      </div>
      <div className="user-params-container">
        <div>Количество созданных тестов:</div>
        <div>{userAdmin.quizzesCount}</div>
      </div>
      <div className="user-params-container">
        <div>Тарифный план:</div>
        <div>{userAdmin.tokensPlan}</div>
      </div>
      <div className="user-params-container">
        <div>Имеется токенов:</div>
        <div>{userAdmin.tokensCurrentCount}</div>
      </div>
    </div>
  )
}
