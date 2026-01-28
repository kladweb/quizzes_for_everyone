import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {QUIZ_CATEGORIES, QUIZ_LANGUAGES} from "./quizCategories";
import {useQuizDraft, useSetQuizComplete} from "../../store/useCurrentCreatingQuiz";
import {saveUserQuiz} from "../../store/useMyQuizzesStore";
import "./quizLoaderExtraInfo.css"

interface IQuizLoaderExtraInfo {
  userUID: string,
  setIsCreatingNewTest: (isCreatingNewTest: boolean) => void
}

export const QuizLoaderExtraInfo: React.FC<IQuizLoaderExtraInfo> = ({userUID, setIsCreatingNewTest}) => {
  const navigate = useNavigate();
  const quizDraft = useQuizDraft();
  const [quizCategory, setQuizCategory] = useState('');
  const [quizLanguage, setQuizLanguage] = useState('русский');
  const [quizAccess, setQuizAccess] = useState<"public" | "private">('public');

  const saveCurrentTest = async () => {
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
      // console.log(quizDraft);
      setIsCreatingNewTest(true);
      await saveUserQuiz(quizDraft, userUID)
        .then(() => {
          setIsCreatingNewTest(false);
          // navigate(`/myquizzes`);
        })
        .catch((error) => {
          console.error(error);
        })

    }
  }

  return (
    <div className='extra-info-block'>
      <p>Для сохранения теста заполните оставшиеся поля:</p>
      <span>Категория теста: </span>
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
      <span>Язык теста: </span>
      <select name="select" onChange={(e) => setQuizLanguage(e.target.value)}>
        {
          QUIZ_LANGUAGES.map((item, i) => <option key={i} value={item}>{item}</option>)
        }
      </select>
      <span>Доступность теста: </span>
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
