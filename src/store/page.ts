import { Game } from "@/types/game";
import { create } from "zustand";

type Store = {
  data: {
    loading: boolean;
    games: Game[];
    page: number;
    hasMore: boolean;
    error: Error | null;
  };

  setLoading: (loading: boolean) => void;
  setGames: (games: Game[]) => void;
  addGames: (newGames: Game[]) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setError: (error: Error) => void;
};

export const useStore = create<Store>()((set) => ({
  data: {
    loading: false,
    games: [],
    page: 1,
    hasMore: true,
    error: null,
  },

  setLoading: (loading: boolean) =>
    set((state) => ({ data: { ...state.data, loading } })),

  setGames: (games: Game[]) =>
    set((state) => ({ data: { ...state.data, games } })),

  addGames: (newGames: Game[]) =>
    set((state) => ({
      data: {
        ...state.data,
        games: [...state.data.games, ...newGames],
      },
    })),

  setPage: (page: number) =>
    set((state) => ({ data: { ...state.data, page } })),

  setHasMore: (hasMore: boolean) =>
    set((state) => ({ data: { ...state.data, hasMore } })),

  setError: (error: Error) =>
    set((state) => ({ data: { ...state.data, error } })),
}));
