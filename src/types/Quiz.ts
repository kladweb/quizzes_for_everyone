export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
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
  questionId: number;
  isCorrect: boolean;
  selectedIndex: number | null;
  correctIndex: number;
}

export interface IStatistics {
  userName: string;
  startedAt: number;
  finishedAt: number;
  score: number;
  answers: IAnswer[];
}
