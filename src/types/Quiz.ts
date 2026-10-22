export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctAnswers: string[];
  explanation?: string;
}

export interface IQuizMeta {
  testId: string;
  createdBy: string;
  title: string;
  createdAt: number;
  modifiedAt?: number;
  category: string;
  categoryDraft?: string;
  lang: string;   //?
  access: "public" | "private";
  description?: string;
  executionCount: number;
  likeUsers: {
    [userId: string]: boolean;
  };
  dislikeUsers?: {
    [userId: string]: boolean;
  }
  questions?: Question[];
}

export type IQuizzes = Record<string, IQuizMeta>;

export interface IAnswer {
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
  answers: {
    [questionId: string]: IAnswer;
  }
}

export type IStatisticsAll = Record<string, IStatistics>;

export enum ToastType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
}

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export interface IUserAdmin {
  email: string | undefined;
  displayName: string;
  photoURL: string;
  quizzesCount: number;
  tokensDailyCount: number;
  tokensExtraCount: number;
  tokensCurrentCount: number;
  tokensPlan: string;
  registrationDate: number;
  lastVisitedDate: number;
  lastCreatedQuizDate: number;
  lastPassedQuizDate: number;
}

export type UsersAdminMap = Record<string, IUserAdmin>;

export const PLAN_LIMITS = {
  start: 50,
  pro: 200,
  vip: 500
} as const;

type Plan = keyof typeof PLAN_LIMITS;

export interface ITokens {
  plan: Plan;
  expiresAt: number;
  dailyCount: number;
  extraCount: number;
  usedToday: number;
  lastReset: number;
}
