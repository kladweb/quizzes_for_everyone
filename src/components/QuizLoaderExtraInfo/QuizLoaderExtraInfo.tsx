import React, { useEffect, useState } from "react";
import { QUIZ_CATEGORIES, QUIZ_LANGUAGES } from "./quizCategories";
import {
  resetFormError, setQuizComplete,
  useFormError, useIsQuizDraftLoaded, useQuizDraft, validateField,
} from "../../store/useCurrentCreatingQuiz";
import { saveUserQuiz } from "../../store/useQuizzesStore";
import { IQuizMeta, type Question, ToastType } from "../../types/Quiz";
import { showToast } from "../../store/useNoticeStore";
import "./quizLoaderExtraInfo.css"

interface IQuizLoaderExtraInfo {
  userUID: string,
  setIsCreatingNewTest: (isCreatingNewTest: boolean) => void
}

const catTitles = {
  category: "Тематика, которой посвящен тест",
  language: "Язык, на котором написаны вопросы теста",
  access: "Будет ли Ваш тест виден в общем списке тестов или только в Вашем"
}

export const QuizLoaderExtraInfo: React.FC<IQuizLoaderExtraInfo> = ({userUID, setIsCreatingNewTest}) => {
  const quizDraft = useQuizDraft();
  const isQuizDraftLoaded = useIsQuizDraftLoaded();
  const formError = useFormError();
  const [quizCategory, setQuizCategory] = useState(quizDraft?.category ?? "");
  const [quizLanguage, setQuizLanguage] = useState(quizDraft?.lang ?? "русский");
  const [quizAccess, setQuizAccess] = useState<"public" | "private">(quizDraft?.access ?? "public");
  // const isFormValid = Object.values(formError).every(e => !e);
  const isFormValid = React.useMemo(
    () => Object.values(formError).every(e => !e),
    [formError]
  );

  const validateForm = () => {
    if (!quizDraft) return false;
    let valid = true;
    validateField("title", quizDraft.title);
    if (!quizDraft.title) valid = false;
    validateField("category", quizCategory);
    if (!quizCategory) valid = false;
    if (quizDraft.questions) {
      quizDraft?.questions.forEach((question: Question) => {
        validateField(question.id, question.question);
        if (!question.question) valid = false;
        question.options.forEach(option => {
          validateField(option.id, option.text);
          if (!option.text) valid = false;
        })
      });
    }
    return valid;
  }

  const saveCurrentTest = async () => {
    if (!quizDraft) return;
    const quiz: IQuizMeta = {...quizDraft};

    const valid = validateForm();
    if (!valid) return;
    if (!QUIZ_CATEGORIES.includes(quizCategory)) {
      quiz.category = "разное";
      quiz.categoryDraft = quizCategory.trim();
    } else {
      quiz.category = quizCategory.trim();
    }
    quiz.lang = quizLanguage;
    quiz.access = quizAccess;
    quiz.likeUsers = quizDraft?.likeUsers ?? [];
    quiz.executionCount = quizDraft?.executionCount ?? 0;
    quiz.title = quizDraft.title.trim();
    quiz.description = quizDraft.description ? quizDraft.description.trim() : "";
    if (quiz.questions) {
      quiz.questions.forEach((question => {
        question.question = question.question.trim();
        question.options.forEach((option) => {
          option.text = option.text.trim();
        });
        if (question.explanation) {
          question.explanation = question.explanation.trim();
        }
      }));
    }
    setQuizComplete(quiz);
    setIsCreatingNewTest(true);
    try {
      await saveUserQuiz(quiz, userUID);
      resetFormError();
      setIsCreatingNewTest(false);
      showToast("Тест успешно сохранён!", ToastType.INFO);
      // setTimeout(() => {
      //   navigate("/myquizzes");
      // }, 3500);
    } catch (error) {
      console.error(error);
      showToast("Ошибка сохранения теста!", ToastType.ERROR);
    }
  }

  useEffect(() => {
    if (!isQuizDraftLoaded || !quizDraft) return;
    setQuizCategory(quizDraft.category ?? "");
    setQuizLanguage(quizDraft.lang ?? "русский");
    setQuizAccess(quizDraft.access ?? "public");
  }, [isQuizDraftLoaded, quizDraft]);

  return (
    <div className='extra-info-block'>
      <p>Для сохранения теста заполните дополнительные поля:</p>
      <span title={catTitles.category}>Категория теста: </span>
      <input
        className="input-category"
        name='categories'
        list='categories'
        type='text'
        placeholder="например: химия"
        value={quizCategory}
        onChange={(e) => {
          const value = e.target.value;
          setQuizCategory(value);
          validateField("category", value);
        }}
      />
      <datalist id="categories">
        {
          QUIZ_CATEGORIES.map((item, i) => <option key={i} value={item}/>)
        }
      </datalist>
      {
        formError.category && <p className='text-save-error'>Поле не может быть пустым!</p>
      }
      <span title={catTitles.language}>Язык теста: </span>
      <select
        className="input-language"
        name="select"
        value={quizLanguage}
        onChange={(e) => setQuizLanguage(e.target.value)}
      >
        {
          QUIZ_LANGUAGES.map((item, i) => <option key={i} value={item}>{item}</option>)
        }
      </select>
      <span title={catTitles.access}>Доступность теста: </span>
      <div className="extra-info-input">
        <input
          type="radio"
          name="access"
          id="public"
          checked={quizAccess === "public"}
          onChange={(e) => setQuizAccess("public")}
        />
        <label htmlFor="public">public</label>
      </div>
      <div className="extra-info-input">
        <input
          type="radio"
          name="access"
          id="private"
          checked={quizAccess === "private"}
          onChange={(e) => setQuizAccess("private")}
        />
        <label htmlFor="private">private</label>
      </div>
      {
        (quizCategory && !QUIZ_CATEGORIES.includes(quizCategory)) &&
        <>
          <p className='warning-save'>Ваш тест будет сохранен в категории <span>"разное"</span>!</p>
          <p className='warning-save'>
            В дальнейшем, при появлении категории <span>"{quizCategory}"</span>, тест будет перенесен в неё
            автоматически.
          </p>
        </>
      }
      <div className="btn-save-block">
        <button
          className='btn button-create btn-save'
          disabled={!isFormValid}
          onClick={saveCurrentTest}
        >
          СОХРАНИТЬ ТЕСТ
        </button>
      </div>
      {
        !isFormValid &&
        <p className='submit-error-info'>Все пустые поля должны быть заполнены!</p>
      }
    </div>
  )
}
