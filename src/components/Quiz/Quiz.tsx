import React, { useState } from "react";
import { IStatistics, type Quiz } from "../../types/Quiz";
import { QuestionComponent } from "../Question/Question";

interface IQuizProps {
  quiz: Quiz;
  onReset: () => void;
  saveStatistic: (statistics: IStatistics) => void;
}

export const QuizComponent: React.FC<IQuizProps> = ({quiz, onReset, saveStatistic}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCorrectExplanations, setShowCorrectExplanations] = useState(true);
  const [userName, setUserName] = useState('');
  const [startTime] = useState<number>(Date.now());

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const finishTime = Date.now();
    const correctCount = selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctIndex).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const statistics = {
      userName: userName.trim(),
      startedAt: startTime,
      finishedAt: finishTime,
      score: score,
      answers: quiz.questions.map((question, index) => ({
        questionId: question.id,
        isCorrect: selectedAnswers[index] === question.correctIndex,
        selectedIndex: selectedAnswers[index],
        correctIndex: question.correctIndex
      }))
    };
    saveStatistic(statistics);
    // console.log(JSON.stringify(statistics, null, 2));
  };

  const allAnswered = selectedAnswers.every(answer => answer !== null);
  const canSubmit = allAnswered && userName.trim().length > 0;

  const correctCount = isSubmitted
    ? selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctIndex).length
    : 0;
  const incorrectCount = isSubmitted ? quiz.questions.length - correctCount : 0;

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#333', marginBottom: '10px'}}>{quiz.title}</h1>
        <p style={{color: '#666', fontSize: '16px'}}>{quiz.description}</p>

        {!isSubmitted && (
          <div style={{marginTop: '20px'}}>
            <input
              type="text"
              placeholder="Ваше имя и/или фамилия *"
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

      {quiz.questions.map((question, index) => (
        <QuestionComponent
          key={question.id}
          question={question}
          selectedIndex={selectedAnswers[index]}
          onAnswer={(optionIndex) => handleAnswer(index, optionIndex)}
          isSubmitted={isSubmitted}
          showExplanation={selectedAnswers[index] !== question.correctIndex || showCorrectExplanations}
        />
      ))}

      {!isSubmitted && (
        <div style={{textAlign: 'center', marginTop: '30px'}}>
          <div style={{marginBottom: '20px'}}>
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
            ПОКАЗАТЬ РЕЗУЛЬТАТ
          </button>
          {!allAnswered && (
            <p style={{marginTop: '10px', color: '#f44336', fontSize: '14px'}}>
              Пожалуйста, ответьте на все вопросы перед отправкой
            </p>
          )}
          {allAnswered && !userName.trim() && (
            <p style={{marginTop: '10px', color: '#f44336', fontSize: '14px'}}>
              Пожалуйста, введите Ваше имя перед отправкой
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
          <h2 style={{color: '#2e7d32', marginBottom: '15px'}}>Тест выполнен!</h2>
          <p style={{fontSize: '18px', marginBottom: '10px'}}>
            <strong>Верных ответов:</strong> {correctCount} ✓
          </p>
          <p style={{fontSize: '18px', marginBottom: '20px'}}>
            <strong>Неверных ответов:</strong> {incorrectCount} ✗
          </p>
          <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1b5e20'}}>
            Результат: {Math.round((correctCount / quiz.questions.length) * 100)}%
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
      )}
    </div>
  );
};
