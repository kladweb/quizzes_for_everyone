import React, { useState } from "react";
import { IStatistics, type Question, type Quiz } from "../../types/Quiz";
import { QuestionComponent } from "../Question/Question";

interface IQuizProps {
  quiz: Quiz;
  onReset: () => void;
  saveStatistic: (statistics: IStatistics) => void;
}

export const QuizComponent: React.FC<{ quiz: Quiz; onReset: () => void }> = ({ quiz, onReset }) => {
  const [shuffledQuestions] = useState<Question[]>(() => {
    const questions = quiz.questions.map(q => {
      const optionsWithIndices = q.options.map((option, index) => ({ option, index }));

      // Fisher-Yates shuffle for options
      for (let i = optionsWithIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
      }

      return {
        ...q,
        options: optionsWithIndices.map(item => item.option)
      };
    });

    // Fisher-Yates shuffle for questions
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
  });

  const [selectedAnswers, setSelectedAnswers] = useState<number[][]>(
    new Array(shuffledQuestions.length).fill(null).map(() => [])
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCorrectExplanations, setShowCorrectExplanations] = useState(true);
  const [userName, setUserName] = useState('');
  const [startTime] = useState<number>(Date.now());

  const handleAnswer = (questionIndex: number, indices: number[]) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = indices;
    setSelectedAnswers(newAnswers);
  };

  const isQuestionCorrect = (questionIndex: number): boolean => {
    const question = shuffledQuestions[questionIndex];
    const selected = selectedAnswers[questionIndex];
    const correctIndices = question.options
      .map((opt, idx) => opt[1] ? idx : -1)
      .filter(idx => idx !== -1);

    // All-or-nothing: must select ALL correct and NO incorrect
    if (selected.length !== correctIndices.length) return false;
    return correctIndices.every(idx => selected.includes(idx)) &&
      selected.every(idx => correctIndices.includes(idx));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const finishTime = Date.now();
    const correctCount = shuffledQuestions.filter((_, index) => isQuestionCorrect(index)).length;
    const score = Math.round((correctCount / shuffledQuestions.length) * 100);

    const statistics = {
      statistics: {
        userName: userName.trim(),
        startedAt: startTime,
        finishedAt: finishTime,
        score: score,
        answers: shuffledQuestions.map((question, index) => {
          const correctIndices = question.options
            .map((opt, idx) => opt[1] ? idx : -1)
            .filter(idx => idx !== -1);

          return {
            questionId: question.id,
            isCorrect: isQuestionCorrect(index),
            selectedIndices: selectedAnswers[index],
            correctIndices: correctIndices
          };
        })
      }
    };

    console.log(JSON.stringify(statistics, null, 2));
  };

  const allAnswered = selectedAnswers.every(answer => answer.length > 0);
  const canSubmit = allAnswered && userName.trim().length > 0;

  const correctCount = isSubmitted
    ? shuffledQuestions.filter((_, index) => isQuestionCorrect(index)).length
    : 0;
  const incorrectCount = isSubmitted ? shuffledQuestions.length - correctCount : 0;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>{quiz.title}</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>{quiz.description}</p>

        {!isSubmitted && (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Enter your name *"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                maxWidth: '300px'
              }}
            />
          </div>
        )}
      </div>

      {shuffledQuestions.map((question, index) => (
        <QuestionComponent
          key={question.id}
          question={question}
          selectedIndices={selectedAnswers[index]}
          onAnswer={(indices) => handleAnswer(index, indices)}
          isSubmitted={isSubmitted}
          showExplanation={!isQuestionCorrect(index) || showCorrectExplanations}
        />
      ))}

      {!isSubmitted && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#333'
            }}>
              <input
                type="checkbox"
                checked={showCorrectExplanations}
                onChange={(e) => setShowCorrectExplanations(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              />
              Показать объяснения по завершении теста и для правильных ответов
            </label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: canSubmit ? '#1976d2' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            SUBMIT
          </button>
          {!allAnswered && (
            <p style={{ marginTop: '10px', color: '#f44336', fontSize: '14px' }}>
              Пожалуйста, ответьте на все вопросы перед отправкой
            </p>
          )}
          {allAnswered && !userName.trim() && (
            <p style={{ marginTop: '10px', color: '#f44336', fontSize: '14px' }}>
              Пожалуйста, введите Ваше имя и/или фамилию перед отправкой
            </p>
          )}
        </div>
      )}

      {isSubmitted && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#2e7d32', marginBottom: '15px' }}>Quiz Complete!</h2>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            <strong>Correct:</strong> {correctCount} ✓
          </p>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            <strong>Incorrect:</strong> {incorrectCount} ✗
          </p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' }}>
            Score: {Math.round((correctCount / shuffledQuestions.length) * 100)}%
          </p>
          <button
            onClick={onReset}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Load Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};
