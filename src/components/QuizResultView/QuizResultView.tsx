import React from "react";
import { type IStatistics } from "../../types/Quiz";

interface QuizResultViewProps {
  result: IStatistics;
  onReset: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({result, onReset}) => {
  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{color: '#2e7d32', marginBottom: '15px'}}>Тест выполнен!</h2>
        <p style={{fontSize: '18px', marginBottom: '10px'}}>
          <strong>Верных ответов:</strong> {result.correctCount} ✓
        </p>
        <p style={{fontSize: '18px', marginBottom: '10px'}}>
          <strong>Неверных/частично верных ответов:</strong> {result.incorrectCount} ✗
        </p>
        <p style={{fontSize: '18px', marginBottom: '20px'}}>
          <strong>Общий итог:</strong> {result.totalScore.toFixed(2)} / {result.answers.length}
        </p>
        <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1b5e20'}}>
          Ваш результат: {Math.round((result.totalScore / result.answers.length) * 100)}%
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
          Пройти тест ещё раз
        </button>
      </div>
    </div>
  );
}
