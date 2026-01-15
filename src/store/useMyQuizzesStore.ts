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
      const quizzes = await QuizStorageManager.fetchUserQuizzes(userUid);
      set(() => ({myQuizzes: quizzes}));
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: []}));
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    }
  },
  deleteUserQuiz: async (testId: string, userUid: string) => {
    const testListPrev = get().myQuizzes;
    const testListNext = testListPrev.filter((quiz: Quiz) => quiz.testId !== testId);
    set(() => ({myQuizzes: testListNext}));
    try {
      await QuizStorageManager.removeUserQuiz(testId, userUid);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzes: testListPrev}));
      set(() => ({errorLoading: "Ошибка удаления!"}));
    }

  }
})

const useMyQuizzesStore = create<IQuizzesState>()(myQuizzesStore);

const useUserQuizzes = useMyQuizzesStore((state) => state.myQuizzes);
export const loadUserQuizzes = (userUid: string) => useMyQuizzesStore.getState().loadUserQuizzes(userUid);