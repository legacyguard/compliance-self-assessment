"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  Building2,
  Landmark,
  Bot,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Framework = "NIS2" | "DORA" | "AI_ACT";

const frameworks: {
  id: Framework;
  icon: typeof Building2;
  color: string;
  questions: number;
}[] = [
  {
    id: "NIS2",
    icon: Building2,
    color: "bg-blue-500",
    questions: 25,
  },
  {
    id: "DORA",
    icon: Landmark,
    color: "bg-emerald-500",
    questions: 25,
  },
  {
    id: "AI_ACT",
    icon: Bot,
    color: "bg-purple-500",
    questions: 25,
  },
];

export default function NewAssessmentPage() {
  const t = useTranslations("assessment");
  const tl = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedFramework = searchParams.get("framework") as Framework | null;

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    preselectedFramework
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartAssessment = async () => {
    if (!selectedFramework) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ framework: selectedFramework }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Failed to create assessment");
      }

      const data = await response.json();
      router.push(`/${locale}/assessment/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const getFrameworkTitle = (id: Framework) => {
    switch (id) {
      case "NIS2":
        return tl("nis2_title");
      case "DORA":
        return tl("dora_title");
      case "AI_ACT":
        return tl("ai_act_title");
    }
  };

  const getFrameworkDescription = (id: Framework) => {
    switch (id) {
      case "NIS2":
        return tl("nis2_description");
      case "DORA":
        return tl("dora_description");
      case "AI_ACT":
        return tl("ai_act_description");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t("select_framework")}</h1>
        <p className="text-muted-foreground">
          {t("select_framework_description")}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <Card
            key={framework.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedFramework === framework.id
                ? "ring-2 ring-primary shadow-lg"
                : ""
            }`}
            onClick={() => setSelectedFramework(framework.id)}
          >
            {selectedFramework === framework.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
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
              <CardTitle>{getFrameworkTitle(framework.id)}</CardTitle>
              <CardDescription>
                {getFrameworkDescription(framework.id)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {framework.questions} {tl("questions_count")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {tl("time_estimate")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" asChild>
          <Link href={`/${locale}/dashboard`}>Cancel</Link>
        </Button>
        <Button
          size="lg"
          disabled={!selectedFramework || loading}
          onClick={handleStartAssessment}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          {t("start_assessment")}
        </Button>
      </div>
    </div>
  );
}
