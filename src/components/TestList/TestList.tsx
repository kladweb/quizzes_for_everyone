import React from "react";
import { type Quiz } from "../../types/Quiz";
import "./testList.css";

interface ITestListProps {
  testList: Quiz[],
  deleteTest: (testId: string) => void,
  loadingMyTests: boolean,
}

export const TestList: React.FC<ITestListProps> = ({testList, deleteTest, loadingMyTests}) => {
  const currentInfoId = "IO8gOEFbqmW7";

  const openStatistic = (testId: string) => {

  }

  const testsElements = testList.map((quiz, i) => {
    return (
      <>
        <div className='testItem' key={quiz.testId}>
          <p className='testItemName'>{i + 1}) {quiz.title}</p>
          <button className='buttonDel' onClick={() => deleteTest(quiz.testId)}>Удалить</button>
          <button className='buttonDel' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
          <a className="linkOpenTest" href={`${window.location.href}tests/${quiz.testId}`} target="_blank">
            <span>Открыть</span>
          </a>
        </div>
        {
          (quiz.testId === currentInfoId) ?
            <div className='testInfo'>Информация</div> : null
        }
      </>
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
