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
  deleteUserQuiz: (testId: string) => void;
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
    } catch (error) {
      set(() => ({myQuizzes: []}));
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    }
  },
  deleteUserQuiz: (testId: string, userUid: string) => {
    const testListPrev = get().myQuizzes;
    const testListNext = testListPrev.filter((quiz: Quiz) => quiz.testId !== testId);
    set(() => ({myQuizzes: testListPrev}));



    const IdsArray = testList.map(quiz => quiz.testId);
    let indexQuiz = IdsArray.indexOf(testId);
    if (indexQuiz !== -1) {
      IdsArray.splice(indexQuiz, 1);
      const newTestList = [...testList];
      newTestList.splice(indexQuiz, 1);
    }

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