import { UserCard } from "../../components/UsersList/UserCard";
import { useUsers } from "../../store/useAdminStore";
import "../../components/UsersList/userCard.css"

export const PageUsers = () => {
  const users = useUsers();

  return (
    <div className="user-cards-container">
      {users && Object.keys(users).map((key: string) => (
        <UserCard userAdmin={users[key]} userUid={key} key={key}/>
      ))}
    </div>
  )
}
