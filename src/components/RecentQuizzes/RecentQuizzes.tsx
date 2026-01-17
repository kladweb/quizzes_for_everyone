import React, {useEffect, useState} from "react";
import {NavLink, useNavigate, useParams, type Params} from "react-router-dom";
import {QuizStorageManager} from "../../utils/QuizStorageManager";
import type {IStatistics} from "../../types/Quiz";
import "./recentQuizzes.css";

interface IRecentQuizzes {
  currentTestId: string
}

export const RecentQuizzes: React.FC<IRecentQuizzes> = ({currentTestId}) => {
  const navigate = useNavigate();
  const [recentStat, setRecentStat] = useState<IStatistics[]>([]);
  const params: Readonly<Params<string>> = useParams();
  const testId: string | undefined = params.testid;

  console.log(params.testid);

  // const openRecentQuiz = (testId: string) => {
  //   console.log("testId: ", testId);
  //   navigate(`/tests/${testId}`);
  //   const resultStorage = QuizStorageManager.getRecentStatTestId(testId);
  //   if (resultStorage) {
  //     console.log("Получили данные из localStorage: ", resultStorage);
  //     resultStorage.finishedAt = 0;
  //     console.log("statistics 03: ", resultStorage);
  //     QuizStorageManager.saveRecentStat(resultStorage);
  //   }
  //   setTimeout(() => location.reload(), 0);
  // }

  const deleteRecentQuiz = (testId: string) => {
    const newRecentStat = QuizStorageManager.removeRecentStat(testId);
    if (newRecentStat) {
      setRecentStat(newRecentStat);
    }
  }

  const handlerReload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 0)
  }

  useEffect(() => {
    const quizzes = QuizStorageManager.getRecentAllStat();
    if (quizzes && quizzes.length > 0) {
      setRecentStat(quizzes);
    }
  }, [currentTestId]);

  const quizElements = recentStat.map((recentQuiz: IStatistics) => {
    return (
      <div className={`recent-test-block${(recentQuiz.finishedAt) ? " recent-test--finished" : ""}`}
           key={recentQuiz.testId}>
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
          {/*<button className='button-recent' onClick={() => openRecentQuiz(recentQuiz.testId)}>*/}
          {/*  Открыть тест*/}
          {/*</button>*/}
          <NavLink className="link-open-test" to={`/quizzes/${recentQuiz.testId}`} target='_blank'>
            <span>Открыть</span>
          </NavLink>
          <button className='button-test' onClick={() => deleteRecentQuiz(recentQuiz.testId)}>
            Удалить из истории
          </button>
        </div>
      </div>
    )
  });

  return (
    <div className='tests-container'>
      <h3 className="tests-name">ВАШИ НЕДАВНИЕ ТЕСТЫ:</h3>
      {/*<p className='recent-info recent-warning'>После открытия теста старые результаты будут стерты!</p>*/}
      <div className='tests-block'>
        {quizElements}
      </div>
    </div>
  );
}
