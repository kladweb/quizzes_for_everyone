import { UserCard } from "../../components/UsersList/UserCard";
import { loadUsers, useIsLoadedUsers, useUsers } from "../../store/useAdminStore";
import "../../components/UsersList/userCard.css"
import { useEffect } from "react";

export const PageUsers = () => {
  const users = useUsers();
  const isLoadedUsers = useIsLoadedUsers();

  useEffect(() => {
    if (!isLoadedUsers) {
      loadUsers();
    }
  }, []);

  return (
    <div className="user-cards-container">
      {users && Object.keys(users).map((key: string) => (
        <UserCard userAdmin={users[key]} userUid={key} key={key}/>
      ))}
    </div>
  )
}
