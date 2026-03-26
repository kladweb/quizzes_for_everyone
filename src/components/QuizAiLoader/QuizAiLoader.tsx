import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { finishJsonLoading, setQuizDraft, startJsonLoading, useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { catTitles, QUIZ_LANGUAGES } from "../../variables/quizData";
import { useOpenAiQuizCreator } from "../../hooks/useOpenAiQuizGenerator";
import { IQuizMeta, ToastType } from "../../types/Quiz";
import { IUser, useUser } from "../../store/useUserStore";
import { showToast } from "../../store/useNoticeStore";
import { useCanSpend, spendTokens } from "../../store/useTokensStore";
import "./quizAiLoader.css"

export const QuizAiLoader = () => {
  const navigate = useNavigate();
  const quizDraft = useQuizDraft();
  const user = useUser() as IUser;
  const userUID = user.uid;
  const [aiUserPrompt, setAiUserPrompt] = React.useState("");
  const [questionCount, setQuestionCount] = React.useState(3);
  const [quizLanguage, setQuizLanguage] = useState(quizDraft?.lang ?? "русский");
  const {generateQuiz} = useOpenAiQuizCreator();
  // const {canSpend, spend} = useTokens(userUID);
  const canSpend = useCanSpend();

  const promptTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiUserPrompt(e.target.value);
  }

  const saveCurrentTest = async () => {
    if (!aiUserPrompt || !userUID) return;

    // Проверяем токены
    if (!canSpend) {
      showToast("Недостаточно токенов для генерации теста.", ToastType.WARNING);
      return;
    }
    try {
      startJsonLoading();
      const result = await generateQuiz(aiUserPrompt, questionCount);
      if (result) {
        const content = result as string;
        const quiz: IQuizMeta = JSON.parse(content);
        quiz.testId = nanoid(12);
        quiz.createdBy = userUID;
        quiz.createdAt = Date.now();
        quiz.modifiedAt = Date.now();
        if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
          throw new Error('Неверный формат файла.');
        }
        quiz.questions.forEach((q, idx) => {
          if (!q.id) throw new Error(`Question ${idx + 1} missing id`);
          if (!q.options || !Array.isArray(q.options)) {
            throw new Error(`Question ${idx + 1} missing options`);
          }
          if (!q.correctAnswers || !Array.isArray(q.correctAnswers)) {
            throw new Error(`Question ${idx + 1} missing correctAnswers`);
          }
          q.options.forEach((opt, optIdx) => {
            if (!opt.id || !opt.text) {
              throw new Error(`Question ${idx + 1}, option ${optIdx + 1} missing id or text`);
            }
          });
        });
        setQuizDraft(quiz);
        await spendTokens(userUID, 20);
      }

    } catch (err) {
      finishJsonLoading();
      console.log(err);
      showToast("Ошибка генерации теста. Попробуйте позже...", ToastType.ERROR);
      navigate("/createquiz");
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
