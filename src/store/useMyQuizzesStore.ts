import {create, type StateCreator} from "zustand";
import type {Quiz} from "../types/Quiz";

interface IInitialState {
  myQuizzes: Quiz[]
}

interface IActions {
  deleteQuiz: () => void;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  myQuizzes: [],
}

const myQuizzesStore: StateCreator<IQuizzesState> = (set) => ({
  ...initialState,
  deleteQuiz: () => set((state) => ({myQuizzes: state.myQuizzes}))
})

export const useMyQuizzesStore = create<IQuizzesState>()(myQuizzesStore);