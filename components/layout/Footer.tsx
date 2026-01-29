"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">{t("app_name")}</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t("footer_copyright")}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/en/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/en/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
