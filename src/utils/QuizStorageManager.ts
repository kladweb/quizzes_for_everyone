import { child, get, ref, set } from "firebase/database";
import type { IStatistics, Quiz } from "../types/Quiz";
import { database } from "../firebase/firebase";

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
  async fetchUserQuizzes(userUid: string): Promise<Quiz[]> {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `users/${userUid}`));
      if (!snapshot.exists()) {
        throw new Error('No such quiz found!');
      }
      const quizIds: string[] = JSON.parse(snapshot.val());
      const quizzesRaw = await Promise.all(
        quizIds.map(id =>
          get(child(dbRef, `tests/${id}/test`)).then(s => s.val())
        )
      );
      const quizzes: Quiz[] = quizzesRaw
        .map(item => JSON.parse(item))
        .sort((a, b) => b.createdAt - a.createdAt);
      return quizzes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async saveQuizToStorage(quiz: Quiz, userUid: string, IdsList: string[]): Promise<void> {
    try {
      const promiseTests = set(ref(database, `tests/${quiz.testId}/test`), JSON.stringify(quiz));
      const promiseUserList = set(ref(database, `users/${userUid}`), JSON.stringify(IdsList));
      await Promise.all([promiseTests, promiseUserList]);
    } catch (error) {
      console.error(error);
    }
  },

  async removeUserQuiz(testId: string, userUid: string, IdsList: string[]): Promise<void> {
    try {
      const promiseTests = set(ref(database, `tests/${testId}`), null);
      const promiseUserList = set(ref(database, `users/${userUid}`), JSON.stringify(IdsList));
      await Promise.all([promiseTests, promiseUserList]);
    } catch (error) {
      console.error(error);
    }

  },

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
    const storageKey = `recentQuizzes`;
    let currentStatistic: IStatistics[] = [statisticInfo];
    const recentStatistic: IStatistics[] | null = this.getRecentAllStat();
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

  removeRecentStat(testId: string): IStatistics[] | null {
    const storageKey = `recentQuizzes`;
    const recentStatistic: IStatistics[] | null = this.getRecentAllStat();
    let newStatistic: IStatistics[] = [];
    if (recentStatistic && recentStatistic.length > 0) {
      newStatistic = recentStatistic.filter((statistic: IStatistics) => statistic.testId !== testId);
    } else {
      console.error('Неизвестная ошибка.');
      return null;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(newStatistic));
      return newStatistic;
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
      return null;
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
