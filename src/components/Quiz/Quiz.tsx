import React, { useState } from "react";
import { type Quiz } from "../../types/Quiz";
import { QuestionComponent } from "../Question/Question";

export const QuizComponent: React.FC<{ quiz: Quiz; onReset: () => void }> = ({quiz, onReset}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const allAnswered = selectedAnswers.every(answer => answer !== null);

  const correctCount = isSubmitted
    ? selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctIndex).length
    : 0;
  const incorrectCount = isSubmitted ? quiz.questions.length - correctCount : 0;

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#333', marginBottom: '10px'}}>{quiz.title}</h1>
        <p style={{color: '#666', fontSize: '16px'}}>{quiz.description}</p>
      </div>

      {quiz.questions.map((question, index) => (
        <QuestionComponent
          key={question.id}
          question={question}
          selectedIndex={selectedAnswers[index]}
          onAnswer={(optionIndex) => handleAnswer(index, optionIndex)}
          isSubmitted={isSubmitted}
        />
      ))}

      {!isSubmitted && (
        <div style={{textAlign: 'center', marginTop: '30px'}}>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: allAnswered ? '#1976d2' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            SUBMIT
          </button>
          {!allAnswered && (
            <p style={{marginTop: '10px', color: '#f44336', fontSize: '14px'}}>
              Please answer all questions before submitting
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
          <h2 style={{color: '#2e7d32', marginBottom: '15px'}}>Quiz Complete!</h2>
          <p style={{fontSize: '18px', marginBottom: '10px'}}>
            <strong>Correct:</strong> {correctCount} ✓
          </p>
          <p style={{fontSize: '18px', marginBottom: '20px'}}>
            <strong>Incorrect:</strong> {incorrectCount} ✗
          </p>
          <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1b5e20'}}>
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
