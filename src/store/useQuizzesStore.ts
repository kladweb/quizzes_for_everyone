import { create, type StateCreator } from "zustand";
import { QuizStorageManager } from "../utils/QuizStorageManager";
import type { Quiz } from "../types/Quiz";

interface IInitialState {
  allQuizzes: Quiz[];
  myQuizzes: Quiz[],
  isLoading: boolean,
  isAllLoaded: boolean,
  isMyLoaded: boolean,
  errorLoading: string
}

interface IActions {
  loadAllQuizzes: () => void;
  loadUserQuizzes: (userUid: string) => void;
  saveUserQuiz: (quiz: Quiz, userUid: string) => Promise<void>;
  deleteUserQuiz: (testId: string, userUid: string) => Promise<void>;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  allQuizzes: [],
  myQuizzes: [],
  isLoading: false,
  isAllLoaded: false,
  isMyLoaded: false,
  errorLoading: ""
}

const quizzesStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  loadAllQuizzes: async () => {
    try {
      set(() => ({isLoading: true}));
      const quizzes = await QuizStorageManager.fetchAllQuizzes();
      set(() => ({allQuizzes: quizzes}));
      set(() => ({isAllLoaded: true}));
      set(() => ({errorLoading: ""}));
    } catch (error) {
      // set(() => ({myQuizzes: []}));
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  loadUserQuizzes: async (userUid) => {
    try {
      set(() => ({isLoading: true}));
      const quizzes = await QuizStorageManager.fetchUserQuizzes(userUid);
      set(() => ({myQuizzes: quizzes}));
      set(() => ({isMyLoaded: true}));
      set(() => ({errorLoading: ""}));
    } catch (error) {
      // set(() => ({myQuizzes: []}));
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  // loadUserQuizzes: async (userUid) => {
  //   try {
  //     set(() => ({isLoading: true}));
  //     const quizzes = await QuizStorageManager.fetchUserQuizzes(userUid);
  //     set(() => ({myQuizzes: quizzes}));
  //     set(() => ({errorLoading: ""}));
  //   } catch (error) {
  //     // set(() => ({myQuizzes: []}));
  //     console.log(error);
  //     set(() => ({errorLoading: "Ошибка загрузки данных!"}));
  //   } finally {
  //     set(() => ({isLoading: false}));
  //   }
  // },
  saveUserQuiz: async (quiz: Quiz, userUid: string) => {
    const testListPrev = get().myQuizzes;
    if (!testListPrev) {
      return;
    }
    const IdsList = testListPrev.map(myQuiz => myQuiz.testId);
    if (IdsList.includes(quiz.testId)) {
      return;
    }
    const testListNext = [quiz, ...testListPrev];
    IdsList.push(quiz.testId);
    set(() => ({myQuizzes: testListNext}));
    try {
      await QuizStorageManager.saveQuizToStorage(quiz, userUid, IdsList);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: testListPrev}));
      set(() => ({errorLoading: "Ошибка сохранения теста!"}));
    }
  },
  deleteUserQuiz: async (testId: string, userUid: string) => {
    const testListPrev = get().myQuizzes;
    // console.log(testListPrev.length);
    if (!testListPrev) {
      return;
    }
    const testListNext = testListPrev.filter((quiz: Quiz) => quiz.testId !== testId);
    // console.log(testListNext.length);
    const IdsList = testListNext.map(quiz => quiz.testId);
    // console.log(IdsList);
    set(() => ({myQuizzes: testListNext}));
    try {
      await QuizStorageManager.removeUserQuiz(testId, userUid, IdsList);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: testListPrev}));
      set(() => ({errorLoading: "Ошибка удаления!"}));
    }
  }
})

const useQuizzesStore = create<IQuizzesState>()(quizzesStore);

export const useAllQuizzes = () => useQuizzesStore((state) => state.allQuizzes);
export const useMyQuizzes = () => useQuizzesStore((state) => state.myQuizzes);
export const useIsLoading = () => useQuizzesStore((state) => state.isLoading);
export const useIsAllLoaded = () => useQuizzesStore((state) => state.isAllLoaded);
export const useIsMyLoaded = () => useQuizzesStore((state) => state.isMyLoaded);
export const useErrorLoading = () => useQuizzesStore((state) => state.errorLoading);
export const loadAllQuizzes = () => useQuizzesStore.getState().loadAllQuizzes();
export const loadUserQuizzes = (userUid: string) =>
  useQuizzesStore.getState().loadUserQuizzes(userUid);
export const saveUserQuiz = (quiz: Quiz, userUid: string) =>
  useQuizzesStore.getState().saveUserQuiz(quiz, userUid);
export const deleteUserQuiz = (testId: string, userUid: string) =>
  useQuizzesStore.getState().deleteUserQuiz(testId, userUid);
