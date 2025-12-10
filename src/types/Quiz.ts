interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctAnswers: string[];
  explanation: string;
}

export interface Quiz {
  testId: string;
  createdBy: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface IAnswer {
  questionId: string;
  isCorrect: boolean;
  score: number;
  selectedOptionIds: string[];
  correctOptionIds: string[];
}

export interface IStatistics {
  userName: string;
  startedAt: number;
  finishedAt: number;
  incorrectCount: number;
  score: number;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  answers: IAnswer[];
}
