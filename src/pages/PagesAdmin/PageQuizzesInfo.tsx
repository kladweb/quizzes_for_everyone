import React, { useEffect } from "react";
import { loadQuizzesAdminInfo, useIsLoadedQuizzesInfo, useQuizzesAdminInfo, } from "../../store/useAdminStore";

export const PageQuizzesInfo = () => {
  const quizzesAdminInfo = useQuizzesAdminInfo();
  const isLoadedQuizzesInfo = useIsLoadedQuizzesInfo();

  useEffect(() => {
    if (!isLoadedQuizzesInfo) {
      loadQuizzesAdminInfo();
    }

  }, []);

  if (!quizzesAdminInfo) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <table>
        <tbody>
          <tr>
            <td>Общее количество созданных тестов:</td>
            <td>{quizzesAdminInfo.countAllQuizzes}</td>
          </tr>
          <tr>
            <td>Количество тестов, созданных за последние 30 дней:</td>
            <td>{quizzesAdminInfo.countLastCreatedQuizzes}</td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}
