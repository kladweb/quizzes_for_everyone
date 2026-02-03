import React, {useState} from "react";
import {type Quiz} from "../../types/Quiz";
import {Statistics} from "../Statistics/Statistics";
import {Loader} from "../Loader/Loader";
import {deleteUserQuiz, useIsLoading} from "../../store/useMyQuizzesStore";
import "./testList.css";

interface ITestListProps {
  testList: Quiz[],
  userUID: string
}

export const TestList: React.FC<ITestListProps> = ({testList, userUID}) => {
  const [isOpenStatistics, setIsOpenStatistics] = useState<boolean>(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const loadingMyTests = useIsLoading();

  const openStatistic = (testId: string) => {
    if (currentTestId !== testId) {
      setIsOpenStatistics(true);
    } else {
      setIsOpenStatistics(prevState => !prevState);
    }
    setCurrentTestId(testId);
  }

  const testsElements = testList.map((quiz, i) => {
    return (
      <div className='test-item' key={quiz.testId}>
        <div className='test-content'>
          <p className='test-name'>{i + 1}) {quiz.title}</p>
          <div className='test-buttons-block'>
            <button className='button-test' onClick={() => deleteUserQuiz(quiz.testId, userUID)}>Удалить</button>
            <button className='button-test' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
            <a className="link-open-test" href={`/quizzes/${quiz.testId}`} target="_blank">
              <span>Открыть</span>
            </a>
          </div>
        </div>
        {
          (isOpenStatistics && quiz.testId === currentTestId) ?
            <div className="stat-info-block">
              <h3 className='stat-info-head'>Статистика</h3>
              <Statistics testId={quiz.testId}/>
            </div>
            : null
        }
      </div>
    )
  })

  return (
    <div className='tests-container'>
      <h3 className="test-list-name">МОИ ТЕСТЫ:</h3>
      <div className='test-list-block'>
        {
          (loadingMyTests) ? <Loader/> :
            <>
              {
                (testsElements.length === 0) ? <div className='test-name'>Список пуст</div> :
                  <>
                    {testsElements}
                  </>
              }
            </>
        }
      </div>
    </div>
  )
}
