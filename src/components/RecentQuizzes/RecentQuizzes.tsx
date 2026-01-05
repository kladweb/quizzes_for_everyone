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
      <div className={`recent-test-block${(recentQuiz.finishedAt) ? " recent-test--finished" : ""}`} key={recentQuiz.testId}>
        <p className='recent-test-name '>{recentQuiz.title}</p>
        {
          (recentQuiz.finishedAt) ?
            <div className='recent-info-block'>
              <p className='recent-info'>Ваш результат: <span>{recentQuiz.score}%</span></p>
              <p className='recent-info'>Верных ответов: <span>{recentQuiz.correctCount}</span></p>
              <p className='recent-info'>Неверных/частично верных ответов: <span>{recentQuiz.incorrectCount}</span></p>
            </div>
            :
            <p className='recent-info recent-empty'>Тест не пройден!</p>
        }
        <div className='recent-buttons'>
          {/*{(recentQuiz.testId === currentTestId) ? 'Пройти тест ещё раз' : 'Открыть'}*/}
          <button className='button-recent' onClick={() => openRecentQuiz(recentQuiz.testId)}>
            Открыть тест
          </button>
          <button className='button-recent' onClick={() => deleteRecentQuiz(recentQuiz.testId)}>
            Удалить из истории
          </button>
        </div>
      </div>
    )
  });

  return (
    <div className='tests-container'>
      <h3 className="tests-name">ВАШИ НЕДАВНИЕ ТЕСТЫ:</h3>
      <div className='tests-block'>
        {quizElements}
      </div>
      <p className='recent-info recent-warning'>После открытия теста старые результаты будут стерты!</p>
    </div>
  );
}
