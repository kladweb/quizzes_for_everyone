import React, { useState } from "react";
import { nanoid } from "nanoid";
import { IQuizMeta, ToastType } from "../../types/Quiz";
import { setQuizDraft } from "../../store/useCurrentCreatingQuiz";
import { showToast } from "../../store/useNoticeStore";
import { jsonTemplate } from "../../variables/quizData";
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
    const [copiedTemplate, setCopiedTemplate] = useState(false);

    const sampleJSON = `Сделай (придумай) тест по [описание теста/тема/примеру: пример теста]
состоящий из [кол-во вопросов] вопросов. 
В каждом вопросе должно быть три варианта ответов, 
один из которых верный. 
Добавь краткое объяснение для каждого вопроса. 
Тест оформи и пришли в виде JSON файла по такому шаблону:
${jsonTemplate}`;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        showToast('Ошибка создания теста!', ToastType.ERROR);
        return;
      }
      setError('');
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const quiz: IQuizMeta = JSON.parse(content);
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

          setQuizDraft(quiz);

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
        setCopiedTemplate(false);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    const handleCopyTemplate = async () => {
      try {
        await navigator.clipboard.writeText(jsonTemplate);
        setCopied(false);
        setCopiedTemplate(true);
        setTimeout(() => setCopiedTemplate(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    return (
      <div className='loaderBlock'>
        <h2 className='loader-head'>Создаём новый тест</h2>
        <p className='loader-dsc'>Сначала создайте JSON файл при помощи любого ИИ</p>
        <div className='json-example-container'>
          <h3>Образец промпта для AI:</h3>
          <pre className='json-example-content'>{sampleJSON}</pre>
          <div className='json-example-field'>
            <button
              className={`btn btn-copy${copied ? " btn-copy--copied" : ""}`}
              onClick={handleCopyJSON}
            >
              {copied ? 'Скопировано!' : 'Копировать промпт в буфер'}
            </button>
            <button
              className={`btn btn-copy${copiedTemplate ? " btn-copy--copied" : ""}`}
              onClick={handleCopyTemplate}
            >
              {copiedTemplate ? 'Скопировано!' : 'Копировать только шаблон json'}
            </button>
          </div>
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
