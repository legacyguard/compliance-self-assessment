"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Shield, ExternalLink } from "lucide-react";

const MAIN_PLATFORM_URL = "https://kyberbezpecnost.cloud";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        {/* CTA Banner */}
        <div className="mb-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium text-lg">{t("footer_cta")}</p>
              <p className="text-sm text-muted-foreground">
                Get comprehensive compliance management, incident response, and
                continuous monitoring.
              </p>
            </div>
            <Link
              href={MAIN_PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t("footer_cta_link")}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">{t("app_name")}</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t("footer_copyright")}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href={`/${locale}/privacy`} className="hover:text-foreground">
              Privacy
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
