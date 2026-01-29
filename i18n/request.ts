import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/common.json`)).default,
      ...(await import(`../messages/${locale}/landing.json`)).default,
      ...(await import(`../messages/${locale}/auth.json`)).default,
      ...(await import(`../messages/${locale}/assessment.json`)).default,
      ...(await import(`../messages/${locale}/dashboard.json`)).default,
    },
  };
});
