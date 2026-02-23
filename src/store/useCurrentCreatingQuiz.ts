import { create, type StateCreator } from "zustand";
import type { IQuizMeta } from "../types/Quiz";

interface IInitialState {
  currentQuizDraft: IQuizMeta | null,
  currentQuizComplete: IQuizMeta | null
}

interface IActions {
  setQuizDraft: (draft: IQuizMeta) => void,
  setQuizComplete: (draft: IQuizMeta) => void,
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

export const useSetQuizDraft = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizDraft(quiz);
export const useSetQuizComplete = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizComplete(quiz);
export const useClearCurrentQuiz = () => useCurrentQuizStore.getState().clearCurrentQuiz();
