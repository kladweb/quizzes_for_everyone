import React from "react";
import { Question } from "../../types/Quiz";

export const QuestionComponent: React.FC<{
  question: Question;
  selectedIndices: number[];
  onAnswer: (indices: number[]) => void;
  isSubmitted: boolean;
  showExplanation: boolean;
}> = ({ question, selectedIndices, onAnswer, isSubmitted, showExplanation }) => {

  const correctIndices = question.options
    .map((opt, idx) => opt[1] ? idx : -1)
    .filter(idx => idx !== -1);

  const isMultipleChoice = correctIndices.length > 1;

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;

    if (isMultipleChoice) {
      // Checkbox logic
      if (selectedIndices.includes(index)) {
        onAnswer(selectedIndices.filter(i => i !== index));
      } else {
        onAnswer([...selectedIndices, index]);
      }
    } else {
      // Radio button logic
      onAnswer([index]);
    }
  };

  const getButtonStyle = (index: number): React.CSSProperties => {
    const isSelected = selectedIndices.includes(index);
    const isCorrect = question.options[index][1];

    if (!isSubmitted) {
      return {
        backgroundColor: isSelected ? '#1976d2' : 'white',
        color: isSelected ? 'white' : '#333',
        borderColor: isSelected ? '#1976d2' : '#ddd'
      };
    }

    if (isCorrect) {
      return { backgroundColor: '#4caf50', color: 'white', borderColor: '#4caf50' };
    }

    if (isSelected && !isCorrect) {
      return { backgroundColor: '#f44336', color: 'white', borderColor: '#f44336' };
    }

    return { opacity: 0.5 };
  };

  const getButtonPrefix = (index: number): string => {
    if (!isMultipleChoice) return '';

    const isSelected = selectedIndices.includes(index);
    if (!isSubmitted) {
      return isSelected ? '☑ ' : '☐ ';
    }

    const isCorrect = question.options[index][1];
    if (isCorrect) return '☑ ';
    if (isSelected && !isCorrect) return '☑ ';
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
      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        {question.question}
        {isMultipleChoice && <span style={{ display: 'block', color: '#666', fontSize: '14px', marginLeft: '10px' }}>(Может быть несколько верных ответов)</span>}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map(([option], index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
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
              ...getButtonStyle(index)
            }}
          >
            {getButtonPrefix(index)}{option}
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
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
