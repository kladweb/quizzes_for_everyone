import React, { useState } from "react";
import { QUIZ_CATEGORIES, QUIZ_LANGUAGES } from "./quizCategories";
import {
  resetFormError,
  setQuizComplete,
  useFormError,
  useQuizDraft,
  validateField,
} from "../../store/useCurrentCreatingQuiz";
import { saveUserQuiz } from "../../store/useQuizzesStore";
import "./quizLoaderExtraInfo.css"
import { type Question, ToastType } from "../../types/Quiz";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../store/useNoticeStore";

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
  const formError = useFormError();
  const [quizCategory, setQuizCategory] = useState(quizDraft?.category ?? "");
  const [quizLanguage, setQuizLanguage] = useState("русский");
  const [quizAccess, setQuizAccess] = useState<"public" | "private">("public");
  const navigate = useNavigate();
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

    const valid = validateForm();
    if (!valid) return;
    if (!QUIZ_CATEGORIES.includes(quizCategory)) {
      quizDraft.category = "разное";
      quizDraft.categoryDraft = quizCategory.trim();
    } else {
      quizDraft.category = quizCategory.trim();
    }
    Object.assign(quizDraft, {
      lang: quizLanguage,
      access: quizAccess,
      likeUsers: {},
      executionCount: 0
    });
    quizDraft.title = quizDraft.title.trim();

    quizDraft.description = quizDraft.description ? quizDraft.description.trim() : "";
    if (quizDraft.questions) {
      quizDraft.questions.forEach((question => {
        question.question = question.question.trim();
        question.options.forEach((option) => {
          option.text = option.text.trim();
        });
        if (question.explanation) {
          question.explanation = question.explanation.trim();
        }
      }));
    }

    setQuizComplete(quizDraft);
    setIsCreatingNewTest(true);
    try {
      await saveUserQuiz(quizDraft, userUID);
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
      <select className="input-language" name="select" onChange={(e) => setQuizLanguage(e.target.value)}>
        {
          QUIZ_LANGUAGES.map((item, i) => <option key={i} value={item}>{item}</option>)
        }
      </select>
      <span title={catTitles.access}>Доступность теста: </span>
      <div className="extra-info-input">
        <input type="radio" name="access" id="public" defaultChecked onChange={(e) => setQuizAccess("public")}/>
        <label htmlFor="public">public</label>
      </div>
      <div className="extra-info-input">
        <input type="radio" name="access" id="private" onChange={(e) => setQuizAccess("private")}/>
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
