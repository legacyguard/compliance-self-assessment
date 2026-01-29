import { useTranslations } from "next-intl";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import {
  Shield,
  FileSearch,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  Building2,
  Bot,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function LandingPage() {
  const locale = await getLocale();

  return <LandingPageContent locale={locale} />;
}

function LandingPageContent({ locale }: { locale: string }) {
  const t = useTranslations("landing");

  const frameworks = [
    {
      id: "NIS2",
      title: t("nis2_title"),
      description: t("nis2_description"),
      icon: Building2,
      questions: 25,
      color: "bg-blue-500",
    },
    {
      id: "DORA",
      title: t("dora_title"),
      description: t("dora_description"),
      icon: Landmark,
      questions: 25,
      color: "bg-emerald-500",
    },
    {
      id: "AI_ACT",
      title: t("ai_act_title"),
      description: t("ai_act_description"),
      icon: Bot,
      questions: 25,
      color: "bg-purple-500",
    },
  ];

  const features = [
    {
      title: t("feature_1_title"),
      description: t("feature_1_description"),
      icon: Clock,
    },
    {
      title: t("feature_2_title"),
      description: t("feature_2_description"),
      icon: FileSearch,
    },
    {
      title: t("feature_3_title"),
      description: t("feature_3_description"),
      icon: FileText,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="mr-2 h-4 w-4" />
              Free Compliance Assessment Tool
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {t("hero_title")}
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={`/${locale}/register`}>
                  {t("hero_cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#frameworks">{t("hero_secondary_cta")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("features_title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section id="frameworks" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("frameworks_title")}</h2>
            <p className="text-xl text-muted-foreground">
              {t("frameworks_subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {frameworks.map((framework) => (
              <Card
                key={framework.id}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${framework.color}`}
                />
                <CardHeader className="pt-8">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${framework.color}/10`}
                  >
                    <framework.icon
                      className={`h-6 w-6 ${framework.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <CardTitle>{framework.title}</CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {framework.questions} {t("questions_count")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {t("time_estimate")}
                    </span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/${locale}/register?framework=${framework.id}`}>
                      {t("hero_cta")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t("cta_title")}</h2>
            <p className="text-xl mb-8 opacity-90">{t("cta_description")}</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/${locale}/register`}>
                {t("cta_button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
