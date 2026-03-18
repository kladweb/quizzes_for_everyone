import React from "react";
import "./quizAiLoader.css"

export const QuizAiLoader = () => {
  const [aiUserPrompt, setAiUserPrompt] = React.useState("");
  const [questionCount, setQuestionCount] = React.useState(3);

  const promptTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiUserPrompt(e.target.value);
  }

  const saveCurrentTest = () => {

  }

  return (
    <div className='loaderBlock'>
      <h2 className='loader-head'>Создаём новый тест</h2>
      <p className="quiz-note">Введите описание теста (не менее 30 символов):</p>
      <textarea
        name="quiz-prompt"
        id="quiz-prompt"
        maxLength={2000}
        onChange={promptTextChange}
        value={aiUserPrompt}
      />
      <div className="btn-save-block">
        <p className="quiz-questionCount">Количество вопросов: <span>{questionCount}</span></p>
        <input
          type="range"
          name="questionCount"
          min="3"
          max="20"
          value={questionCount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionCount(Number(e.target.value))}
        />
        <button
          name="quiz-prompt"
          className='btn button-create btn-save'
          disabled={aiUserPrompt.length < 30}
          onClick={saveCurrentTest}
        >
          ЗАПРОСИТЬ ТЕСТ
        </button>
      </div>
    </div>
  );
}
