import { create, type StateCreator } from "zustand";
import { QuizStorageManager } from "../utils/QuizStorageManager";
import { IQuizMeta, IQuizzes } from "../types/Quiz";

interface IInitialState {
  allQuizzes: IQuizzes | null;
  myQuizzesIds: string[],
  isLoading: boolean,
  isAllLoaded: boolean,
  isMyIdsLoaded: boolean,
  isMyQuizzesLoaded: boolean,
  errorLoading: string
}

interface IActions {
  loadAllQuizzes: () => void;
  loadUserIds: (userUid: string) => void;
  loadUserQuizzes: (userUid: string) => void;
  saveUserQuiz: (quiz: IQuizMeta, userUid: string) => Promise<void>;
  deleteUserQuiz: (testId: string, userUid: string) => Promise<void>;
  updateQuiz: (quiz: IQuizMeta) => void;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  allQuizzes: null,
  myQuizzesIds: [],
  isLoading: false,
  isAllLoaded: false,
  isMyIdsLoaded: false,
  isMyQuizzesLoaded: false,
  errorLoading: ""
}

const quizzesStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  loadAllQuizzes: async () => {
    try {
      set(() => ({isLoading: true}));
      set(() => ({errorLoading: ""}));
      const quizzes: IQuizzes = await QuizStorageManager.fetchAllQuizzes();
      // const quizzesPublic = quizzes.filter(quiz => quiz.access !== "private");
      set(() => ({allQuizzes: quizzes}));
      set(() => ({isAllLoaded: true}));
    } catch (error) {
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  loadUserIds: async (userUid) => {
    try {
      set(() => ({isLoading: true}));
      set(() => ({errorLoading: ""}));
      const quizzesIds = await QuizStorageManager.fetchUserQuizIds(userUid);
      set(() => ({myQuizzesIds: quizzesIds, isMyIdsLoaded: true}));
    } catch (error) {
      // set(() => ({myQuizzes: []}));
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  loadUserQuizzes: async (userUid) => {
    const userQuizzesIds = get().myQuizzesIds;
    const isMyIdsLoaded = get().isMyIdsLoaded;
    if (!isMyIdsLoaded) {
      return;
    }
    try {
      set(() => ({isLoading: true, errorLoading: ""}));
      const userQuizzes = await QuizStorageManager.fetchUserQuizzes(userUid, userQuizzesIds);

      set(() => ({allQuizzes: userQuizzes, isMyQuizzesLoaded: true}));
    } catch (error) {
      // set(() => ({myQuizzes: []}));
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  saveUserQuiz: async (quiz: IQuizMeta, userUid: string) => {
    const quizIdsListPrev: string[] = get().myQuizzesIds;
    const allTestListPrev: IQuizzes | null = get().allQuizzes;
    const questions = quiz.questions ? quiz.questions : [];
    delete (quiz.questions);

    if (quizIdsListPrev) {
      const quizIdsListNext = [quiz.testId, ...quizIdsListPrev];
      set(() => ({myQuizzesIds: quizIdsListNext}));
    }

    let allTestListNext: IQuizzes;
    if (allTestListPrev) {
      allTestListNext = {quiz, ...allTestListPrev};
    } else {
      allTestListNext = {quiz}
    }
    set(() => ({allQuizzes: allTestListNext}));
    try {
      await QuizStorageManager.saveQuizToFirebase(quiz, questions, userUid);
      // set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({myQuizzesIds: quizIdsListPrev}));
      if (allTestListPrev) {
        set(() => ({allQuizzes: allTestListPrev}));
      }
      set(() => ({errorLoading: "Ошибка сохранения теста!"}));
    }
  },

  deleteUserQuiz: async (testId: string, userUid: string) => {
    const quizIdsListPrev = get().myQuizzesIds;
    const allTestListPrev = get().allQuizzes;
    if (quizIdsListPrev) {
      const quizIdsNew = quizIdsListPrev.filter(quizId => quizId !== testId);
      set(() => ({myQuizzesIds: quizIdsNew}));
    }
    if (allTestListPrev) {
      const allTestListNext = {...allTestListPrev};
      delete (allTestListNext[testId]);
      set(() => ({allQuizzes: allTestListNext}));
    }
    try {
      await QuizStorageManager.removeUserQuiz(testId, userUid);
      set(() => ({errorLoading: ""}));
    } catch (error) {
      set(() => ({errorLoading: "Ошибка удаления!"}));
      if (quizIdsListPrev) {
        set(() => ({myQuizzesIds: quizIdsListPrev}));
      }
      if (allTestListPrev) {
        set(() => ({allQuizzes: allTestListPrev}));
      }
    }
    // console.log(testListPrev.length);
    // if (!quizIdsListPrev) {
    //   return;
    // }
    // const testListNext = testListPrev.filter((quiz: IQuizMeta) => quiz.testId !== testId);
    // set(() => ({myQuizzes: testListNext}));
    //
    // let allTestListNext: IQuizMeta[];
    // if (allTestListPrev) {
    //   allTestListNext = allTestListPrev.filter((quiz: IQuizMeta) => quiz.testId !== testId);
    //   set(() => ({allQuizzes: allTestListNext}));
    // }
    // try {
    //   await QuizStorageManager.removeUserQuiz(testId, userUid);
    //   // set(() => ({errorLoading: ""}));
    // } catch (error) {
    //   set(() => ({myQuizzes: testListPrev}));
    //   if (allTestListPrev) {
    //     set(() => ({allQuizzes: allTestListPrev}));
    //   }
    //   set(() => ({errorLoading: "Ошибка удаления!"}));
    // }
  },

  updateQuiz: (quiz: IQuizMeta) => {
    const testList = get().allQuizzes;
    if (testList) {
      testList[quiz.testId] = quiz;
      set(() => ({allQuizzes: testList}));
    }
  }
})

const useQuizzesStore = create<IQuizzesState>()(quizzesStore);

export const useAllQuizzes = () => useQuizzesStore((state) => state.allQuizzes);
export const useMyQuizzesIds = () => useQuizzesStore((state) => state.myQuizzesIds);
export const useIsLoading = () => useQuizzesStore((state) => state.isLoading);
export const useIsAllLoaded = () => useQuizzesStore((state) => state.isAllLoaded);
export const useIsMyIdsLoaded = () => useQuizzesStore((state) => state.isMyIdsLoaded);
export const useIsMyQuizzesLoaded = () => useQuizzesStore((state) => state.isMyQuizzesLoaded);
export const useErrorLoading = () => useQuizzesStore((state) => state.errorLoading);
export const loadAllQuizzes = () => useQuizzesStore.getState().loadAllQuizzes();
export const loadUserIds = (userUid: string) =>
  useQuizzesStore.getState().loadUserIds(userUid);
export const loadUserQuizzes = (userUid: string) =>
  useQuizzesStore.getState().loadUserQuizzes(userUid);
export const saveUserQuiz = (quiz: IQuizMeta, userUid: string) =>
  useQuizzesStore.getState().saveUserQuiz(quiz, userUid);
export const deleteUserQuiz = (testId: string, userUid: string) =>
  useQuizzesStore.getState().deleteUserQuiz(testId, userUid);
export const updateQuiz = (quiz: IQuizMeta,) =>
  useQuizzesStore.getState().updateQuiz(quiz);
