import { useEffect, useState } from "react";
import { UserCard } from "../../components/UsersList/UserCard";
import { loadUsers, useAdminLoadError, useIsLoadedUsers, useUsers } from "../../store/useAdminStore";
import { type IUserParams, userParams } from "../../variables/quizData";
import { FiltersUsers } from "../../components/FiltersUsers/FiltersUsers";
import "../../components/UsersList/userCard.css"
import { type IUserAdmin, ToastType, type UsersAdminMap } from "../../types/Quiz";
import { showToast } from "../../store/useNoticeStore";
import { useNavigate } from "react-router-dom";

export const PageUsers = () => {
  const navigate = useNavigate();
  const users: UsersAdminMap | null = useUsers();
  const loadError = useAdminLoadError();
  const isLoadedUsers = useIsLoadedUsers();
  const [userParam, setUserParam] = useState<IUserParams>("quizzesCount");

  useEffect(() => {
    if (!isLoadedUsers) {
      loadUsers();
    }
  }, []);

  useEffect(() => {
    if (loadError) {
      navigate("/admin");
      showToast("Ошибка загрузки данных", ToastType.ERROR);
    }
  }, [loadError]);

  if (!users) {
    return null;
  }

  return (
    <>
      <FiltersUsers setUserParam={setUserParam}/>
      <div className="user-cards-container">
        {Object.keys(users)
          .sort((a, b) => {
            const valueAobj: IUserAdmin = users[a];
            const valueBobj: IUserAdmin = users[b];
            const valueA = valueAobj[userParam];
            const valueB = valueBobj[userParam];
            return valueB - valueA;
          })
          .map((key: string) => (
            <UserCard userAdmin={users[key]} userUid={key} key={key}/>
          ))
        }
      </div>
    </>
  )
}
