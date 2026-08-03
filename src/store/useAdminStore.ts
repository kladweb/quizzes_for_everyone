import { create, type StateCreator } from "zustand";
import { getUsers } from "../api/adminActions";
import { type IQuizzes, UsersAdminMap } from "../types/Quiz";
import { getUsersExtraInfo, IUsersExtraInfo } from "../utils/adminUtilites";

interface IInitialAdminState {
  users: UsersAdminMap | null,
  usersExtraInfo: IUsersExtraInfo | null,
  isLoadingUsers: boolean,
  quizzes: IQuizzes | null,
  isLoadingQuizzes: boolean,
}

interface IAdminActions {
  loadUsers: () => Promise<void>;
}

const initialState: IInitialAdminState = {
  users: null,
  usersExtraInfo: null,
  isLoadingUsers: false,
  quizzes: null,
  isLoadingQuizzes: false,
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
    const users = await getUsers();
    const usersExtraInfo = getUsersExtraInfo(users);
    set({users, usersExtraInfo, isLoadingUsers: false});
  },
});

const useAdminStore = create<IAdminState>()(adminStore);

export const useUsers = () => useAdminStore((state) => state.users);
export const useIsLoadingUsers = () => useAdminStore((state) => state.isLoadingUsers);
export const useUsersExtraInfo = () => useAdminStore((state) => state.usersExtraInfo);


export const loadUsers = (): Promise<void> => useAdminStore.getState().loadUsers();
