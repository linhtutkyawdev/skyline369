import { Modal } from "@/types/modal";
import { create } from "zustand";

type Store = {
  activeModal?: Modal;
  setActiveModal: (activeModal?: Modal) => void;
};

export const useModalStore = create<Store>()((set) => ({
  setActiveModal: (activeModal?: Modal) => {
    set(() => ({ activeModal }));
  },
}));
