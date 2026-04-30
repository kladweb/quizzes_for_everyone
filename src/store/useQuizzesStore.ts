import { create, type StateCreator } from "zustand";
import { QuizStorageManager } from "../utils/QuizStorageManager";
import { IQuizMeta, IQuizzes } from "../types/Quiz";

interface IInitialState {
  allQuizzes: IQuizzes | null;
  myQuizzesIds: string[],
  isLoading: boolean,
  isLoadingAllMore: boolean,
  isAllLoaded: boolean,
  isMyIdsLoaded: boolean,
  isMyQuizzesLoaded: boolean,
  errorLoading: string,
  allQuizzesNextCursor: number | null,
}

interface IActions {
  loadAllQuizzes: () => void;
  loadMoreAllQuizzes: () => void;
  loadUserIds: (userUid: string) => void;
  loadUserQuizzes: (userUid: string) => void;
  saveUserQuiz: (quiz: IQuizMeta, userUid: string) => Promise<void>;
  deleteUserQuiz: (testId: string, userUid: string) => Promise<void>;
  updateQuiz: (quiz: IQuizMeta) => void;
  setIsLoading: (isLoading: boolean) => void;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  allQuizzes: null,
  myQuizzesIds: [],
  isLoading: false,
  isLoadingAllMore: false,
  isAllLoaded: false,
  isMyIdsLoaded: false,
  isMyQuizzesLoaded: false,
  errorLoading: "",
  allQuizzesNextCursor: null,
}

const quizzesStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  loadAllQuizzes: async () => {
    // if (get().allQuizzesNextCursor !== null || get().isAllLoaded) {
    //   return;
    // }
    if (get().isAllLoaded) {
      return;
    }
    try {
      set(() => ({isLoading: true}));
      set(() => ({errorLoading: ""}));
      const page = await QuizStorageManager.fetchPublicQuizzesPage(10);
      set((state) => ({
        allQuizzes: {
          ...(state.allQuizzes ?? {}),
          ...page.quizzes,
        },
        isAllLoaded: !page.hasMore,
        allQuizzesNextCursor: page.nextCursor,
      }));
    } catch (error) {
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoading: false}));
    }
  },
  loadMoreAllQuizzes: async () => {
    const allQuizzes = get().allQuizzes;
    const isLoading = get().isLoading;
    const isLoadingAllMore = get().isLoadingAllMore;
    const isAllLoaded = get().isAllLoaded;
    const cursor = get().allQuizzesNextCursor;

    if (isLoading || isLoadingAllMore || isAllLoaded || cursor === null) {
      return;
    }

    try {
      set(() => ({isLoadingAllMore: true, errorLoading: ""}));
      const page = await QuizStorageManager.fetchPublicQuizzesPage(10, cursor);
      const prevCount = Object.keys(allQuizzes ?? {}).length;
      const mergedQuizzes: IQuizzes = {
        ...(allQuizzes ?? {}),
        ...page.quizzes,
      };

      const newCount = Object.keys(mergedQuizzes).length;
      const nothingAdded = newCount === prevCount;

      set(() => ({
        allQuizzes: mergedQuizzes,
        isAllLoaded: !page.hasMore,
        allQuizzesNextCursor: page.nextCursor,
      }));

      if (nothingAdded && page.hasMore) {
        // форсим следующую загрузку
        get().loadMoreAllQuizzes();
      }

    } catch (error) {
      console.log(error);
      set(() => ({errorLoading: "Ошибка загрузки данных!"}));
    } finally {
      set(() => ({isLoadingAllMore: false}));
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
      set(() => ({isMyQuizzesLoaded: true}));
      const userQuizzes = await QuizStorageManager.fetchUserQuizzes(userUid, userQuizzesIds);
      set((state) => ({allQuizzes: {...(state.allQuizzes ?? {}), ...userQuizzes}}));
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

    if (quizIdsListPrev && !quizIdsListPrev.includes(quiz.testId)) {
      const quizIdsListNext = [quiz.testId, ...quizIdsListPrev];
      set(() => ({myQuizzesIds: quizIdsListNext}));
    }

    let allTestListNext: IQuizzes;
    if (allTestListPrev) {
      allTestListNext = {...allTestListPrev, [quiz.testId]: quiz};
    } else {
      allTestListNext = {[quiz.testId]: quiz}
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
      console.log("Ошибка сохранения теста!");
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
  },
  setIsLoading: (isLoading: boolean) => {
    set(() => ({isLoading: isLoading}));
  }
})

const useQuizzesStore = create<IQuizzesState>()(quizzesStore);

export const useAllQuizzes = () => useQuizzesStore((state) => state.allQuizzes);
export const useMyQuizzesIds = () => useQuizzesStore((state) => state.myQuizzesIds);
export const useIsLoading = () => useQuizzesStore((state) => state.isLoading);
export const useIsLoadingAllMore = () => useQuizzesStore((state) => state.isLoadingAllMore);
export const useIsAllLoaded = () => useQuizzesStore((state) => state.isAllLoaded);
export const useIsMyIdsLoaded = () => useQuizzesStore((state) => state.isMyIdsLoaded);
export const useIsMyQuizzesLoaded = () => useQuizzesStore((state) => state.isMyQuizzesLoaded);
export const useErrorLoading = () => useQuizzesStore((state) => state.errorLoading);
export const loadAllQuizzes = () => useQuizzesStore.getState().loadAllQuizzes();
export const loadMoreAllQuizzes = () => useQuizzesStore.getState().loadMoreAllQuizzes();
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
export const setIsLoading = (isLoading: boolean,) =>
  useQuizzesStore.getState().setIsLoading(isLoading);
