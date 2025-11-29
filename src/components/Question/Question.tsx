import React, { useState } from "react";
import { Question } from "../../types/Quiz";

export const QuestionComponent: React.FC<{
  question: Question;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  isSubmitted: boolean;
}> = ({ question, selectedIndex, onAnswer, isSubmitted }) => {

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    onAnswer(index);
  };

  const getButtonStyle = (index: number): React.CSSProperties => {
    const isSelected = index === selectedIndex;

    if (!isSubmitted) {
      return {
        backgroundColor: isSelected ? '#1976d2' : 'white',
        color: isSelected ? 'white' : '#333',
        borderColor: isSelected ? '#1976d2' : '#ddd'
      };
    }

    if (index === question.correctIndex) {
      return { backgroundColor: '#4caf50', color: 'white', borderColor: '#4caf50' };
    }

    if (isSelected && index !== question.correctIndex) {
      return { backgroundColor: '#f44336', color: 'white', borderColor: '#f44336' };
    }

    return { opacity: 0.5 };
  };

  return (
    <div style={{
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>{question.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option, index) => (
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
            {option}
          </button>
        ))}
      </div>
      {isSubmitted && (
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
