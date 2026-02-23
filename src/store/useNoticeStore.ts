import { create, type StateCreator } from "zustand";
import { nanoid } from "nanoid";

export type Toast = {
  id: string;
  message: string;
  type: "info" | "error";
}

interface IInitialState {
  toasts: Toast[],
}

interface IActions {
  showToastInfo: (message: string) => void,
  showToastError: (message: string) => void,
}

interface INoticeState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  toasts: [],
}

const noticeStore: StateCreator<INoticeState> = (set, get) => ({
  ...initialState,
  showToastInfo: (message: string) => {
    const toastsOld: Toast[] = get().toasts;
    const toast: Toast = {
      id: "msg" + nanoid(5),
      message: message,
      type: "info"
    }
    set(() => ({toasts: [...toastsOld, toast]}));
    setTimeout(() => {
      const toasts: Toast[] = get().toasts;
      toasts.shift();
      set(() => ({toasts: [...toasts]}));
    }, 2000);
  },
  showToastError: (message: string) => {
    const toastsOld: Toast[] = get().toasts;
    const toast: Toast = {
      id: "msg" + nanoid(5),
      message: message,
      type: "error"
    }
    set(() => ({toasts: [...toastsOld, toast]}));
    setTimeout(() => {
      const toasts: Toast[] = get().toasts;
      toasts.shift();
      set(() => ({toasts: [...toasts]}));
    }, 3500);
  },
});

const useNoticeStore = create<INoticeState>()(noticeStore);

export const useNotice = () => useNoticeStore((state) => state.toasts);
export const useShowToastInfo = (message: string) => useNoticeStore.getState().showToastInfo(message);
export const useShowToastError = (message: string) => useNoticeStore.getState().showToastError(message);
