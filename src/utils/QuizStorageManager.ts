import { type IStatistics } from "../types/Quiz";

interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// interface QuizResult {
//   quizId: string;
//   completedAt: string;
//   score: number;
//   totalQuestions: number;
//   percentage: number;
//   answers: QuizAnswer[];
//   timeTaken?: number;
// }

export const QuizStorageManager = {
  // Save quiz result
  saveResult(testId: string, statistics: IStatistics): void {
    try {
      const storageKey = `quiz_result_${testId}`;
      localStorage.setItem(storageKey, JSON.stringify(statistics));
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  },

  // Get quiz result
  getResult(quizId: string): IStatistics | null {
    try {
      const storageKey = `quiz_result_${quizId}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to retrieve quiz result:', error);
      return null;
    }
  },

  // Check if quiz is completed
  isCompleted(quizId: string): boolean {
    return this.getResult(quizId) !== null;
  },

  // Clear specific quiz result (optional, for retaking)
  clearResult(quizId: string): void {
    try {
      const storageKey = `quiz_result_${quizId}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
    }
  },

  // Get all completed quiz IDs
  getAllCompletedQuizzes(): string[] {
    const quizIds: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('quiz_result_')) {
          quizIds.push(key.replace('quiz_result_', ''));
        }
      }
    } catch (error) {
      console.error('Failed to get completed quizzes:', error);
    }
    return quizIds;
  }
};
