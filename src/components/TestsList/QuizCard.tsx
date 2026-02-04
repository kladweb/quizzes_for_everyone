import React from "react";
import { Quiz } from "../../types/Quiz";
import "./quizCard.css"

interface ITestCardProps {
  quiz: Quiz;
  openStatistic?: (testId: string) => void;
}

export const QuizCard: React.FC<ITestCardProps> = ({quiz, openStatistic}) => {
  return (
    <div className='test-item' key={quiz.testId}>
      <div className='test-content'>
        <h3 className='test-name'>{quiz.title}</h3>
      </div>
      <div className='test-buttons-block'>
        {openStatistic &&
          <button className='button-test' onClick={() => openStatistic(quiz.testId)}>Статистика</button>
        }
        <a className="link-open-test" href={`/quizzes/${quiz.testId}`} target="_blank">
          <span>Открыть</span>
        </a>
      </div>
    </div>
  )
}
