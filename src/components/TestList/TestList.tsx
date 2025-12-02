import React, { useState } from "react";
import { type Quiz } from "../../types/Quiz";
import "./testList.css";
import { Statistics } from "../Statistics/Statistics";

interface ITestListProps {
  testList: Quiz[],
  deleteTest: (testId: string) => void,
  loadingMyTests: boolean,
}

export const TestList: React.FC<ITestListProps> = ({testList, deleteTest, loadingMyTests}) => {
  const [isOpenStatistics, setIsOpenStatistics] = useState<boolean>(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);

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
      <div className='testItem' key={quiz.testId}>
        <div className='testBlock'>
          <p className='testItemName'>{i + 1}) {quiz.title}</p>
          <div className='buttonsBlock'>
            <button className='buttonDel' onClick={() => deleteTest(quiz.testId)}>Удалить</button>
            <button className='buttonDel' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
            <a className="linkOpenTest" href={`${window.location.href}tests/${quiz.testId}`} target="_blank">
              <span>Открыть</span>
            </a>
          </div>
        </div>
        {
          (isOpenStatistics && quiz.testId === currentTestId) ?
            <div>
              <h4 className='testInfo'>Статистика</h4>
              <Statistics testId={quiz.testId}/>
            </div>
            : null
        }
      </div>
    )
  })

  return (
    <div className='loaderContainer'>
      <h3 className="testListName">МОИ ТЕСТЫ:</h3>
      <div className='testListBlock'>
        {
          (loadingMyTests) ? <div>...идёт загрузка...</div> :
            <>
              {
                (testsElements.length === 0) ? <div className='testItemName'>Список пуст</div> :
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
