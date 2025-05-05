import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  volume: number; // For background music volume (0-100), 0 means disabled
  // Add darkMode later if needed
  // darkMode: boolean;
  setVolume: (volume: number) => void;
  // setDarkMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 5, // Default value for background music volume (5), 0 means disabled
      // darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false, // Default to system preference or false
      setVolume: (volume) => set({ volume: volume }),
      // setDarkMode: (enabled) => set({ darkMode: enabled }),
    }),
    {
      name: "app-settings-storage", // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);
