import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/translations/en";
import my from "@/translations/my";
import th from "@/translations/th";
import zh from "@/translations/zh";

const resources = {
  en,
  th,
  my,
  zh,
};

export type TSupportedLanguages = keyof typeof resources;
export const SupportedLanguages = Object.keys(
  resources
) as (keyof typeof resources)[];

const storedLang = localStorage.getItem(
  "i18nextLng"
) as TSupportedLanguages | null;

i18n.use(initReactI18next).init({
  resources,
  lng:
    storedLang && SupportedLanguages.includes(storedLang) ? storedLang : "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
