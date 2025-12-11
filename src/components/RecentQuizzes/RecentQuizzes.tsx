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
        <div className='recentButtons'>
          <button className='buttonRecent' onClick={() => openRecentQuiz(recentQuiz.testId)}>Открыть</button>
          {/*<NavLink to={`/tests/${recentQuiz.testId}`} className='linkOpenTest'>*/}
          {/*  <span>Открыть</span>*/}
          {/*</NavLink>*/}
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
