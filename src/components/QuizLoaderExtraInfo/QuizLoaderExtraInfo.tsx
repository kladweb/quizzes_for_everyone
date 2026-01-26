import React, {useState} from "react";
import {QUIZ_CATEGORIES, QUIZ_LANGUAGES} from "./quizCategories";
import "./quizLoaderExtraInfo.css"

export const QuizLoaderExtraInfo = () => {
  const [quizCategory, setQuizCategory] = useState('');
  const [quizLanguage, setQuizLanguage] = useState('русский');
  const [quizAccess, setQuizAccess] = useState('public');

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
        <input type="radio" name="access" id="public" defaultChecked onChange={(e) => setQuizAccess(e.target.id)}/>
        <label htmlFor="public">public</label>
      </div>
      <div className="extra-info-input">
        <input type="radio" name="access" id="private" onChange={(e) => setQuizAccess(e.target.id)}/>
        <label htmlFor="private">private</label>
      </div>

    </div>
  )
}
