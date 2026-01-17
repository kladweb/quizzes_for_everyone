import React, {useState} from "react";
import "./linkQuiz.css";

export const LinkQuiz: React.FC<{ testId: string }> = ({testId}) => {
  const [copied, setCopied] = useState(false);
  const currentLink = `${window.location.origin}/quizzes/${testId}`;
  // const currentLink = `quizzes/${testId}`;

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
      <h4 className='link-head'>Ваша ссылка на страницу с тестом:</h4>
      <p className='link-body'>{currentLink}</p>
      <button
        className={`btn btn-link-copy ${copied ? " btn-link-copy--copied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? 'Скопировано!' : 'Копировать ссылку в буфер'}
      </button>
      <a className="link-newTest" href={currentLink} target="_blank">Перейти на страницу теста</a>
    </div>
  )
}
