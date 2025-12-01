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
  questionId: string;
  isCorrect: boolean;
  selectedIndex: number;
  correctIndex: number;
}

export interface IStatistics {
  statistics: {
    userName: string;
    startedAt: string;
    finishedAt: string;
    score: number;
    answers: IAnswer[];
  }
}
