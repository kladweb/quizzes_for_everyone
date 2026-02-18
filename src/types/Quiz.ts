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

export interface IQuizMeta {
  testId: string;
  createdBy: string;
  title: string;
  createdAt: number;
  modifiedAt?: number;
  category?: string;
  categoryDraft?: string;
  lang?: string;
  access: "public" | "private";
  description?: string;
}

interface IAnswer {
  questionId: string;
  isCorrect: boolean;
  score: number;
  selectedOptionIds: string[];
  correctOptionIds: string[];
}

export interface IStatistics {
  testId: string;
  statId: string;
  userUid?: string | null;
  title: string;
  userName: string;
  startedAt: number;
  finishedAt: number;  //0 - not finished;
  incorrectCount: number;
  score: number;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  answers: IAnswer[];
}

interface IFirestoreData {
  quizzesMeta: {
    [testId: string]: {
      title: string;
      createdBy: string;
      createdAt: number;
      modifiedAt: number;
      category: string;
      lang: string;
      access: "public" | "private";
      likeUsers: string[];
      executionCount: number;
    }
  },
  questions: {
    [testId: string]: string; //Question[]
  },
  statistics: {
    [statId: string]: string //IStatistics;
  },
  users: {
    [userId: string]: {
      [testId: string]: true;
    }
  }
}

// export interface IQuizStorage {
//   testId: string;
//   title: string;
//   finishedAt: number | null;
//   correctCount: number | null;
//   incorrectCount: number | null;
//   score: number | null;
// }
