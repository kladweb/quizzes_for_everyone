import React, { useState } from "react";
import { QuizComponent } from "./components/Quiz";
import { Quiz } from "./types/Quiz";
import { QuizLoader } from "./components/QuizLoader";

const App: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleQuizLoad = (loadedQuiz: Quiz) => {
    setQuiz(loadedQuiz);
  };

  const handleReset = () => {
    setQuiz(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {quiz ? (
        <QuizComponent quiz={quiz} onReset={handleReset} />
      ) : (
        <QuizLoader onQuizLoad={handleQuizLoad} />
      )}
    </div>
  );
};

export default App;
