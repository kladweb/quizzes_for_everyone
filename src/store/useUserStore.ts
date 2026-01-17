import {create, type StateCreator} from "zustand";
import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import {auth} from "../firebase/firebase";

interface IUser {
  uid: string;
  email: string | null;
}

interface IInitialState {
  user: IUser | null;
}

interface IActions {
  setUser: (user: IUser | null) => void;
  initUser: () => void;
  loginGoogle: () => void;
  logoutGoogle: () => void;
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
  },
  initUser: () => {
    onAuthStateChanged(auth, (getUser) => {
      if (getUser) {
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        set(() => ({user: user}));
      }
    });
  },
  loginGoogle: () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const getUser = auth.currentUser as IUser;
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        return user.uid;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  logoutGoogle: () => {
    signOut(auth).then(() => {
      console.log('Sign-out successful', auth.currentUser);
      setUser(null);
    }).catch((error) => {
      console.log('Sign-out error', error);
    });
  }
})

const useUserStore = create<IUserState>()(userStore);
export const useUser = () => useUserStore((state => state.user));
export const setUser = (user: IUser | null) => useUserStore.getState().setUser(user);
export const initUser = () => useUserStore.getState().initUser();
export const loginGoogle = () => useUserStore.getState().loginGoogle();
export const logoutGoogle = () => useUserStore.getState().logoutGoogle();


