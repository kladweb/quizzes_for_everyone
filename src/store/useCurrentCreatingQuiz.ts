import { create, type StateCreator } from "zustand";
import type { IQuizMeta } from "../types/Quiz";

type FieldType = "title" | "category";

interface IInitialState {
  currentQuizDraft: IQuizMeta | null,
  isQuizDraftLoaded: boolean,
  currentQuizComplete: IQuizMeta | null,
  formError: {
    [key: string]: boolean;
  }
}

interface IActions {
  setQuizDraft: (draft: IQuizMeta) => void,
  setQuizComplete: (draft: IQuizMeta) => void,
  clearCurrentQuiz: () => void,
  validateField: (name: string, value: string) => void,
  resetFormError: () => void,

  // setIsValidate: (field: FieldType, isCurrValidate: boolean) => void,
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  currentQuizDraft: null,
  isQuizDraftLoaded: false,
  currentQuizComplete: null,
  formError: {},
}

const currentQuizStore: StateCreator<IQuizzesState> = (set, get) => ({
  ...initialState,
  setQuizDraft: (quiz) => {
    set(() => ({currentQuizDraft: quiz, isQuizDraftLoaded: true}));
    set(() => ({currentQuizComplete: null}));
  },
  setQuizComplete: (quiz) => {
    set(() => ({currentQuizComplete: quiz}));
    set(() => ({currentQuizDraft: null, isQuizDraftLoaded: false}));
  },
  clearCurrentQuiz: () => {
    set(() => ({currentQuizComplete: null, isQuizDraftLoaded: false, currentQuizDraft: null}));
  },
  validateField: (name: string, value: string) => {
    if (!value) {
      set(prev => ({formError: {...prev.formError, [name]: true}}));
    } else {
      set(prev => ({formError: {...prev.formError, [name]: false}}));
    }
  },
  resetFormError: () => {
    set(() => ({formError: {}}));
  }
});

const useCurrentQuizStore = create<IQuizzesState>()(currentQuizStore);

export const useQuizDraft = () => useCurrentQuizStore((state) => state.currentQuizDraft);
export const useIsQuizDraftLoaded = () => useCurrentQuizStore((state) => state.isQuizDraftLoaded);
export const useQuizComplete = () => useCurrentQuizStore((state) => state.currentQuizComplete);
export const useFormError = () => useCurrentQuizStore((state) => state.formError);

export const setQuizDraft = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizDraft(quiz);
export const setQuizComplete = (quiz: IQuizMeta) => useCurrentQuizStore.getState().setQuizComplete(quiz);
export const clearCurrentQuiz = () => useCurrentQuizStore.getState().clearCurrentQuiz();
export const validateField = (name: string, value: string) => useCurrentQuizStore.getState().validateField(name, value);
export const resetFormError = () => useCurrentQuizStore.getState().resetFormError();
