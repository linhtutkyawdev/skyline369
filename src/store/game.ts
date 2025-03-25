import { Game } from "@/types/game";
import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  games: Game[];
  lastAddedGames: Game[];

  setGames: (games: Game[]) => void;
  addGames: (newGames: Game[]) => void;
};

export const useGameStore = create<Store>()(
  // persist(
  (set) => ({
    games: [],
    lastAddedGames: [],

    setGames: (games: Game[]) => set((state) => ({ ...state, games })),

    addGames: (games: Game[]) =>
      set((state) => {
        const gamesMap = new Map(state.games.map((item) => [item.id, item]));

        const newGames = games.filter((item) => !gamesMap.has(item.id));

        newGames.map((item) => {
          gamesMap.set(item.id, item);
        });

        return {
          ...state,
          games: Array.from(gamesMap.values()),
          lastAddedGames: newGames,
        };
      }),
  })
  //   {
  //     name: "game-storage",
  //     storage: createJSONStorage(() => sessionStorage),
  //   }
  // )
);
