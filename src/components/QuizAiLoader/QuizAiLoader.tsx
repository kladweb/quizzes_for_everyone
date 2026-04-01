import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { finishJsonLoading, setQuizDraft, startJsonLoading, useQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { catTitles, QUIZ_LANGUAGES } from "../../variables/quizData";
import { IQuizMeta, ToastType } from "../../types/Quiz";
import { showToast } from "../../store/useNoticeStore";
import { useCanSpend, spendTokens } from "../../store/useTokensStore";
import { startQuizGeneration } from "../../api/quizApi";
import { removeQuizJob, subscribeToQuiz } from "../../api/subscribeToQuiz";
import "./quizAiLoader.css"
import { prepareQuiz } from "../../utils/quizUtils";

interface IQuizAiLoaderProps {
  userUID: string;
}

export const QuizAiLoader: React.FC<IQuizAiLoaderProps> = ({userUID}) => {
  const quizDraft = useQuizDraft();
  const [aiUserPrompt, setAiUserPrompt] = useState("");
  const [questionCount, setQuestionCount] = useState(3);
  const [quizLanguage, setQuizLanguage] = useState(quizDraft?.lang ?? "русский");
  const canSpend = useCanSpend();

  const promptTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiUserPrompt(e.target.value);
  }

  const saveCurrentTest = async () => {
    if (!aiUserPrompt || !userUID) return;

    if (!canSpend) {
      showToast(
        "Недостаточно токенов для генерации теста.",
        ToastType.WARNING
      );
      return;
    }

    try {
      startJsonLoading();
      const response = await startQuizGeneration(
        aiUserPrompt,
        questionCount,
        quizLanguage,
        userUID
      );
      const jobId = response.jobId;

      // СРАЗУ подписываемся
      const unsubscribe = subscribeToQuiz(jobId, async (result) => {
        try {
          const quiz = prepareQuiz(result, userUID);
          quiz.lang = quizLanguage;
          // кладём в zustand
          setQuizDraft(quiz);

          // списываем токены
          await spendTokens(userUID, 20);

        } catch (err) {
          console.error(err);
          showToast(
            "Ошибка обработки результата теста.",
            ToastType.ERROR
          );
        } finally {
          unsubscribe();
          finishJsonLoading();
          // удаляем временный файл на сервере
          await removeQuizJob(userUID, jobId);
        }
      });
    } catch (err) {
      finishJsonLoading();
      console.error(err);
      showToast(
        "Ошибка генерации теста. Попробуйте позже...",
        ToastType.ERROR
      );
      // navigate("/createquiz");
    }
  };

  if (!canSpend) {
    setTimeout(() => {
      showToast("У Вас недостаточно токенов.", ToastType.WARNING);
    }, 1000);
    return <Navigate to="/createquiz"/>
  }

  return (
    <div className="loaderBlock">
      <h2 className="loader-head">Создаём новый тест</h2>
      <p className="quiz-note">Введите описание теста (не менее 30 символов):</p>
      <textarea
        name="quiz-prompt"
        id="quiz-prompt"
        maxLength={1500}
        onChange={promptTextChange}
        value={aiUserPrompt}
      />
      {/*<p className="charCount">Доступно символов: <span>{1500 - aiUserPrompt.length}</span></p>*/}
      <div className="btn-save-block">
        <p className="quiz-questionCount">
          Количество вопросов: <span>{questionCount}</span>
        </p>
        <input
          className="input-range"
          type="range"
          name="questionCount"
          min="3"
          max="15"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        />
        <p className="lang-info" title={catTitles.language}>Язык вопросов теста:</p>
        <select
          className="input-language"
          name="select"
          value={quizLanguage}
          onChange={(e) => setQuizLanguage(e.target.value)}
        >
          {Object.values(QUIZ_LANGUAGES).map((item, i) => (
            <option key={i} value={item}>{item}</option>
          ))}
        </select>
        {/*<p className="lang-info">Описание теста следует писать на выбранном языке</p>*/}
        <button
          className="btn button-create btn-save"
          disabled={aiUserPrompt.trim().length < 30}
          onClick={saveCurrentTest}
        >
          ЗАПРОСИТЬ ТЕСТ
        </button>
      </div>
    </div>
  );
}
