import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import type { IStatistics } from "../../types/Quiz";
import "./recentQuizzes.css";

interface IRecentQuizzes {
  currentTestId: string
}

export const RecentQuizzes: React.FC<IRecentQuizzes> = ({currentTestId}) => {
  const navigate = useNavigate();
  const [recentStat, setRecentStat] = useState<IStatistics[]>([]);

  const openRecentQuiz = (testId: string) => {
    console.log("testId: ", testId);
    navigate(`/tests/${testId}`);
    const resultStorage = QuizStorageManager.getRecentStatTestId(testId);
    if (resultStorage) {
      console.log("Получили данные из localStorage: ", resultStorage);
      resultStorage.finishedAt = 0;
      console.log("statistics 03: ", resultStorage);
      QuizStorageManager.saveRecentStat(resultStorage);
    }
    setTimeout(() => location.reload(), 0);
  }

  const deleteRecentQuiz = (testId: string) => {
    const newRecentStat = QuizStorageManager.removeRecentStat(testId);
    if (newRecentStat) {
      setRecentStat(newRecentStat);
    }
  }

  useEffect(() => {
    const quizzes = QuizStorageManager.getRecentAllStat();
    if (quizzes && quizzes.length > 0) {
      setRecentStat(quizzes);
    }
  }, [currentTestId]);


  const quizElements = recentStat.map((recentQuiz: IStatistics) => {
    return (
      <div className={`recentTestItem${(recentQuiz.finishedAt) ? " recentTestFinished" : ""}`} key={recentQuiz.testId}>
        <p className='recentTestName '>{recentQuiz.title}</p>
        {
          (recentQuiz.finishedAt) ?
            <div className='recentInfoBlock'>
              <p className='recentInfo'>Ваш результат: <span>{recentQuiz.score}%</span></p>
              <p className='recentInfo'>Верных ответов: <span>{recentQuiz.correctCount}</span></p>
              <p className='recentInfo'>Неверных/частично верных ответов: <span>{recentQuiz.incorrectCount}</span></p>
            </div>
            :
            <p className='recentInfo recent-empty'>Тест не пройден!</p>
        }
        <div className='recentButtons'>
          {/*{(recentQuiz.testId === currentTestId) ? 'Пройти тест ещё раз' : 'Открыть'}*/}
          <button className='buttonRecent' onClick={() => openRecentQuiz(recentQuiz.testId)}>
            Открыть тест
          </button>
          <button className='buttonRecent' onClick={() => deleteRecentQuiz(recentQuiz.testId)}>
            Удалить из истории
          </button>
        </div>
      </div>
    )
  });

  return (
    <div className='loaderContainer'>
      <h3 className="testListName">ВАШИ НЕДАВНИЕ ТЕСТЫ:</h3>
      <div className='testListBlock'>
        {quizElements}
      </div>
      <p className='recentInfo recentWarning'>После открытия теста старые результаты будут стерты!</p>
    </div>
  );
}
