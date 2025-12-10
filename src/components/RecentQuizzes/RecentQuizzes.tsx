import React, { useEffect, useState } from "react";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import type { IQuizStorage } from "../../types/Quiz";

interface IRecentQuizzes {
  currentTestId: string
  // finishedAt: number | null;
}

export const RecentQuizzes: React.FC<IRecentQuizzes> = ({currentTestId}) => {
  const [recentQuizzes, setRecentQuizzes] = useState<IQuizStorage[]>([]);

  useEffect(() => {
    const quizzes = QuizStorageManager.getRecentQuizzes();
    if (quizzes && quizzes.length > 0) {
      setRecentQuizzes(quizzes);
    }
  }, [currentTestId]);

  const quizElements = recentQuizzes.map((recentQuiz: IQuizStorage) => {
    return (
      <div className='testItem' key={recentQuiz.testId}>
        <p className='testItemName'>{recentQuiz.title}</p>
        <div className='buttonsBlock'>
          <button className='buttonDel' onClick={() => 1}>Удалить</button>
          <button className='buttonDel' onClick={() => 1}>Статистика</button>
          <a className="linkOpenTest" href={`${window.location.origin}tests/${recentQuiz.testId}`} target="_blank">
            <span>Открыть</span>
          </a>
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
