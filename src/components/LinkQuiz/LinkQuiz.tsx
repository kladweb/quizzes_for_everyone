import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useClearCurrentQuiz, useQuizComplete } from "../../store/useCurrentCreatingQuiz";
import "./linkQuiz.css";

export const LinkQuiz: React.FC<{ testId: string }> = ({testId}) => {
  const quizComplete = useQuizComplete();
  const [copied, setCopied] = useState(false);
  const currentLink = `${window.location.origin}/quizzes/${testId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className='link-block'>
      <h2 className="test-load-info">
        Тест
        <br/>
        <span>{`"${quizComplete?.title}"`}</span>
        <br/>
        успешно сохранён!
      </h2>
      <h4 className='link-head'>Ваша ссылка на страницу с тестом:</h4>
      <NavLink className='link-body' to={currentLink}>{currentLink}</NavLink>
      <button
        className={`btn btn-link-copy ${copied ? " btn-link-copy--copied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? 'Скопировано!' : 'Копировать ссылку в буфер'}
      </button>
      <p className="link-info">Кликните по ссылке для перехода к выполнению теста.</p>
      <p className="link-info">Или скопируйте ссылку в буфер для того чтобы ею поделиться.</p>
      <NavLink className='link-body' to={'/myquizzes'}>Перейти к моим тестам</NavLink>
      <NavLink className='link-body' to={'/createquiz'}>Вернутся на главную страницу</NavLink>
      <button className="btn btn-link-copy" onClick={useClearCurrentQuiz}>Создать ещё один тест</button>
    </div>
  )
}
