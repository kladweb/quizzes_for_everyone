import {useParams} from "react-router-dom";
import "./pageEmpty.css"

export const PageEmpty = () => {
  const part = useParams();
  const testId = part.testid;

  return (
    <div className="page-empty-container">
      {testId ?
        <p className='text-page-empty'>Ошибка! Возможно, тест удалён!</p> :
        <p className='text-page-empty'>Ошибка! Данной страницы не существует!</p>
      }
    </div>
  )
}