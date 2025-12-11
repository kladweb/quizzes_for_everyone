import React, { useState } from "react";
import { IStatistics, type Question, type Quiz } from "../../types/Quiz";
import { QuestionComponent } from "../Question/Question";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { QuizResultView } from "../QuizResultView/QuizResultView";

interface IQuizProps {
  quiz: Quiz;
  onReset: () => void;
  saveStatistic: (statistics: IStatistics) => void;
}

export const QuizComponent: React.FC<IQuizProps> = ({quiz, onReset, saveStatistic}) => {
  const [currentStatistics, setCurrentStatistics] = useState<IStatistics | null>(null);
  const [shuffledQuestions] = useState<Question[]>(() => {
    // First, shuffle options within each question
    const questionsWithShuffledOptions = quiz.questions.map(q => {
      const shuffledOptions = [...q.options];
      // Fisher-Yates shuffle for options
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      return {
        ...q,
        options: shuffledOptions
      };
    });

    // Then shuffle the questions themselves
    const shuffledQuestions = [...questionsWithShuffledOptions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    return shuffledQuestions;
  });

  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>(
    new Array(shuffledQuestions.length).fill(null).map(() => [])
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCorrectExplanations, setShowCorrectExplanations] = useState(true);
  const [userName, setUserName] = useState('');
  const [startTime] = useState<number>(Date.now());

  const handleAnswer = (questionIndex: number, optionIds: string[]) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIds;
    setSelectedAnswers(newAnswers);
  };

  const calculateQuestionScore = (questionIndex: number): number => {
    const question = shuffledQuestions[questionIndex];
    const selected = selectedAnswers[questionIndex];
    const correct = question.correctAnswers;
    // If any wrong answer is selected, score is 0
    const hasWrongAnswer = selected.some(id => !correct.includes(id));
    if (hasWrongAnswer) return 0;
    // If no answers selected, score is 0
    if (selected.length === 0) return 0;
    // Score = correct choices selected / total number of correct answers
    const correctSelected = selected.filter(id => correct.includes(id)).length;
    return correctSelected / correct.length;
  };

  const isQuestionCorrect = (questionIndex: number): boolean => {
    return calculateQuestionScore(questionIndex) === 1;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const finishTime = Date.now();
    // Calculate total score with partial credit
    const totalScore = shuffledQuestions.reduce((sum, _, index) => {
      return sum + calculateQuestionScore(index);
    }, 0);
    const maxScore = shuffledQuestions.length;
    const scorePercentage = Math.round((totalScore / maxScore) * 100);
    const correctCount = shuffledQuestions.filter((_, index) => isQuestionCorrect(index)).length;
    const incorrectCount = shuffledQuestions.length - correctCount;
    const statistics: IStatistics = {
      testId: quiz.testId,
      title: quiz.title,
      userName: userName.trim(),
      startedAt: startTime,
      finishedAt: finishTime,
      incorrectCount: shuffledQuestions.length - correctCount,
      score: scorePercentage,
      totalScore: totalScore,
      maxScore: maxScore,
      correctCount: correctCount,
      answers: shuffledQuestions.map((question, index) => {
        const questionScore = calculateQuestionScore(index);
        return {
          questionId: question.id,
          isCorrect: questionScore === 1,
          score: questionScore,
          selectedOptionIds: selectedAnswers[index],
          correctOptionIds: question.correctAnswers
        };
      })
    };
    console.log("statistics: ", statistics);
    setCurrentStatistics(statistics);
    console.log(JSON.stringify(statistics, null, 2));
    saveStatistic(statistics);
    QuizStorageManager.saveResult(quiz.testId, statistics);
    const recentQuiz = {
      testId: quiz.testId,
      title: quiz.title,
      finishedAt: finishTime,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      score: scorePercentage
    }
    console.log('Срабатывание 2');
    console.log(recentQuiz);
    QuizStorageManager.saveRecentQuiz(recentQuiz);
  };

  const allAnswered = selectedAnswers.every(answer => answer.length > 0);
  const canSubmit = allAnswered && userName.trim().length > 0;

  console.log(isSubmitted);
  console.log(shuffledQuestions.length);

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#333', marginBottom: '10px'}}>{quiz.title}</h1>
        <p style={{color: '#666', fontSize: '16px'}}>{quiz.description}</p>

        {!isSubmitted && (
          <div style={{marginTop: '20px'}}>
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
          num={index + 1}
          question={question}
          selectedIds={selectedAnswers[index]}
          onAnswer={(ids) => handleAnswer(index, ids)}
          isSubmitted={isSubmitted}
          showExplanation={!isQuestionCorrect(index) || showCorrectExplanations}
        />
      ))}
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
            ПРОВЕРИТЬ РЕЗУЛЬТАТ
          </button>
          {!allAnswered && (
            <p style={{marginTop: '10px', color: '#f44336', fontSize: '14px'}}>
              Пожалуйста, ответьте на все вопросы перед отправкой
            </p>
          )}
          {allAnswered && !userName.trim() && (
            <p style={{marginTop: '10px', color: '#f44336', fontSize: '14px'}}>
              Пожалуйста, введите Ваше имя и/или фамилию перед отправкой
            </p>
          )}
        </div>
      )}
      {currentStatistics && isSubmitted && <QuizResultView result={currentStatistics} onReset={onReset}/>}
    </div>
  );
};
