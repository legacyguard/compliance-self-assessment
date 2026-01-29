export const locales = ["en", "sk", "cz"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sk: "Slovensky",
  cz: "Česky",
};
