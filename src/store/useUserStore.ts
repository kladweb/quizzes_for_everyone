import { create, type StateCreator } from "zustand";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { nanoid } from "nanoid";

interface IUser {
  uid: string;
  email: string | null;
}

interface IInitialState {
  user: IUser | null;
  isAuthLoading: boolean;
  isAuthLoaded: boolean;
  guestUserId: string | null;
}

interface IActions {
  initUser: () => void;
  loginGoogle: () => void;
  logoutGoogle: () => void;
}

interface IUserState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  user: null,
  isAuthLoading: true,
  isAuthLoaded: false,
  guestUserId: null
}

const userStore: StateCreator<IUserState> = (set) => ({
  ...initialState,
  initUser: () => {
    set(() => ({isAuthLoading: true}));
    onAuthStateChanged(auth, (getUser) => {
      if (getUser) {
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
        };
        set(() => ({user}));
      }
      set(() => ({isAuthLoading: false, isAuthLoaded: true}));
    });
    let guestId = localStorage.getItem('guestUserId');
    if (!guestId) {
      guestId = 'userLS' + nanoid(10);
    }
    localStorage.setItem('guestUserId', guestId);
    set(() => ({guestUserId: guestId}));
  },
  loginGoogle: () => {
    set(() => ({isAuthLoading: true}));
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
      })
      .finally(() => {
        set(() => ({isAuthLoaded: true}));
      });
  },
  logoutGoogle: () => {
    signOut(auth).then(() => {
      console.log('Sign-out successful', auth.currentUser);
      set(() => ({user: null, isAuthLoading: false}));
    }).catch((error) => {
      console.log('Sign-out error', error);
    });
  }
})

const useUserStore = create<IUserState>()(userStore);
export const useUser = () => useUserStore((state => state.user));
export const useIsAuthLoading = () => useUserStore((state => state.isAuthLoading));
export const useIsAuthLoaded = () => useUserStore((state => state.isAuthLoaded));
export const useGuestUserId = () => useUserStore((state) => state.guestUserId);
export const initUser = () => useUserStore.getState().initUser();
export const loginGoogle = () => useUserStore.getState().loginGoogle();
export const logoutGoogle = () => useUserStore.getState().logoutGoogle();
