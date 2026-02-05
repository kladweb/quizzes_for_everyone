import React from "react";
import { Quiz } from "../../types/Quiz";
import { deleteUserQuiz } from "../../store/useQuizzesStore";
import "./quizCard.css"

interface ITestCardProps {
  quiz: Quiz;
  dateFormatter: Intl.DateTimeFormat;
  openStatistic?: (testId: string) => void;
  userUID?: string;
}

export const QuizCard: React.FC<ITestCardProps> = ({quiz, openStatistic, dateFormatter, userUID}) => {

  // console.log(quiz)

  return (
    <div className='test-item' key={quiz.testId}>
      <div className='test-content'>
        <h3 className='test-name'>{quiz.title}</h3>
      </div>
      <div className="quiz-table-info">
        <table>
          <tbody>
            <tr>
              <td>Категория:</td>
              <td>{quiz.category}</td>
            </tr>
            <tr>
              <td>Язык вопросов:</td>
              <td>{quiz.lang}</td>
            </tr>
            <tr>
              <td>Создан:</td>
              <td>{dateFormatter.format(quiz.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='quiz-control-block'>
        <table>
          <tbody>
            <tr>
              <td>Пройден:</td>
              <td>{quiz.category}</td>
            </tr>
            <tr>
              <td>Ваш результат:</td>
              <td>{dateFormatter.format(quiz.createdAt)}</td>
            </tr>
          </tbody>
        </table>
        {openStatistic &&
          <button className='button-test' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
        }
        {
          userUID &&
          <>
            <button className='button-test' onClick={() => {
            }}>Редактировать
            </button>
            <button className='button-test' onClick={() => deleteUserQuiz(quiz.testId, userUID)}>Удалить</button>
          </>
        }
      </div>
      <div className='test-buttons-block'>
        <a className="link-open-test" href={`/quizzes/${quiz.testId}`} target="_blank">
          <span>Открыть</span>
        </a>
      </div>
    </div>
  )
}
