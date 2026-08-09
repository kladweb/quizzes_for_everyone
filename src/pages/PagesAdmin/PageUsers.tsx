import { useEffect, useState } from "react";
import { UserCard } from "../../components/UsersList/UserCard";
import { loadUsers, useIsLoadedUsers, useUsers } from "../../store/useAdminStore";
import { type IUserParams, userParams } from "../../variables/quizData";
import { FiltersUsers } from "../../components/FiltersUsers/FiltersUsers";
import "../../components/UsersList/userCard.css"
import { IUserAdmin, type UsersAdminMap } from "../../types/Quiz";

export const PageUsers = () => {
  const users: UsersAdminMap | null = useUsers();
  const isLoadedUsers = useIsLoadedUsers();
  const [userParam, setUserParam] = useState<IUserParams>("quizzesCount");

  useEffect(() => {
    if (!isLoadedUsers) {
      loadUsers();
    }
  }, []);

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
