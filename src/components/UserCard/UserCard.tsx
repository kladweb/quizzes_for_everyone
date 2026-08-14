import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IUserAdmin, ToastType } from "../../types/Quiz";
import { addTokensToUser } from "../../api/adminActions";
import { dateFormatter, getParamClassName } from "../../utils/formatters";
import { showToast } from "../../store/useNoticeStore";
import { updateUserExtraTokens } from "../../store/useAdminStore";

interface IUserCardProps {
  userAdmin: IUserAdmin,
  userUid: string
}

export const UserCard: React.FC<IUserCardProps> = ({userAdmin, userUid}) => {
  const [tokensCount, setTokensCount] = useState(0);

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
        <div>email:</div>
        <div>{userAdmin.email}</div>
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
      <div className="user-params-container">
        <div>Тарифный план:</div>
        <div>{userAdmin.tokensPlan}</div>
      </div>
      <div className="user-params-container">
        <div>Доступные токены:</div>
        <div>{userAdmin.tokensCurrentCount}</div>
      </div>
      <div className="user-params-container">
        <div>Дневной лимит:</div>
        <div>{userAdmin.tokensDailyCount}</div>
      </div>
      <div className="user-params-container">
        <div>Куплено токенов:</div>
        <div>{userAdmin.tokensExtraCount}</div>
      </div>
      <div className="user-params-container">
        <button
          className="btn add-tokens-btn"
          onClick={async () => {
            if (!userUid) return;
            try {
              const addTokensAction = await addTokensToUser(userUid, tokensCount);
              if (addTokensAction) {
                updateUserExtraTokens(userUid, tokensCount);
                setTokensCount(0);
              }
            } catch (e) {
              console.error(e);
              showToast("Ошибка добавления токенов. Попробуйте позже...", ToastType.ERROR);
            }
          }}>
          Добавить токенов:
        </button>
        <input
          className="input-tokens"
          type="range"
          name="questionCount"
          min="-100"
          max="100"
          step="10"
          value={tokensCount}
          onChange={(e) => setTokensCount(Number(e.target.value))}
        />
        <span className="tokens-count-info">{tokensCount}</span>
      </div>
    </div>
  )
}
