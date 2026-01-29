import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, recommendations } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Plus,
  CheckCircle,
} from "lucide-react";
import { DonutChart } from "@/components/assessment/DonutChart";
import { formatScore, getScoreColor } from "@/lib/utils";
import { templates } from "@/lib/assessments/templates";
import type { Framework } from "@/lib/assessments/types";

export default async function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("assessment");
  const td = await getTranslations("dashboard");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.supabaseUserId, user.id),
  });

  if (!dbUser) {
    redirect("/en/dashboard");
  }

  const assessment = await db.query.assessments.findFirst({
    where: and(eq(assessments.id, id), eq(assessments.userId, dbUser.id)),
  });

  if (!assessment) {
    redirect("/en/dashboard");
  }

  if (assessment.status !== "completed") {
    redirect(`/en/assessment/${id}`);
  }

  const assessmentRecommendations = await db.query.recommendations.findMany({
    where: eq(recommendations.assessmentId, id),
    orderBy: asc(recommendations.priority),
  });

  const framework = assessment.framework as Framework;
  const template = templates[framework];
  const categoryScores = (assessment.categoryScores as Record<string, number>) || {};

  const getStatusLabel = (score: number) => {
    if (score >= 0.8) return { label: td("status_compliant"), color: "text-green-600" };
    if (score >= 0.6) return { label: td("status_needs_work"), color: "text-yellow-600" };
    if (score >= 0.4) return { label: td("status_at_risk"), color: "text-orange-600" };
    return { label: td("status_critical"), color: "text-red-600" };
  };

  const overallStatus = getStatusLabel(assessment.overallScore || 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 mb-4">
          <CheckCircle className="h-4 w-4" />
          {t("assessment_completed")}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {framework.replace("_", " ")} Assessment Results
        </h1>
        <p className={`text-lg font-medium ${overallStatus.color}`}>
          {overallStatus.label}
        </p>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <DonutChart
              value={assessment.overallScore || 0}
              size={180}
              strokeWidth={16}
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold mb-2">{t("overall_score")}</h2>
              <p className="text-4xl font-bold mb-2">
                {formatScore(assessment.overallScore || 0)}
              </p>
              <p className="text-muted-foreground max-w-md">
                Based on {template.categories.reduce((sum, c) => sum + c.questions.length, 0)} questions
                across {template.categories.length} categories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>{t("category_scores")}</CardTitle>
          <CardDescription>
            Detailed breakdown by compliance area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {template.categories.map((category) => {
              const score = categoryScores[category.key] || 0;
              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {category.title.en}
                    </span>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {formatScore(score)}
                    </span>
                  </div>
                  <Progress value={score * 100} className="h-3" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {assessmentRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("recommendations")}</CardTitle>
            <CardDescription>
              Priority actions to improve your compliance posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessmentRecommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  className="flex gap-4 p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{rec.titleEn}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rec.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="outline" asChild>
          <a href={`/api/export/pdf/${id}`} download>
            <Download className="h-4 w-4 mr-2" />
            {t("download_report")}
          </a>
        </Button>
        <Button asChild>
          <Link href="/en/assessment/new">
            <Plus className="h-4 w-4 mr-2" />
            {t("start_new")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
