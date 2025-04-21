import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useToastStore } from "./toast";
import axiosInstance from "@/lib/axiosInstance"; // Import axios instance
import { ApiResponse } from "@/types/api_response"; // Import ApiResponse type
import { ApiError } from "@/types/api_error"; // Import ApiError type
import { UserInfo } from "@/types/user"; // Import UserInfo type
import { useStateStore } from "./state"; // Import state store for loading/error

type Store = {
  user: User | null;
  lastUpdatedAt: number | null; // Add last updated timestamp
  setUser: (user: User | null) => void;
  loadUserInfo: () => Promise<void>; // Add loadUserInfo type
  transferBalance: (amount: number) => Promise<void>; // Add transferBalance type
};

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      lastUpdatedAt: null, // Initialize last updated timestamp
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
        set({ user, lastUpdatedAt: user ? Date.now() : null }); // Update timestamp
      },

      // --- Moved from App.tsx ---
      transferBalance: async (amount: number) => {
        const user = get().user;
        const { setLoading, setError } = useStateStore.getState(); // Get state setters from useStateStore
        const { setUser } = get(); // Get setUser from the current store (useUserStore)
        const toastState = useToastStore.getState();

        if (!user) return;
        setLoading(true);
        try {
          const responses = await axiosInstance.post<
            ApiResponse<{ balance: string; game_balance: string }>
          >("/transfer_to_game", {
            token: user.token,
            amount,
          });

          if (
            responses.data.status.errorCode != 0 &&
            responses.data.status.errorCode != 200
          )
            throw new ApiError(
              "Transfer failed!", // More specific message
              responses.data.status.errorCode,
              responses.data.status.mess
            );
          // No need to update user here, loadUserInfo will fetch the final state
          toastState.setState({
            toasts: [
              ...toastState.state.toasts,
              {
                id: Date.now().toString(),
                title: "Transfer Successful",
                description: `Successfully transferred ${amount}.`,
              },
            ],
          });
        } catch (error) {
          console.error("Transfer balance error:", error);
          let errorMsg = "Transfer failed.";
          if (error instanceof ApiError) {
            errorMsg = error.message;
            if (error.statusCode === 401) {
              setUser(null); // Use setUser from useUserStore
              setError(error); // Use setError from useStateStore
            }
          }
          toastState.setState({
            toasts: [
              ...toastState.state.toasts,
              {
                id: Date.now().toString(),
                title: "Transfer Failed",
                description: errorMsg,
                variant: "destructive",
              },
            ],
          });
        } finally {
          setLoading(false);
        }
      },

      loadUserInfo: async () => {
        const user = get().user;
        const { setLoading, setError } = useStateStore.getState(); // Get state setters directly
        const { transferBalance } = get(); // Get transferBalance from the store itself
        const toastState = useToastStore.getState();

        if (!user || !user.token) return; // Check token existence
        setLoading(true);
        try {
          const responses = await axiosInstance.post<ApiResponse<UserInfo>>(
            "/player_info",
            {
              token: user.token,
            }
          );

          if (
            responses.data.status.errorCode != 0 &&
            responses.data.status.errorCode != 200
          )
            throw new ApiError(
              "Failed to load user info!",
              responses.data.status.errorCode,
              responses.data.status.mess
            );

          const userInfo = responses.data.data;
          let finalUser = { ...user, userInfo }; // Start with current user and new info

          if (userInfo && userInfo.balance > 0) {
            // Call transferBalance from the store
            await transferBalance(userInfo.balance);
            // Re-fetch user state after potential transferBalance update
            const potentiallyUpdatedUser = get().user;
            if (potentiallyUpdatedUser) {
              // Update user state with zero balance and adjusted game_balance
              finalUser = {
                ...potentiallyUpdatedUser, // Use potentially updated user state
                balance: 0,
                userInfo: {
                  ...userInfo,
                  balance: 0, // Set main balance to 0 after transfer
                  game_balance:
                    parseFloat(userInfo.game_balance + "") +
                    parseFloat(userInfo.balance + ""), // Add transferred amount to game balance
                },
              };
            } else {
              // Handle case where user logged out during transfer
              return;
            }
          } else {
            // If no transfer needed, just update balance and userInfo
            finalUser = {
              ...user,
              balance: userInfo.balance,
              userInfo: userInfo,
            };
          }

          set({ user: finalUser, lastUpdatedAt: Date.now() }); // Update user state and timestamp

          // Optional: Add success toast
          // toastState.setState({ toasts: [...toastState.state.toasts, {
          //   id: Date.now().toString(),
          //   title: "User Info Updated",
          // }]});
        } catch (error) {
          console.error("Load user info error:", error);
          let errorMsg = "Failed to load user info.";
          if (error instanceof ApiError) {
            errorMsg = error.message;
            if (error.statusCode === 401) {
              set({ user: null, lastUpdatedAt: null }); // Clear user on 401
              setError(error);
            }
          }
          toastState.setState({
            toasts: [
              ...toastState.state.toasts,
              {
                id: Date.now().toString(),
                title: "Update Failed",
                description: errorMsg,
                variant: "destructive",
              },
            ],
          });
        } finally {
          setLoading(false);
        }
      },
      // --- End of moved code ---
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
