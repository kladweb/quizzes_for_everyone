import React from "react";
import { type IStatistics } from "../../types/Quiz";

interface QuizResultViewProps {
  result: IStatistics | null;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({result}) => {
  if (!result) {
    return null;
  }
  return (
    <div className="quiz-result">
      <h2>Quiz Results</h2>
      <div className="score-summary">
        <p>Score: {result.maxScore}</p>
        <p>Completed: {new Date(result.finishedAt).toLocaleString()}</p>
      </div>

      <div className="answers-review">
        <h3>Your Answers</h3>
        {result.answers.map((answer, index) => (
          <div key={answer.questionId} className={answer.isCorrect ? 'correct' : 'incorrect'}>
            <p>Question {index + 1}</p>
            <p>Your answer: {...answer.selectedOptionIds}</p>
            {!answer.isCorrect && (
              <p>Correct answer: {...answer.correctOptionIds}</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
