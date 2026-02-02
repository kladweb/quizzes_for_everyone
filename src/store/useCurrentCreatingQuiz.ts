import { create, type StateCreator } from "zustand";
import { QuizStorageManager } from "../utils/QuizStorageManager";
import type { Quiz } from "../types/Quiz";

interface IInitialState {
  currentQuizDraft: Quiz | null,
  currentQuizComplete: Quiz | null
}

interface IActions {
  setQuizDraft: (draft: Quiz) => void,
  setQuizComplete: (draft: Quiz) => void,
  clearCurrentQuiz: () => void,
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  currentQuizDraft: null,
  currentQuizComplete: null,
}

const currentQuizStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  setQuizDraft: (quiz) => {
    set(() => ({currentQuizDraft: quiz}));
    set(() => ({currentQuizComplete: null}));
  },
  setQuizComplete: (quiz) => {
    set(() => ({currentQuizComplete: quiz}));
    set(() => ({currentQuizDraft: null}));
  },
  clearCurrentQuiz: () => {
    set(() => ({currentQuizComplete: null}));
    set(() => ({currentQuizDraft: null}));
  }
});

const useCurrentQuizStore = create<IQuizzesState>()(currentQuizStore);

export const useQuizDraft = () => useCurrentQuizStore((state) => state.currentQuizDraft);
export const useQuizComplete = () => useCurrentQuizStore((state) => state.currentQuizComplete);

export const useSetQuizDraft = (quiz: Quiz) => useCurrentQuizStore.getState().setQuizDraft(quiz);
export const useSetQuizComplete = (quiz: Quiz) => useCurrentQuizStore.getState().setQuizComplete(quiz);
export const useClearCurrentQuiz = () => useCurrentQuizStore.getState().clearCurrentQuiz();
