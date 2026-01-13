import {create, type StateCreator} from "zustand";
import type {Quiz} from "../types/Quiz";
import {QuizStorageManager} from "../utils/QuizStorageManager";

interface IInitialState {
  myQuizzes: Quiz[],
  isLoading: boolean,
}

interface IActions {
  loadUserQuizzes: (userUid: string) => void;
  deleteUserQuiz: (testId: string) => void;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  myQuizzes: [],
  isLoading: false
}

const myQuizzesStore: StateCreator<IQuizzesState> = (set) => ({
  ...initialState,
  loadUserQuizzes: async (userUid) => {
    const quizzes = await QuizStorageManager.fetchUserQuizzes(userUid);
    set((state) => ({myQuizzes: quizzes}));
  },
  deleteUserQuiz: (testId: string) => {
    const testList = useMyQuizzesStore((state) => state.myQuizzes);
    const IdsArray = testList.map(quiz => quiz.testId);
    let index = IdsArray.indexOf(testId);
    if (index !== -1) {
      IdsArray.splice(index, 1);
      const newTestList = [...testList];
      newTestList.splice(index, 1);
      set((state) => ({myQuizzes: state.myQuizzes}))
    }
  }
})

const useMyQuizzesStore = create<IQuizzesState>()(myQuizzesStore);

const useUserQuizzes = useMyQuizzesStore((state) => state.myQuizzes);
export const loadUserQuizzes = (userUid: string) => useMyQuizzesStore.getState().loadUserQuizzes(userUid);