import React, { useEffect } from "react";
import { loadUsers, useIsLoadedUsers, useUsersExtraInfo } from "../../store/useAdminStore";

export const PageUsersInfo = () => {
  const usersExtraInfo = useUsersExtraInfo();

  const isLoadedUsers = useIsLoadedUsers();

  useEffect(() => {
    if (!isLoadedUsers) {
      loadUsers();
    }
  }, []);

  if (!usersExtraInfo) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <table>
        <tbody>
          <tr>
            <td>Общее количество зарегистрированных пользователей:</td>
            <td>{usersExtraInfo.countAllUsers}</td>
          </tr>
          <tr>
            <td>Количество новых зарегистрированных пользователей за последние 30 дней:</td>
            <td>{usersExtraInfo.countUsersReg}</td>
          </tr>
          <tr>
            <td>Количество зарегистрированных пользователей, посетивших сайт за последние 30 дней:</td>
            <td>{usersExtraInfo.countUsersVisited}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
