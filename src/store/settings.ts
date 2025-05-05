import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  soundEnabled: boolean; // For sound effects
  backgroundMusicEnabled: boolean; // Toggle for background music
  volume: number; // For background music volume (0-100)
  notificationsEnabled: boolean;
  // Add darkMode later if needed
  // darkMode: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  // setDarkMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true, // Default value for sound effects
      backgroundMusicEnabled: true, // Default value for background music toggle
      volume: 50, // Default value for background music volume (50%)
      notificationsEnabled: true, // Default value
      // darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false, // Default to system preference or false
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setBackgroundMusicEnabled: (enabled) =>
        set({ backgroundMusicEnabled: enabled }),
      setVolume: (volume) => set({ volume: volume }),
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
