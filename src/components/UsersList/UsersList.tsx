import "./userCard.css"
import { useEffect, useState } from "react";
import { getUsers } from "../../api/adminActions";
import { IUserAdmin, ToastType, UsersAdminMap } from "../../types/Quiz";
import { showToast } from "../../store/useNoticeStore";
import { UserCard } from "./UserCard";

export const UsersList = () => {

  const [users, setUsers] = useState<UsersAdminMap | null>(null);

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => {
        console.log(error);
        showToast('Ошибка получения данных!', ToastType.ERROR);
      });
  }, []);

  return (
    <div className="user-cards-container">
      {users && Object.keys(users).map((key: string) => (
        <UserCard userAdmin={users[key]} userUid={key} key={key}/>
      ))}
    </div>
  )
}
