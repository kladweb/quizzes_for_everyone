import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadUsers, useAdminLoadError, useIsLoadedUsers, useUsersExtraInfo } from "../../store/useAdminStore";
import { showToast } from "../../store/useNoticeStore";
import { ToastType } from "../../types/Quiz";

export const PageUsersInfo = () => {
  const navigate = useNavigate();
  const loadError = useAdminLoadError();
  const usersExtraInfo = useUsersExtraInfo();

  const isLoadedUsers = useIsLoadedUsers();

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
