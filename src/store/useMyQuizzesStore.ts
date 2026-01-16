import {create, type StateCreator} from "zustand";
import type {Quiz} from "../types/Quiz";
import {QuizStorageManager} from "../utils/QuizStorageManager";

interface IInitialState {
  myQuizzes: Quiz[],
  isLoading: boolean,
  errorLoading: string
}

interface IActions {
  loadUserQuizzes: (userUid: string) => void;
  saveUserQuiz: (quiz: Quiz, userUid: string) => Promise<void>;
  deleteUserQuiz: (testId: string, userUid: string) => Promise<void>;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  myQuizzes: [],
  isLoading: false,
  errorLoading: ""
}

const myQuizzesStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  loadUserQuizzes: async (userUid) => {
    try {
      set(() => ({isLoading: true}));
      const quizzes = await QuizStorageManager.fetchUserQuizzes(userUid);
      set(() => ({myQuizzes: quizzes}));
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: []}));
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  saveUserQuiz: async (quiz: Quiz, userUid: string) => {
    const testListPrev = get().myQuizzes;
    const testListNext = [quiz, ...testListPrev];
    const IdsList = testListNext.map(quiz => quiz.testId);
    set(() => ({myQuizzes: testListNext}));
    try {
      // set(() => ({isLoading: true}));
      await QuizStorageManager.saveQuizToStorage(quiz, userUid, IdsList);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: testListPrev}));
      set(() => ({errorLoading: "Ошибка сохранения теста!"}));
    } finally {
      // set(() => ({isLoading: false}));
    }
  },
  deleteUserQuiz: async (testId: string, userUid: string) => {
    const testListPrev = get().myQuizzes;
    const testListNext = testListPrev.filter((quiz: Quiz) => quiz.testId !== testId);
    const IdsList = testListNext.map(quiz => quiz.testId);
    set(() => ({myQuizzes: testListNext}));
    try {
      // set(() => ({isLoading: true}));
      await QuizStorageManager.removeUserQuiz(testId, userUid, IdsList);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: testListPrev}));
      set(() => ({errorLoading: "Ошибка удаления!"}));
    } finally {
      // set(() => ({isLoading: false}));
    }
  }
})

const useMyQuizzesStore = create<IQuizzesState>()(myQuizzesStore);

export const useMyQuizzes = () => useMyQuizzesStore((state) => state.myQuizzes);
export const useIsLoading = () => useMyQuizzesStore((state) => state.isLoading);
export const useErrorLoading = () => useMyQuizzesStore((state) => state.errorLoading);
export const loadUserQuizzes = (userUid: string) =>
  useMyQuizzesStore.getState().loadUserQuizzes(userUid);
export const saveUserQuiz = (quiz: Quiz, userUid: string) =>
  useMyQuizzesStore.getState().saveUserQuiz(quiz, userUid);
export const deleteUserQuiz = (testId: string, userUid: string) =>
  useMyQuizzesStore.getState().deleteUserQuiz(testId, userUid);