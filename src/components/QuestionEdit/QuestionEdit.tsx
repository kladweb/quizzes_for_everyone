import React from "react";
import type { Question, Option } from "../../types/Quiz";
import "./questionEdit.css";

interface IQuestionEditProps {
  question: Question;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  addOption: (question: Question) => void;
  deleteOption: (question: Question, option: Option) => void;
}


export const QuestionEdit: React.FC<IQuestionEditProps> = ({question, handleKeyDown, addOption, deleteOption}) => {
  const MAX_OPTIONS = 6;

  const handleQuestionEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);
  }

  return (
    <div className='questionsContainer'>
      <input
        className='question-edit name-question-edit'
        name="title"
        type="text"
        value={question.question}
        title="Вопрос теста"
        placeholder={question.question ? "" : "Введите вопрос"}
        required
        onChange={handleQuestionEdit}
        onKeyDown={handleKeyDown}
      />
      <div className='options-edit'>
        {
          question.options.map((option: Option) => (
            <>
              <input
                key={option.id}
                className='question-edit option-edit'
                name="title"
                type="text"
                value={option.text}
                // placeholder={question.question ? "" : "вариант ответа"}
                required
                onChange={handleQuestionEdit}
                onKeyDown={handleKeyDown}
              />
              <div className="btn-delete-container">
                <button className="btn-option-delete"
                        title='Удалить вариант ответа'
                        onClick={() => deleteOption(question, option)}>-
                </button>
              </div>
            </>

          ))
        }
        {
          ((question.options.length + 1) <= MAX_OPTIONS) &&
          <button className="btn button-create add-option" onClick={() => {
            addOption(question)
          }}>
            Add option
          </button>
        }
      </div>
    </div>
  )
}
