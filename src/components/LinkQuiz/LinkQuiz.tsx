import React, { useState } from "react";
import "./linkQuiz.css";

export const LinkQuiz: React.FC<{ testId: string }> = ({testId}) => {
  const [copied, setCopied] = useState(false);
  const currentLink = `${window.location.href}tests/${testId}`;
  // console.log(window.location.href);

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
    <div className='linkBlock'>
      <h4 className='linkHead'>Ваша ссылка на страницу с тестом:</h4>
      <p className='linkBody'>{currentLink}</p>
      <button
        className={`buttonCopy${copied ? " buttonCopied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied!' : 'Копировать ссылку в буфер'}
      </button>
      <a className="linkTest" href={currentLink} target="_blank">Перейти на страницу теста</a>
    </div>
  )
}
