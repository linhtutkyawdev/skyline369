import { Game } from "@/types/game";
import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  games: Game[];
  lastAddedCount: number;

  setGames: (games: Game[]) => void;
  addGames: (newGames: Game[]) => void;
};

export const useGameStore = create<Store>()(
  // persist(
  (set) => ({
    games: [],
    lastAddedCount: 15,

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
  })
  //   {
  //     name: "game-storage",
  //     storage: createJSONStorage(() => sessionStorage),
  //   }
  // )
);
