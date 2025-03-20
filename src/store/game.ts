import { Game } from "@/types/game";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  games: Game[];
  lastAddedCount: number;
  loading: boolean;
  error: Error | null;

  setGames: (games: Game[]) => void;
  addGames: (newGames: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error) => void;
};

export const useGameStore = create<Store>()(
  // persist(
  (set) => ({
    games: [],
    loading: false,
    error: null,
    lastAddedCount: 0,

    setGames: (games: Game[]) => set((state) => ({ ...state, games })),

    addGames: (newGames: Game[]) =>
      set((state) => {
        const existingGames = new Map(
          state.games.map((item) => [item.id, item])
        );
        const initialSize = existingGames.size;

        newGames.forEach((game) => existingGames.set(game.id, game));

        const addedCount = existingGames.size - initialSize;

        return {
          ...state,
          games: Array.from(existingGames.values()),
          lastAddedCount:
            state.lastAddedCount < 15
              ? state.lastAddedCount + addedCount
              : addedCount,
        };
      }),

    setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),

    setError: (error: Error) => set((state) => ({ ...state, error })),
  })
  //   {
  //     name: "game-storage",
  //     storage: createJSONStorage(() => sessionStorage),
  //   }
  // )
);
