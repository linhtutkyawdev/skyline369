import { State } from "@/hooks/use-toast";
import { create } from "zustand";

type Store = {
  state: State;
  setState: (state: State) => void;
};

export const useToastStore = create<Store>()((set, get) => ({
  state: { toasts: [] },
  setState: (state: State) =>
    set(() => ({
      state: state,
    })),
}));
