import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useToastStore } from "./toast";

type Store = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => {
        if (user) {
          // Generate a new session ID and update both session and local storage
          const sessionId = Date.now().toString();
          sessionStorage.setItem("session-id", sessionId);
          localStorage.setItem("session-lock", sessionId);
        } else {
          // Clear session IDs on logout
          sessionStorage.removeItem("session-id");
          localStorage.removeItem("session-lock");
        }
        set({ user });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if the session ID matches
        const localStorageSessionId = localStorage.getItem("session-lock");
        const sessionStorageSessionId = sessionStorage.getItem("session-id");

        if (localStorageSessionId !== sessionStorageSessionId) {
          const toastState = useToastStore.getState();
          toastState.setState({
            toasts: [
              ...toastState.state.toasts,
              {
                id: "1000",
                title: "Already have a session oppened!",
                description:
                  "You can not login to two seession simultaneously! Please close other tabs if you have multiple tabs oppened.",
                variant: "destructive",
              },
            ],
          });
          state.setUser(null);
        }
      },
    }
  )
);

// Listen for changes to the session-lock in other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "session-lock") {
      const newSessionId = localStorage.getItem("session-lock");
      const currentSessionId = sessionStorage.getItem("session-id");

      if (newSessionId !== currentSessionId) {
        const toastState = useToastStore.getState();
        toastState.setState({
          toasts: [
            ...toastState.state.toasts,
            {
              id: "1000",
              title: "You have been logout!",
              description:
                "You can not login to two seession simultaneously! Please close other tabs if you have multiple tabs oppened.",
              variant: "destructive",
            },
          ],
        });
        useUserStore.getState().setUser(null);
      }
    }
  });
}
