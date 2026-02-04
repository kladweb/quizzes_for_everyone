import React from "react";
import type { Quiz } from "../../types/Quiz";
import { QuizCard } from "./QuizCard";

interface ITestsListProps {
  testsList: Quiz[],
}

export const TestsList: React.FC<ITestsListProps> = ({testsList}) => {

  return (
    <div className='test-list-block'>
      {testsList.map(quiz => <QuizCard quiz={quiz} key={quiz.testId}/>)}
    </div>
  )
}
