import React, { useState } from "react";
import { nanoid } from "nanoid";
import type { Quiz } from "../../types/Quiz";
import { useSetQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { saveUserQuiz } from "../../store/useQuizzesStore";
import "./quizLoader.css";

interface IQuizLoaderProps {
  userUID: string,
  setCurrentTestId: (testId: string) => void
  setIsCreatingNewTest: (isCreatingNewTest: boolean) => void
}

export const QuizLoader: React.FC<IQuizLoaderProps> =
  ({userUID, setCurrentTestId, setIsCreatingNewTest}) => {
    const [error, setError] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const sampleJSON = `
Сделай (придумай) тест по [описание теста/тема/примеру: пример теста]
состоящий из [кол-во вопросов] вопросов. 
В каждом вопросе должно быть три варианта ответов, 
один из которых верный. 
Добавь краткое объяснение для каждого вопроса. 
Тест оформи и пришли в виде JSON файла по такому шаблону:
{
  "title": "English Test: Present Simple",
  "description": "Mini test",
  "questions": [
    {
      "id": "q1",
      "question": "She ___ to school.",
      "options": [
        { "id": "q1_a", "text": "go" },
        { "id": "q1_b", "text": "goes" },
        { "id": "q1_c", "text": "went" },
        { "id": "q1_d", "text": "going" }
      ],
      "correctAnswers": ["q1_b"],
      "explanation": "He/She/It → goes"
    },
    {
      "id": "q2",
      "question": "Which are correct present simple forms?",
      "options": [
        { "id": "q2_a", "text": "I am" },
        { "id": "q2_b", "text": "He are" },
        { "id": "q2_c", "text": "They are" },
        { "id": "q2_d", "text": "She am" }
      ],
      "correctAnswers": ["q2_a", "q2_c"],
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
          quiz.createdAt = Date.now();
          quiz.modifiedAt = Date.now();

          // Validation
          if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
            throw new Error('Неверный формат файла. Выберите, пожалуйста, другой файл.');
          }

          // Validate each question has the new structure
          quiz.questions.forEach((q, idx) => {
            if (!q.id) throw new Error(`Question ${idx + 1} missing id`);
            if (!q.options || !Array.isArray(q.options)) {
              throw new Error(`Question ${idx + 1} missing options array`);
            }
            if (!q.correctAnswers || !Array.isArray(q.correctAnswers)) {
              throw new Error(`Question ${idx + 1} missing correctAnswers array`);
            }
            q.options.forEach((opt, optIdx) => {
              if (!opt.id || !opt.text) {
                throw new Error(`Question ${idx + 1}, option ${optIdx + 1} missing id or text`);
              }
            });
          });

          useSetQuizDraft(quiz);

          // saveUserQuiz(quiz, userUID)
          //   .then(() => {
          //     setCurrentTestId(quiz.testId);
          //     setIsCreatingNewTest(false);
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //   })

        } catch (err) {
          setError(`Error loading quiz: ${(err as Error).message}`);
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
        <h2 className='loader-head'>Создаём новый тест</h2>
        <p className='loader-dsc'>Сначала создайте JSON файл при помощи любого ИИ</p>
        <div className='json-example-container'>
          <div className='json-example-field'>
            <h3>Образец промпта для AI:</h3>
            <button
              className={`btn btn-copy${copied ? " btn-copy--copied" : ""}`}
              onClick={handleCopyJSON}
            >
              {copied ? 'Скопировано!' : 'Копировать в буфер'}
            </button>
          </div>
          <pre className='json-example-content'>{sampleJSON}</pre>
        </div>
        <p className='loader-dsc'>Укажите путь к JSON файлу для загрузки</p>
        <div className='input-loader-block'>
          <input
            className='input-loader'
            type="file"
            accept=".json"
            onChange={handleFileChange}
          />
          {error && (
            <p className='text-error'>{error}</p>
          )}
        </div>
      </div>
    );
  };
