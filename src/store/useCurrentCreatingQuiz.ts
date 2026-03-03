import { create, type StateCreator } from "zustand";
import type { IQuizMeta } from "../types/Quiz";

export type ValidateFieldType = {
  title: boolean,
  category: boolean,
}

type FieldType = "title" | "category";

interface IInitialState {
  currentQuizDraft: IQuizMeta | null,
  currentQuizComplete: IQuizMeta | null,
  isValidate: ValidateFieldType
}

interface IActions {
  setQuizDraft: (draft: IQuizMeta) => void,
  setQuizComplete: (draft: IQuizMeta) => void,
  clearCurrentQuiz: () => void,
  setIsValidate: (field: FieldType, isCurrValidate: boolean) => void,
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  currentQuizDraft: null,
  currentQuizComplete: null,
  isValidate: {
    title: true,
    category: true,
  }
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
  },
  setIsValidate: (field: FieldType, isCurrValidate: boolean) => {
    set((prev) => ({isValidate: {...prev.isValidate, [field]: isCurrValidate}}))
  }
});

const useCurrentQuizStore = create<IQuizzesState>()(currentQuizStore);

export const useQuizDraft = () => useCurrentQuizStore((state) => state.currentQuizDraft);
export const useQuizComplete = () => useCurrentQuizStore((state) => state.currentQuizComplete);
export const useIsValidate = () => useCurrentQuizStore((state) => state.isValidate);

export const setQuizDraft = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizDraft(quiz);
export const setQuizComplete = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizComplete(quiz);
export const clearCurrentQuiz = () => useCurrentQuizStore.getState().clearCurrentQuiz();
export const setIsValidate = (field: FieldType, isCurrValidate: boolean) => useCurrentQuizStore.getState().setIsValidate(field, isCurrValidate);
