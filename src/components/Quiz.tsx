import React, { useState } from "react";
import { Quiz } from "../types/Quiz";
import { QuestionComponent } from "./Question";

export const QuizComponent: React.FC<{ quiz: Quiz; onReset: () => void }> = ({ quiz, onReset }) => {
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers(prev => [...prev, isCorrect]);
  };

  const correctCount = answers.filter(a => a).length;
  const incorrectCount = answers.filter(a => !a).length;
  const allAnswered = answers.length === quiz.questions.length;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>{quiz.title}</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>{quiz.description}</p>
      </div>

      {quiz.questions.map((question, index) => (
        <QuestionComponent
          key={question.id}
          question={question}
          onAnswer={handleAnswer}
        />
      ))}

      {allAnswered && (
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
            Score: {Math.round((correctCount / quiz.questions.length) * 100)}%
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
