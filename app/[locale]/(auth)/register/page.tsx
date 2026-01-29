"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const framework = searchParams.get("framework");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password.length < 8) {
      setError(t("password_min_length"));
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            company: formData.company,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Redirect to dashboard or assessment if framework selected
      if (framework) {
        router.push(`/en/assessment/new?framework=${framework}`);
      } else {
        router.push("/en/dashboard");
      }
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("register_title")}</CardTitle>
        <CardDescription>{t("register_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")} *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("email_placeholder")}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password_label")} *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("password_placeholder")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              {t("name_label")} <span className="text-muted-foreground text-xs">({tc("optional")})</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("name_placeholder")}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">
              {t("company_label")} <span className="text-muted-foreground text-xs">({tc("optional")})</span>
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              placeholder={t("company_placeholder")}
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {t("data_retention")}
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("register_button")}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t("terms_agreement")}
          </p>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {t("have_account")}{" "}
          <Link
            href="/en/login"
            className="text-primary hover:underline font-medium"
          >
            {t("sign_in")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
