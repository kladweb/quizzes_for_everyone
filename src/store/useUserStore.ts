import {create, type StateCreator} from "zustand";

interface IUser {
  uid: string;
  email: string | null;
}

interface IInitialState {
  user: IUser | null;
}

interface IActions {
  setUser: (user: IUser | null) => void;
  // loadUserQuizzes: (userUid: string) => void;
  // saveUserQuiz: (quiz: Quiz, userUid: string) => Promise<void>;
  // deleteUserQuiz: (testId: string, userUid: string) => Promise<void>;
}

interface IUserState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  user: null
}

const userStore: StateCreator<IUserState> = (set) => ({
  ...initialState,
  setUser: (user: IUser | null) => {
    set(() => ({user: user}));
  }
})

const useUserStore = create<IUserState>()(userStore);
export const useUser = () => useUserStore((state => state.user));
export const setUser = (user: IUser | null) => useUserStore.getState().setUser(user);


