import { User } from "@/types/user";
import { create } from "zustand";

type Store = {
  user?: User;
  setUser: (user?: User) => void;
};

export const useUserStore = create<Store>()((set) => ({
  setUser: (user?: User) => {
    set(() => ({ user }));
  },
}));
