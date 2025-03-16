import { create } from "zustand";

type Store = {
  token?: string;
  setToken: (token?: string) => void;
};

export const useTokenStore = create<Store>()((set) => ({
  setToken: (token?: string) => {
    set(() => ({ token }));
  },
}));
