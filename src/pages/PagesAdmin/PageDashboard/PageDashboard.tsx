import React from "react";
import { useUsersExtraInfo } from "../../../store/useAdminStore";
import "./pageDashboard.css"

export const PageDashboard = () => {
  const usersExtraInfo = useUsersExtraInfo();

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
          <tr>
            <td>Общее количество созданных тестов:</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Количество тестов, созданных за последние 30 дней:</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Количество тестов, пройденных за последние 30 дней:</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Количество прохождений тестов незарегистрированными пользователями за последние 30 дней:</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
