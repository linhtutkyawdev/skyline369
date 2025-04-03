import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  soundEnabled: boolean; // For sound effects
  musicEnabled: boolean; // For background music
  notificationsEnabled: boolean;
  // Add darkMode later if needed
  // darkMode: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  // setDarkMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true, // Default value for sound effects
      musicEnabled: true, // Default value for background music
      notificationsEnabled: true, // Default value
      // darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false, // Default to system preference or false
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }), // Add the missing setter
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      // setDarkMode: (enabled) => set({ darkMode: enabled }),
    }),
    {
      name: "app-settings-storage", // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);
