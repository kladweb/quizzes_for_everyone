import { create, type StateCreator } from "zustand";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { nanoid } from "nanoid";
import { setUserAuthDate } from "../api/userDatesApi";

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type IUserRole = "user" | "admin" | null;

interface IInitialState {
  user: IUser | null;
  role: IUserRole;
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
  role: null,
  isAuthLoading: true,
  isAuthLoaded: false,
  guestUserId: null
}

async function getUserRole(): Promise<IUserRole> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    return "user";
  }
  const response = await fetch("/.netlify/functions/get-user-role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get user role");
  }
  const {role} = await response.json();
  return role;
}

const userStore: StateCreator<IUserState> = (set) => ({
  ...initialState,
  initUser: () => {
    console.log("ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ");
    set(() => ({isAuthLoading: true}));
    onAuthStateChanged(auth, async (getUser) => {
      if (getUser) {
        const user: IUser = {
          uid: getUser.uid,
          email: getUser.email,
          displayName: getUser.displayName,
        };
        let role: IUserRole = "user";
        try {
          role = await getUserRole();
        } catch (e) {
          console.error(e);
        }
        set(() => ({user, role}));
        await setUserAuthDate(user.uid);
      }
      set(() => ({isAuthLoading: false, isAuthLoaded: true}));
    });
    let guestId = localStorage.getItem('guestUserId');
    if (!guestId) {
      guestId = 'userLS' + nanoid(10);
    }
    localStorage.setItem('guestUserId', guestId);
    set(() => ({guestUserId: guestId, isAuthLoading: false}));
  },
  loginGoogle: () => {
    console.log("АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ");
    set(() => ({isAuthLoading: true}));
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        set(() => ({isAuthLoaded: true, isAuthLoading: false}));
      });
  },
  logoutGoogle: () => {
    signOut(auth).then(() => {
      console.log('Sign-out successful', auth.currentUser);
      set(() => ({user: null}));
    }).catch((error) => {
      console.log('Sign-out error', error);
    }).finally(() => {
      set(() => ({isAuthLoading: false}));
    });
  }
})

const useUserStore = create<IUserState>()(userStore);
export const useUser = () => useUserStore((state => state.user));
export const useIsAuthLoading = () => useUserStore((state => state.isAuthLoading));
export const useIsAuthLoaded = () => useUserStore((state => state.isAuthLoaded));
export const useGuestUserId = () => useUserStore((state) => state.guestUserId);
export const useRole = () => useUserStore((state) => state.role);
export const initUser = () => useUserStore.getState().initUser();
export const loginGoogle = () => useUserStore.getState().loginGoogle();
export const logoutGoogle = () => useUserStore.getState().logoutGoogle();
