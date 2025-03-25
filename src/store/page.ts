import { Page } from "@/types/page";
import { create } from "zustand";

type Store = {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  getPage: (gameType: string, productCode: string) => Page;
  setPage: (page: Page) => void;
};

export const usePageStore = create<Store>()((set, get) => ({
  pages: [],
  setPages: (pages: Page[]) => set((state) => ({ ...state, pages })),

  getPage: (gameType: string, productCode?: string) => {
    return get().pages.find(
      (page) =>
        page.gameType === gameType &&
        (!productCode || page.productCode === productCode)
    );
  },

  setPage: (page: Page) =>
    set((state) => ({
      pages: state.pages.map((eachPage) =>
        page.gameType === eachPage.gameType &&
        page.productCode === eachPage.productCode
          ? page
          : eachPage
      ),
    })),
}));
