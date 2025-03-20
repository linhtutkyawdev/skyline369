import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  user?: User;
  setUser: (user?: User) => void;
};

export const useUserStore = create<Store>()(
  persist(
    (set) => ({
      setUser: (user?: User) => {
        set(() => ({ user }));
      },
    }),
    {
      name: "user-storage",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
