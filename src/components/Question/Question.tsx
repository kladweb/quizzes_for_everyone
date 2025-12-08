import React from "react";
import { type Question } from "../../types/Quiz";

export const QuestionComponent: React.FC<{
  num: number;
  question: Question;
  selectedIds: string[];
  onAnswer: (ids: string[]) => void;
  isSubmitted: boolean;
  showExplanation: boolean;
}> = ({num, question, selectedIds, onAnswer, isSubmitted, showExplanation}) => {

  const isMultipleChoice = question.correctAnswers.length > 1;

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return;

    if (isMultipleChoice) {
      // Checkbox logic
      if (selectedIds.includes(optionId)) {
        onAnswer(selectedIds.filter(id => id !== optionId));
      } else {
        onAnswer([...selectedIds, optionId]);
      }
    } else {
      // Radio button logic
      onAnswer([optionId]);
    }
  };

  const getButtonStyle = (optionId: string): React.CSSProperties => {
    const isSelected = selectedIds.includes(optionId);
    const isCorrect = question.correctAnswers.includes(optionId);

    if (!isSubmitted) {
      return {
        backgroundColor: isSelected ? '#1976d2' : 'white',
        color: isSelected ? 'white' : '#333',
        borderColor: isSelected ? '#1976d2' : '#ddd'
      };
    }

    // After submission
    if (isCorrect && isSelected) {
      // User selected a correct answer - bright green with thick border
      return {
        backgroundColor: '#4caf50',
        color: 'white',
        borderColor: '#2e7d32',
        borderWidth: '3px',
        boxShadow: '0 0 8px rgba(76, 175, 80, 0.4)'
      };
    }

    if (isCorrect && !isSelected) {
      // Correct answer that user didn't select - lighter green, dashed border
      return {
        backgroundColor: '#a5d6a7',
        color: '#1b5e20',
        borderColor: '#66bb6a',
        borderWidth: '2px',
        borderStyle: 'dashed'
      };
    }

    if (!isCorrect && isSelected) {
      // User selected wrong answer - red with thick border
      return {
        backgroundColor: '#f44336',
        color: 'white',
        borderColor: '#c62828',
        borderWidth: '3px',
        boxShadow: '0 0 8px rgba(244, 67, 54, 0.4)'
      };
    }

    // Not selected and not correct - faded
    return {
      opacity: 0.4,
      backgroundColor: '#f5f5f5',
      color: '#999'
    };
  };

  const getButtonPrefix = (optionId: string): string => {
    if (!isMultipleChoice) return '';

    const isSelected = selectedIds.includes(optionId);
    const isCorrect = question.correctAnswers.includes(optionId);

    if (!isSubmitted) {
      return isSelected ? '☑ ' : '☐ ';
    }

    // After submission
    if (isCorrect && isSelected) return '✅ ';  // User got it right
    if (isCorrect && !isSelected) return '✓ ';  // Should have selected
    if (!isCorrect && isSelected) return '❌ ';  // Wrong choice
    return '☐ ';
  };

  return (
    <div style={{
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{marginBottom: '15px', color: '#333'}}>
        <span style={{fontSize: '16px', color: '#0366d6'}}>{`${num}) `}</span>
        {question.question}
        {isMultipleChoice && <span style={{display: "block", color: '#666', fontSize: '14px', marginLeft: '10px'}}>
          (Несколько вариантов ответов)
        </span>}
      </h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={isSubmitted}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: isSubmitted ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              ...getButtonStyle(option.id)
            }}
          >
            {getButtonPrefix(option.id)}{option.text}
          </button>
        ))}
      </div>
      {isSubmitted && showExplanation && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          backgroundColor: '#e3f2fd',
          borderRadius: '6px',
          color: '#1976d2',
          fontSize: '14px'
        }}>
          <strong>Объяснение:</strong> {question.explanation}
        </div>
      )}

      {isSubmitted && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#e65100'
        }}>
          <strong>Обозначения:</strong>{' '}
          <span style={{color: '#2e7d32', fontWeight: 'bold'}}>Сплошная зеленая рамка</span> = Ваш верный выбор{' '}
          | <span style={{color: '#66bb6a', fontWeight: 'bold'}}>Пунктирная зеленая</span> = Правильный вариант{' '}
          | <span style={{color: '#c62828', fontWeight: 'bold'}}>Красная рамка</span> = Ваш неверный ответ
        </div>
      )}
    </div>
  );
};
