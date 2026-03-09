import React from "react";
import type { Question, Option } from "../../types/Quiz";
import { useFormError } from "../../store/useCurrentCreatingQuiz";
import "./questionEdit.css";

interface IQuestionEditProps {
  question: Question;
  handleQuestionEdit: (question: Question, value: string) => void;
  handleOptionEdit: (option: Option, value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCorrectCheck: (event: React.ChangeEvent<HTMLInputElement>, option: Option, question: Question) => void;
  addOption: (question: Question) => void;
  deleteOption: (question: Question) => void;
}

export const QuestionEdit: React.FC<IQuestionEditProps> = (
  {question, handleQuestionEdit, handleOptionEdit, handleKeyDown, handleCorrectCheck, addOption, deleteOption}) => {
  const formError = useFormError();
  const MAX_OPTIONS = 6;

  // console.log(question.options);
  // console.log(question)
  // console.log(formError);
  return (
    <div className='questionsContainer'>
      <input
        className={`question-edit name-question-edit${formError[question.id] ? " no-validate" : ""}`}
        name={question.id}
        type="text"
        value={question.question}
        title="Вопрос теста"
        placeholder={question.question ? "" : "Введите вопрос"}
        required
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionEdit(question, e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className='options-edit'>
        {
          question.options.map((option: Option, index: number) => (
            <div key={option.id} className="option-inbut-block">
              <input
                className={`question-edit option-edit${formError[option.id] ? " no-validate" : ""}`}
                name={option.id}
                type="text"
                value={option.text}
                // placeholder={question.question ? "" : "вариант ответа"}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionEdit(option, e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <input
                className="option-correct"
                name={option.id}
                type="checkbox"
                title="Верный/невеный ответ"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCorrectCheck(e, option, question)}
                checked={question.correctAnswers.includes(option.id)}
              />
            </div>
          ))
        }
        <div className="add-option-container">
          {
            (question.options.length > 2) &&
            <button className="btn button-create del-option" onClick={() => {
              deleteOption(question)
            }}>
              -
            </button>
          }
          {
            (question.options.length < MAX_OPTIONS) &&
            <button className="btn button-create add-option" onClick={() => {
              addOption(question)
            }}>
              +
            </button>
          }
        </div>
      </div>
    </div>
  )
}
