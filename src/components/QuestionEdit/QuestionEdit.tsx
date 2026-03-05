import React from "react";
import type { Question } from "../../types/Quiz";

interface IQuestionEditProps {
  question: Question;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const handleQuestionEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);
}

export const QuestionEdit: React.FC<IQuestionEditProps> = ({question, handleKeyDown}) => {
  return (
    <div className='questionsContainer'>
      <input
        className='quiz-edit edit-head'
        name="title"
        type="text"
        value={question.question}
        title="Вопрос теста"
        placeholder={question.question ? "" : "Введите вопрос"}
        required
        onChange={handleQuestionEdit}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
