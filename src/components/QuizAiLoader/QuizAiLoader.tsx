import React, { useState } from "react";
import { setQuizDraft, startJsonLoading, useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { catTitles, QUIZ_LANGUAGES } from "../../variables/quizData";
import { useOpenAiQuizCreator } from "../../hooks/useOpenAiQuizGenerator";
import type { IQuizMeta } from "../../types/Quiz";
import { nanoid } from "nanoid";
import { useUser } from "../../store/useUserStore";
import "./quizAiLoader.css"

export const QuizAiLoader = () => {
  const quizDraft = useQuizDraft();
  const userUID = useUser()?.uid;
  const [aiUserPrompt, setAiUserPrompt] = React.useState("");
  const [questionCount, setQuestionCount] = React.useState(3);
  const [quizLanguage, setQuizLanguage] = useState(quizDraft?.lang ?? "русский");
  const {generateQuiz} = useOpenAiQuizCreator();

  const promptTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiUserPrompt(e.target.value);
  }

  const saveCurrentTest = () => {
    if (aiUserPrompt) {
      startJsonLoading();
      generateQuiz(aiUserPrompt, questionCount)
        .then((result) => {
          if (result && userUID) {
            console.log(JSON.parse(result));
            const content = result as string;
            const quiz: IQuizMeta = JSON.parse(content);
            quiz.testId = nanoid(12);
            quiz.createdBy = userUID;
            quiz.createdAt = Date.now();
            quiz.modifiedAt = Date.now();

            if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
              throw new Error('Неверный формат файла. Выберите, пожалуйста, другой файл.');
            }

            // Validate each question has the new structure
            quiz.questions.forEach((q, idx) => {
              if (!q.id) throw new Error(`Question ${idx + 1} missing id`);
              if (!q.options || !Array.isArray(q.options)) {
                throw new Error(`Question ${idx + 1} missing options array`);
              }
              if (!q.correctAnswers || !Array.isArray(q.correctAnswers)) {
                throw new Error(`Question ${idx + 1} missing correctAnswers array`);
              }
              q.options.forEach((opt, optIdx) => {
                if (!opt.id || !opt.text) {
                  throw new Error(`Question ${idx + 1}, option ${optIdx + 1} missing id or text`);
                }
              });
            });

            setQuizDraft(quiz);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          className="input-range"
          type="range"
          name="questionCount"
          min="3"
          max="15"
          value={questionCount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionCount(Number(e.target.value))}
        />
        <span title={catTitles.language}>Язык вопросов теста:</span>
        <select
          className="input-language"
          name="select"
          value={quizLanguage}
          onChange={(e) => setQuizLanguage(e.target.value)}
        >
          {
            Object.values(QUIZ_LANGUAGES).map((item, i) => <option key={i} value={item}>{item}</option>)
          }
        </select>
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
