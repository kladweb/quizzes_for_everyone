import type { IStatistics } from "../types/Quiz";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

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
  // saveResult(testId: string, statistics: IStatistics): void {
  //   try {
  //     const storageKey = `quiz_result_${testId}`;
  //     localStorage.setItem(storageKey, JSON.stringify(statistics));
  //   } catch (error) {
  //     console.error('Failed to save quiz result:', error);
  //   }
  // },

  // Get quiz result
  // getResult(quizId: string): IStatistics | null {
  //   try {
  //     const storageKey = `quiz_result_${quizId}`;
  //     const stored = localStorage.getItem(storageKey);
  //     if (!stored) return null;
  //     return JSON.parse(stored);
  //   } catch (error) {
  //     console.error('Failed to retrieve quiz result:', error);
  //     return null;
  //   }
  // },

  // Check if quiz is completed
  // isCompleted(quizId: string): boolean {
  //   return this.getResult(quizId) !== null;
  // },

  // Clear specific quiz result (optional, for retaking)
  clearResult(): void {
    try {
      const storageKey = `recentQuizzes`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
    }
  },

  saveRecentStat(statisticInfo: IStatistics): void {
    console.log(statisticInfo.testId);
    console.log(statisticInfo);
    const storageKey = `recentQuizzes`;
    let currentStatistic: IStatistics[] = [statisticInfo];
    const recentStatistic: IStatistics[] | null = this.getRecentAllStat();
    console.log(recentStatistic);
    let isCurrentExists = false;
    if (recentStatistic && recentStatistic.length > 0) {
      recentStatistic.forEach((statistic: IStatistics, i) => {
        if (statistic.testId === statisticInfo.testId) {
          recentStatistic[i] = statisticInfo;
          isCurrentExists = true;
        }
      });
      if (isCurrentExists) {
        currentStatistic = [...recentStatistic];
      } else {
        currentStatistic = [statisticInfo, ...recentStatistic];
      }
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentStatistic));
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
    }
  },

  removeRecentStat(testId: string): void {
    const storageKey = `recentQuizzes`;
    const recentStatistic: IStatistics[] | null = this.getRecentAllStat();
    if (recentStatistic && recentStatistic.length > 0) {
      recentStatistic.filter((statistic: IStatistics) => statistic.testId !== testId);
    } else {
      console.error('Неизвестная ошибка.');
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(recentStatistic));
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
    }
  },

  getRecentAllStat(): IStatistics[] | null {
    try {
      const storageKey = `recentQuizzes`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to retrieve quiz result:', error);
      return null;
    }
  },

  getRecentStatTestId(testId: string): IStatistics | null {
    try {
      const storageKey = `recentQuizzes`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      const statistics = JSON.parse(stored);
      let currentStatistic: IStatistics | null = null;
      statistics.forEach((statistic: IStatistics) => {
        if (statistic.testId === testId) {
          currentStatistic = statistic;
        }
      });
      return currentStatistic;
    } catch (error) {
      console.error('Failed to retrieve quiz result:', error);
      return null;
    }
  },

  // saveRecentQuiz(quizStorage: IQuizStorage): void {
  //   let quizzes: IQuizStorage[] = [quizStorage];
  //   const recentQuizzes: IQuizStorage[] | null = this.getRecentQuizzes();
  //   // console.log('recentQuizzes: ', recentQuizzes);
  //   // console.log('quizStorage: ', quizStorage);
  //   let isQuizExists = false;
  //   if (recentQuizzes && recentQuizzes.length > 0) {
  //     recentQuizzes.forEach((quiz: IQuizStorage, i) => {
  //       if (quiz.testId === quizStorage.testId) {
  //         recentQuizzes[i] = quizStorage;
  //         isQuizExists = true;
  //       }
  //     });
  //     if (isQuizExists) {
  //       quizzes = [...recentQuizzes];
  //     } else {
  //       quizzes = [quizStorage, ...recentQuizzes];
  //     }
  //   }
  //   try {
  //     const storageKey = `recentQuizzes`;
  //     localStorage.setItem(storageKey, JSON.stringify(quizzes));
  //   } catch (error) {
  //     console.error('Failed to save recent quiz:', error);
  //   }
  // },

  // getRecentQuizzes(): IQuizStorage[] | null {
  //   try {
  //     const storageKey = `recentQuizzes`;
  //     const stored = localStorage.getItem(storageKey);
  //     if (!stored) return null;
  //     return JSON.parse(stored);
  //   } catch (error) {
  //     console.error('Failed to retrieve quiz result:', error);
  //     return null;
  //   }
  // },

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
