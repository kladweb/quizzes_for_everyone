import { create, type StateCreator } from "zustand";
import { nanoid } from "nanoid";
import type { Toast, ToastType } from "../types/Quiz";

interface IInitialState {
  toasts: Toast[],
}

interface IActions {
  showToast: (message: string, type: ToastType) => void,
}

interface INoticeState extends IInitialState, IActions {
}

const initialState: IInitialState = {
  toasts: [],
}

const noticeStore: StateCreator<INoticeState> = (set, get) => ({
  ...initialState,
  showToast: (message: string, type: ToastType) => {
    const toastsOld: Toast[] = get().toasts;
    const toast: Toast = {
      id: "msg" + nanoid(5),
      message: message,
      type: type
    }
    if ((toastsOld.length === 0) || toastsOld[toastsOld.length - 1].message !== message) {
      set(() => ({toasts: [...toastsOld, toast]}));
      setTimeout(() => {
        const toasts: Toast[] = get().toasts;
        toasts.shift();
        set(() => ({toasts: [...toasts]}));
      }, 3500);
    }
  },
});

const useNoticeStore = create<INoticeState>()(noticeStore);

export const useNotice = () => useNoticeStore((state) => state.toasts);
export const showToast = (message: string, type: ToastType) => useNoticeStore.getState().showToast(message, type);
