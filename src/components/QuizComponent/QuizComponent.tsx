import React, { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { nanoid } from "nanoid";
import type { IStatistics, Question, IQuizMeta } from "../../types/Quiz";
import { QuestionComponent } from "../Question/Question";
import { QuizStorageManager } from "../../utils/QuizStorageManager";
import { QuizResultView } from "../QuizResultView/QuizResultView";
import { useUser } from "../../store/useUserStore";
import { database } from "../../firebase/firebase";
import "./quizComponent.css";
import { updateQuiz } from "../../store/useQuizzesStore";

interface IQuizProps {
  quiz: IQuizMeta;
  questions: Question[];
  onReset: () => void;
  saveStatistic: (statistics: IStatistics) => void;
}

export const QuizComponent: React.FC<IQuizProps> = ({quiz, questions, onReset, saveStatistic}) => {
  const user = useUser();
  const statId = nanoid(15);
  const [currentStatistics, setCurrentStatistics] = useState<IStatistics | null>(null);
  const [shuffledQuestions] = useState<Question[]>(() => {
    // First, shuffle options within each question
    const questionsWithShuffledOptions = questions.map(q => {
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
      statId: statId,
      userUid: user ? user.uid : null,
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
    setCurrentStatistics(statistics);
    // console.log(JSON.stringify(statistics, null, 2));
    saveStatistic(statistics);
    // console.log("statistics 01: ", statistics);
    QuizStorageManager.saveRecentStat(statistics);
    quiz.executionCount++
    updateQuiz(quiz);
    set(ref(database, `quizzesMeta/${quiz.testId}/executionCount`), quiz.executionCount);
  };

  const allAnswered = selectedAnswers.every(answer => answer.length > 0);
  const canSubmit = allAnswered && userName.trim().length > 0;

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStatistics(null);
    setSelectedAnswers(new Array(shuffledQuestions.length).fill(null).map(() => []));
    onReset();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);
    // setTimeout(() => location.reload(), 0);
  }

  useEffect(() => {
    const startStatistics: IStatistics = {
        testId: quiz.testId,
        statId: statId,
        userUid: null,
        title:
        quiz.title,
        userName: userName.trim(),
        startedAt: startTime,
        finishedAt: 0,
        incorrectCount: 0,
        score: 0,
        totalScore: 0,
        maxScore: 0,
        correctCount: 0,
        answers: [],
      }
    ;
    // console.log("statistics 02: ", startStatistics);
    QuizStorageManager.saveRecentStat(startStatistics);

  }, []);

  return (
    <div className='quizContainer'>
      <div className='quizHeadBlock'>
        <h2 className='quizHead'>{quiz.title}</h2>
        <p>{quiz.description}</p>

        {!isSubmitted && (
          <div className='quizHeadBody'>
            <input
              name='questionId'
              type="text"
              placeholder="Введите Ваше имя и/или Фамилию"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
        <div className='submittedInfoBlock'>
          <strong>Обозначения:</strong>{' '}
          <span className='textCorrect'>Сплошная зеленая рамка</span> = Ваш верный выбор{' '}
          | <span className='textPossibleCorrect'>Пунктирная зеленая</span> = Правильный вариант{' '}
          | <span className='textIncorrect'>Красная рамка</span> = Ваш неверный ответ
        </div>
      )}
      {!isSubmitted && (
        <div className='submitBlock'>
          <div className='submitSettings'>
            <label>
              <input
                type="checkbox"
                checked={showCorrectExplanations}
                onChange={(e) => setShowCorrectExplanations(e.target.checked)}
              />
              Показать объяснения по завершении теста и для правильных ответов
            </label>
          </div>
          <button
            className={`quizSubmitButton${canSubmit ? ' canSubmitButton' : ''}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            ПРОВЕРИТЬ РЕЗУЛЬТАТ
          </button>
          {!allAnswered && (
            <p className='warningInfo'>
              Пожалуйста, ответьте на все вопросы перед отправкой
            </p>
          )}
          {allAnswered && !userName.trim() && (
            <p className='warningInfo'>
              Пожалуйста, введите Ваше имя и/или фамилию перед отправкой
            </p>
          )}
        </div>
      )}
      {currentStatistics && isSubmitted && <QuizResultView result={currentStatistics} onReset={handleReset}/>}
    </div>
  );
};
