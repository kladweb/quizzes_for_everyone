import React from "react";
import { type Question } from "../../types/Quiz";
import "./question.css";

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

  const getQuestionButtonClass = (optionId: string): string => {
    const isSelected = selectedIds.includes(optionId);
    const isCorrect = question.correctAnswers.includes(optionId);

    if (!isSubmitted) {
      if (isSelected) {
        return "questionSelected";
      } else {
        return "questionMissed";
      }
    }

    // After submission
    if (isCorrect && isSelected) {
      // User selected a correct answer - bright green with thick border
      return "correctedAndSelectedAnswer";
    }

    if (isCorrect && !isSelected) {
      // Correct answer that user didn't select - lighter green, dashed border
      return "correctedAnswer";
    }

    if (!isCorrect && isSelected) {
      // User selected wrong answer - red with thick border
      return "selectedNoCorrectAnswer";
    }

    // Not selected and not correct - faded
    return "answerDefault"
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
    <div className='questionsContainer'>
      <h3 className='questionsTitle'>
        <span className='questionRadio'>{`${num}) `}</span>
        {question.question}
        {isMultipleChoice && <span className='questionCheckbox'>
          (Несколько вариантов ответов)
        </span>}
      </h3>
      <div className='questionOptions'>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={isSubmitted}
            className={`questionButton ${getQuestionButtonClass(option.id)}`}
          >
            {getButtonPrefix(option.id)}{option.text}
          </button>
        ))}
      </div>
      {isSubmitted && showExplanation && (
        <div className='questionExplain'>
          <strong>Объяснение:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};
