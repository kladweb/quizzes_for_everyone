import React, { useState } from "react";
import { QUIZ_CATEGORIES, QUIZ_LANGUAGES } from "./quizCategories";
import { useClearCurrentQuiz, useQuizDraft, useSetQuizComplete } from "../../store/useCurrentCreatingQuiz";
import { saveUserQuiz } from "../../store/useMyQuizzesStore";
import "./quizLoaderExtraInfo.css"

interface IQuizLoaderExtraInfo {
  userUID: string,
  setIsCreatingNewTest: (isCreatingNewTest: boolean) => void
}

export const QuizLoaderExtraInfo: React.FC<IQuizLoaderExtraInfo> = ({userUID, setIsCreatingNewTest}) => {
  const catTitles = {
    category: "Тематика, которой посвящен тест",
    language: "Язык, на котором написаны вопросы теста",
    access: "Будет ли Ваш тест виден в общем списке тестов или только в Вашем"
  }

  const quizDraft = useQuizDraft();
  const [quizCategory, setQuizCategory] = useState("");
  const [quizLanguage, setQuizLanguage] = useState("русский");
  const [quizAccess, setQuizAccess] = useState<"public" | "private">("public");
  const [isValidate, setValidate] = useState(true);

  const saveCurrentTest = async () => {
    if (!quizCategory) {
      setValidate(false);
      setTimeout(() => {
        setValidate(true);
      }, 2000);
      return;
    } else {
      setValidate(true);
    }
    if (quizDraft) {
      if (!QUIZ_CATEGORIES.includes(quizCategory)) {
        quizDraft.category = "разное";
        quizDraft.categoryDraft = quizCategory;
        // setQuizCategory("разное");
      } else {
        quizDraft.category = quizCategory;
      }
      quizDraft.lang = quizLanguage;
      quizDraft.access = quizAccess;
      useSetQuizComplete(quizDraft);
      setIsCreatingNewTest(true);
      await saveUserQuiz(quizDraft, userUID)
        .then(() => {
          setIsCreatingNewTest(false);
        })
        .catch((error) => {
          console.error(error);
        })
    }
  }

  return (
    <div className='extra-info-block'>
      <p>Для сохранения теста заполните оставшиеся поля:</p>
      <span title={catTitles.category}>Категория теста: </span>
      <input
        name='categories'
        list='categories'
        type='text'
        placeholder="например: химия"
        value={quizCategory}
        onChange={(e) => setQuizCategory(e.target.value)}
      />
      <datalist id="categories">
        {
          QUIZ_CATEGORIES.map((item, i) => <option key={i} value={item}/>)
        }
      </datalist>
      {
        !isValidate && <p className='text-save-error'>Поле не может быть пустым!</p>
      }
      <span title={catTitles.language}>Язык теста: </span>
      <select name="select" onChange={(e) => setQuizLanguage(e.target.value)}>
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
      <button className='btn button-create btn-save' onClick={saveCurrentTest}>СОХРАНИТЬ ТЕСТ</button>
    </div>
  )
}
