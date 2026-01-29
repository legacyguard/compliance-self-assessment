import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  // Validate and fallback to default locale
  const locale = requestedLocale && locales.includes(requestedLocale as Locale)
    ? requestedLocale
    : "en";

  // Load all message namespaces
  const [common, landing, auth, assessment, dashboard] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/landing.json`),
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/assessment.json`),
    import(`../messages/${locale}/dashboard.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      landing: landing.default,
      auth: auth.default,
      assessment: assessment.default,
      dashboard: dashboard.default,
    },
  };
});
