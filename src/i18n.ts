import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/translations/en";
import my from "@/translations/my";
import th from "@/translations/th";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en,
  th,
  my,
};

export type TSupportedLanguages = keyof typeof resources;
export const SupportedLanguages = Object.keys(
  resources
) as (keyof typeof resources)[]; // I turn object keys to an array

const storedLang = localStorage.getItem(
  "i18nextLng"
) as TSupportedLanguages | null;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng:
      storedLang && SupportedLanguages.includes(storedLang) ? storedLang : "en", // Use stored language or default to 'en'
    fallbackLng: "en", // Add fallback language
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
