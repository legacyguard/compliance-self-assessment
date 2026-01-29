"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string | null;
}

export function Header({ isAuthenticated = false, userName }: HeaderProps) {
  const t = useTranslations("common");
  const td = useTranslations("dashboard");
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/en");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/en" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{t("app_name")}</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/en/dashboard"
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
                <Link href="/en/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/en/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
