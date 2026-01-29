"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Shield, Globe, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string | null;
}

export function Header({ isAuthenticated = false, userName }: HeaderProps) {
  const t = useTranslations("common");
  const td = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{t("app_name")}</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}`}
                className={`px-2 py-1 text-sm rounded ${
                  locale === loc
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {loc.toUpperCase()}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/dashboard`}
                className="flex items-center gap-2 text-sm"
              >
                <User className="h-4 w-4" />
                {userName || td("welcome_default")}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {td("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/login`}>Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/${locale}/register`}>Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
