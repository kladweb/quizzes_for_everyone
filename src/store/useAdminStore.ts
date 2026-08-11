import { create, type StateCreator } from "zustand";
import { getUsers } from "../api/adminActions";
import { UsersAdminMap } from "../types/Quiz";
import {
  getQuizzesAdminInfo, getQuizzesStatInfo,
  getUsersExtraInfo,
  IQuizzesAdminInfo,
  IUsersExtraInfo
} from "../utils/adminUtilites";
import { QuizStorageManager } from "../utils/QuizStorageManager";

interface IInitialAdminState {
  users: UsersAdminMap | null,
  usersExtraInfo: IUsersExtraInfo | null,
  isLoadingUsers: boolean,
  isLoadedUsers: boolean,
  quizzesAdminInfo: IQuizzesAdminInfo | null,
  isLoadingQuizzesInfo: boolean,
  isLoadedQuizzesInfo: boolean,
  quizzesStatInfo: any,
  isLoadingStatInfo: boolean,
  isLoadedStatInfo: boolean,
  loadError: boolean,
  // quizzes: IQuizzes | null,
  // isLoadingQuizzes: boolean,
}

interface IAdminActions {
  loadUsers: () => Promise<void>;
  loadQuizzesAdminInfo: () => Promise<void>;
  loadQuizzesStatInfo: () => Promise<void>;
}

const initialState: IInitialAdminState = {
  users: null,
  usersExtraInfo: null,
  isLoadingUsers: false,
  isLoadedUsers: false,

  quizzesAdminInfo: null,
  isLoadingQuizzesInfo: false,
  isLoadedQuizzesInfo: false,

  quizzesStatInfo: null,
  isLoadingStatInfo: false,
  isLoadedStatInfo: false,

  loadError: false,
}

interface IAdminState extends IInitialAdminState, IAdminActions {
}

const adminStore: StateCreator<IAdminState> = (set, get) => ({
  ...initialState,
  loadUsers: async () => {
    if (get().users) {
      return;
    }
    set({isLoadingUsers: true});
    try {
      const users = await getUsers();
      const usersExtraInfo = getUsersExtraInfo(users);
      set({users, usersExtraInfo, isLoadingUsers: false, isLoadedUsers: true, loadError: false});
    } catch {
      console.log("E R R")
      set({isLoadingUsers: false, loadError: true});
    }
  },
  loadQuizzesAdminInfo: async () => {
    if (get().quizzesAdminInfo) {
      return;
    }
    set({isLoadingQuizzesInfo: true});
    const quizzesAll = await QuizStorageManager.fetchAllQuizzes();
    const quizzesAdminInfo = getQuizzesAdminInfo(quizzesAll);
    set({quizzesAdminInfo, isLoadingQuizzesInfo: false, isLoadedQuizzesInfo: true, loadError: false});
  },
  loadQuizzesStatInfo: async () => {
    if (get().quizzesStatInfo) {
      return;
    }
    set({isLoadingStatInfo: true});
    const statisticsAll = await QuizStorageManager.fetchAllStatistics();
    const quizzesStatInfo = getQuizzesStatInfo(statisticsAll);
    set({quizzesStatInfo, isLoadingStatInfo: false, isLoadedStatInfo: true, loadError: false});
  },
});

const useAdminStore = create<IAdminState>()(adminStore);

export const useUsers = () => useAdminStore((state) => state.users);
export const useUsersExtraInfo = () => useAdminStore((state) => state.usersExtraInfo);
export const useIsLoadingUsers = () => useAdminStore((state) => state.isLoadingUsers);
export const useIsLoadedUsers = () => useAdminStore((state) => state.isLoadedUsers);

export const useQuizzesAdminInfo = () => useAdminStore((state) => state.quizzesAdminInfo);
export const useIsLoadingQuizzesInfo = () => useAdminStore((state) => state.isLoadingQuizzesInfo);
export const useIsLoadedQuizzesInfo = () => useAdminStore((state) => state.isLoadedQuizzesInfo);

export const useQuizzesStatInfo = () => useAdminStore((state) => state.quizzesStatInfo);
export const useIsLoadingStatInfo = () => useAdminStore((state) => state.isLoadingStatInfo);
export const useIsLoadedStatInfo = () => useAdminStore((state) => state.isLoadedStatInfo);

export const useAdminLoadError = () => useAdminStore((state) => state.loadError);

export const loadUsers = (): Promise<void> => useAdminStore.getState().loadUsers();
export const loadQuizzesAdminInfo = (): Promise<void> => useAdminStore.getState().loadQuizzesAdminInfo();
export const loadQuizzesStatInfo = (): Promise<void> => useAdminStore.getState().loadQuizzesStatInfo();
