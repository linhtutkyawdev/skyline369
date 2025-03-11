import { Language } from "@/types/language";
import i18next from "i18next";
import { create } from "zustand";

type Store = {
  config: {
    lang: Language;
  };

  setLang: (lang: Language) => void;
};

export const useConfig = create<Store>()((set) => ({
  config: { lang: "en" },

  setLang: (lang: Language) => {
    i18next.changeLanguage(lang);
    set((state) => ({ config: { ...state.config, lang } }));
  },
}));
