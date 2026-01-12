import {create, type StateCreator} from "zustand";
import {child, get, ref, set} from "firebase/database";
import type {Quiz} from "../types/Quiz";
import {database} from "../firebase/firebase";

interface IInitialState {
  myQuizzes: Quiz[],
  isLoading: boolean,
}

interface IActions {
  loadUserQuizzes: (userUid: string) => void;
  deleteQuiz: (testId: string) => void;
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
    set({isLoading: true});
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `users/${userUid}`));
      if (snapshot.exists()) {
        const quizIds = JSON.parse(snapshot.val());
        let quizzes = await Promise.all(quizIds.map((id: string) =>
          (get(child(dbRef, `tests/${id}/test`)).then(s => s.val()))
        ));
        quizzes = quizzes.map(item => JSON.parse(item));
        if (quizzes) {
          quizzes.sort((a, b) => b.createdAt - a.createdAt);
          set({myQuizzes: quizzes});
        }
      } else {
        throw new Error('No such quiz found!');
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({isLoading: false});
    }
  },
  deleteQuiz: (testId: string) => {
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