import React, { useEffect } from "react";
import { loadQuizzesStatInfo, useIsLoadedStatInfo, useQuizzesStatInfo, } from "../../store/useAdminStore";

export const PageQuizzesStatistics = () => {
  const quizzesStatInfo = useQuizzesStatInfo();
  const isLoadedStatInfo = useIsLoadedStatInfo();

  useEffect(() => {
    if (!isLoadedStatInfo) {
      loadQuizzesStatInfo();
    }
  }, []);

  if (!quizzesStatInfo) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <table>
        <tbody>
          <tr>
            <td>Количество прохождений тестов за последние 30 дней:</td>
            <td>{quizzesStatInfo.countUsersPassedQuizzes}</td>
          </tr>
          <tr>
            <td>Количество прохождений тестов зарегистрированными пользователями за последние 30 дней:</td>
            <td>{quizzesStatInfo.countUnknownPassedQuizzes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
