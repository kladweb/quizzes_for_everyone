import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import type { IQuizStorage } from "../../types/Quiz";
import "./recentQuizzes.css";

interface IRecentQuizzes {
  currentTestId: string
}

export const RecentQuizzes: React.FC<IRecentQuizzes> = ({currentTestId}) => {
  const navigate = useNavigate();
  const [recentQuizzes, setRecentQuizzes] = useState<IQuizStorage[]>([]);

  const openRecentQuiz = (testId: string) => {
    console.log("testId: ", testId);
    QuizStorageManager.clearResult(testId);
    navigate(`/tests/${testId}`);
    location.reload();
  }

  useEffect(() => {
    const quizzes = QuizStorageManager.getRecentQuizzes();
    if (quizzes && quizzes.length > 0) {
      setRecentQuizzes(quizzes);
    }
  }, [currentTestId]);

  const quizElements = recentQuizzes.map((recentQuiz: IQuizStorage) => {
    return (
      <div className='recentTestItem' key={recentQuiz.testId}>
        <p className='recentTestName '>{recentQuiz.title}</p>
        {
          (recentQuiz.finishedAt) ?
            <div className='recentInfoBlock'>
              <p className='recentInfo'>Результат: <span>{recentQuiz.score}%</span></p>
              <p className='recentInfo'>Верных ответов: <span>{recentQuiz.correctCount}</span></p>
              <p className='recentInfo'>Неверных/частично верных ответов: <span>{recentQuiz.incorrectCount}</span></p>
            </div>
            :
            <p className='recentInfo'>Результаты отсутствуют</p>
        }
        <div className='recentButtons'>
          <button className='buttonRecent' onClick={() => openRecentQuiz(recentQuiz.testId)}>
            {/*{(recentQuiz.testId === currentTestId) ? 'Пройти тест ещё раз' : 'Открыть'}*/}
            Открыть тест
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className='loaderContainer'>
      <h3 className="testListName">МОИ НЕДАВНИЕ ТЕСТЫ:</h3>
      <div className='testListBlock'>
        {quizElements}
      </div>
    </div>
  );
}
