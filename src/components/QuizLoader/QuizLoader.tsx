import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Quiz } from "../../types/Quiz";
import "./quizLoader.css";

export const QuizLoader: React.FC<{ onQuizLoad: (quiz: Quiz) => void, userUID: string }> = ({onQuizLoad, userUID}) => {
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sampleJSON = `
  Сделай (придумай) тест по [описание теста/тема/примеру: пример теста]
  состоящий из [кол-во вопросов] вопросов.
  В каждом вопросе должно быть три варианта ответов, 
  один из которых верный. Добавь краткое объяснение
  для каждого вопроса. Тест оформи в JSON файл по
  такому примеру:
{
  "title": "English Test: Present Simple",
  "description": "Mini test",
  "questions": [
    {
      "id": 1,
      "question": "She ___ to school.",
      "options": [
        ["go", false],
        ["goes", true],
        ["went", false],
        ["going", false]
      ],
      "explanation": "He/She/It → goes"
    },
    {
      "id": 2,
      "question": "Which of these are correct present simple forms?",
      "options": [
        ["I am", true],
        ["He are", false],
        ["They are", true],
        ["She am", false]
      ],
      "explanation": "I am, They are - correct forms"
    }
  ]
}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const quiz = JSON.parse(content) as Quiz;
        quiz.testId = nanoid(12);
        quiz.createdBy = userUID;

        // Basic validation
        if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
          throw new Error('Invalid quiz format');
        }

        onQuizLoad(quiz);
      } catch (err) {
        setError('Error loading quiz file. Please check the JSON format.');
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
    };

    reader.readAsText(file);
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(sampleJSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className='loaderBlock'>
      <h1>Создайте новый тест</h1>
      <p>Загрузите тест из JSON файла</p>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />

      {error && (
        <p className='textError'>{error}</p>
      )}

      <div className='jsonExampleContainer'>
        <div className='jsonExampleField'>
          <h3>Образец промпта для AI:</h3>
          <button
            className={`buttonCopy${copied ? " buttonCopied" : ""}`}
            onClick={handleCopyJSON}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre className='jsonExampleText'>{sampleJSON}</pre>
      </div>
    </div>
  );
};
