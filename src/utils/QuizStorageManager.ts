import { child, get, ref, set } from "firebase/database";
import { database } from "../firebase/firebase";
import { IQuizMeta, IQuizzes, IStatistics, Question } from "../types/Quiz";

export const QuizStorageManager = {
  async fetchAllQuizzes(): Promise<IQuizzes> {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `quizzesMeta`));
      if (!snapshot.exists()) {
        throw new Error('No such quiz found!');
      }
      return snapshot.val();
      // const quizzesAll: IQuizMeta[] = Object.values(quizzesMetaData);
      // quizzesAll.sort((a, b) => b.createdAt - a.createdAt);
      // return quizzesAll;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async fetchUserQuizIds(userUid: string): Promise<string[]> {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `users/${userUid}/quizIds`));
      if (!snapshot.exists()) {
        return [];
        // throw new Error('No such quiz found!');
      }
      const quizIdsObj = snapshot.val();
      return Object.keys(quizIdsObj);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async fetchUserQuizzes(userUid: string, myQuizzesIds: string[]): Promise<IQuizzes> {
    const dbRef = ref(database);
    try {
      const quizzesArr: IQuizMeta[] = await Promise.all(
        myQuizzesIds.map(id => get(child(dbRef, `quizzesMeta/${id}`)).then(s => s.val())));
      const quizzesRaw: IQuizzes = {};
      quizzesArr.forEach((quiz: IQuizMeta) => {
        quizzesRaw[quiz.testId] = quiz;
      });
      return quizzesRaw;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async fetchCurrentQuiz(quizId: string): Promise<IQuizMeta | undefined> {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `quizzesMeta/${quizId}`));
      if (!snapshot.exists()) {
        // throw new Error('No such quiz found!');
        return;
      }
      return snapshot.val();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async fetchQuestions(quizId: string): Promise<Question[] | undefined> {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `questions/${quizId}`));
      if (!snapshot.exists()) {
        // throw new Error('No such quiz found!');
        return;
      }
      return JSON.parse(snapshot.val());
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async fetchAllStatistics() {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `statistics`));
      if (!snapshot.exists()) {
        return;
      }
      const statObj = snapshot.val();
      Object.keys(statObj).forEach((key: string) => {
        Object.keys(statObj[key]).forEach((keyValue: string) => {
          statObj[key][keyValue] = JSON.parse(statObj[key][keyValue]);
        });
      });
      return statObj;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async loadQuizAndQuestions(testId: string): Promise<IQuizMeta | undefined> {
    if (testId) {
      const quizPromise = await Promise.all([this.fetchCurrentQuiz(testId), this.fetchQuestions(testId)]);
      const quiz = quizPromise[0];
      const questions = quizPromise[1];
      if (quiz && questions) {
        quiz.questions = quizPromise[1];
      } else {
        return;
      }
      return quiz;
    }
  },

  async saveQuizToFirebase(quizMeta: IQuizMeta, questions: Question[], userUid: string): Promise<void> {
    try {
      const promiseMeta = set(ref(database, `quizzesMeta/${quizMeta.testId}`), quizMeta);
      // const promiseQuestions = set(ref(database, `questions/${quizMeta.testId}`), JSON.stringify(questions, null, 2));
      const promiseQuestions = set(ref(database, `questions/${quizMeta.testId}`), JSON.stringify(questions, null, 2));

      //Fake promise to control other user's tests
      const immediateResolve = () => Promise.resolve();

      const promiseUserList = (userUid === quizMeta.createdBy) ?
        set(ref(database, `users/${userUid}/quizIds/${quizMeta.testId}`), true) :
        immediateResolve;
      await Promise.all([promiseMeta, promiseQuestions, promiseUserList]);
    } catch (error) {
      console.error(error);
    }
  },

  async removeUserQuiz(testId: string, userUid: string): Promise<void> {
    try {
      const promiseMeta = set(ref(database, `quizzesMeta/${testId}`), null);
      const promiseQuestions = set(ref(database, `questions/${testId}`), null);
      const promiseUserList = set(ref(database, `users/${userUid}/quizIds/${testId}`), null);
      await Promise.all([promiseMeta, promiseQuestions, promiseUserList]);
    } catch (error) {
      console.error(error);
    }
  },

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
      const currentDate = Date.now();
      const recentStatisticClear = recentStatistic.filter((stat: IStatistics) => {
        if ((currentDate - stat.finishedAt) > 2592000000) {
          return false;
        }
        return this.fetchCurrentQuiz(stat.testId);
      });

      recentStatisticClear.forEach((statistic: IStatistics, i) => {
        if (statistic.testId === statisticInfo.testId) {
          recentStatisticClear[i] = statisticInfo;
          isCurrentExists = true;
        }
      });
      if (isCurrentExists) {
        currentStatistic = [...recentStatisticClear];
      } else {
        currentStatistic = [...recentStatisticClear, statisticInfo];
      }
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentStatistic));
    } catch (error) {
      console.error('Failed to clear quiz result:', error);
    }
  },

  removeRecentStat(testId: string):
    IStatistics[] | null {
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

  getRecentStatTestId(testId: string):
    IStatistics | null {
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
