import React, { useState } from "react";
import "./quizLoaderExtraInfo.css"
import { QUIZ_CATEGORIES } from "./quizCategories";

export const QuizLoaderExtraInfo = () => {
  const [quizCategory, setQuizCategory] = useState('');

  return (
    <div className='extra-info-block'>
      <p>Для сохранения теста заполните оставшиеся поля:</p>
      <span>Категория теста: </span>
      <input
        // name='categories'
        list='categories'
        type='text'
        placeholder="например: химия"
        value={quizCategory}
        onChange={(e) => setQuizCategory(e.target.value)}
      />
      <datalist id="categories">
        {
          QUIZ_CATEGORIES.map(item => <option value={item}/>)
        }
      </datalist>
      {/*<CategoryAutocomplete value={quizCategory} onChange={setQuizCategory}/>*/}
    </div>
  )
}
