import {create, type StateCreator} from "zustand";
import {child, get, ref, set} from "firebase/database";
import type {Quiz} from "../types/Quiz";
import {database} from "../firebase/firebase";

interface IInitialState {
  myQuizzes: Quiz[],
  isLoading: boolean,
}

interface IActions {
  getQuizzes: (userUid: string) => void;
  deleteQuiz: () => void;
}

interface IQuizzesState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  myQuizzes: [],
  isLoading: false
}

const myQuizzesStore: StateCreator<IQuizzesState> = (set) => ({
  ...initialState,
  getQuizzes: (userUid) => {
    set({isLoading: true});
    const dbRef = ref(database);
    try {
      const snapshot = get(child(dbRef, `users/${userUid}`));
      console.log(snapshot);
    } catch (error) {

    }
  },
  deleteQuiz: () => set((state) => ({myQuizzes: state.myQuizzes}))
})

const useMyQuizzesStore = create<IQuizzesState>()(myQuizzesStore);

export const getQuizzes = () => useMyQuizzesStore().getQuizzes;