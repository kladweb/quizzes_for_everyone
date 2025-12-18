import React, {useEffect, useRef} from "react";
import {type IStatistics} from "../../types/Quiz";
import {RecentQuizzes} from "../RecentQuizzes/RecentQuizzes";
import "./quizResultView.css";

interface QuizResultViewProps {
  result: IStatistics;
  onReset: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({result, onReset}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (myRef.current) {
        myRef.current.scrollIntoView({behavior: 'smooth'});
      }
    }, 100)
  }, [myRef]);

  return (
      <div ref={myRef} className="result-wrapper">
        <div className="result-card">
          <h2 className="result-title">Тест выполнен!</h2>
          <h3 className="result-subtitle">{result.title}</h3>
          <p className="result-text">
            <strong>Верных ответов:</strong> {result.correctCount} ✓
          </p>
          <p className="result-text">
            <strong>Неверных/частично верных ответов:</strong> {result.incorrectCount} ✗
          </p>
          <p className="result-text result-text--total">
            <strong>Общий итог:</strong> {result.totalScore.toFixed(2)} / {result.answers.length}
          </p>
          <p className="result-percent">
            Ваш результат: {Math.round((result.totalScore / result.answers.length) * 100)}%
          </p>
          <button className="result-button" onClick={onReset}>
            Пройти тест ещё раз
          </button>
        </div>
        <RecentQuizzes currentTestId={result.testId} />
      </div>
  );
}
