import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight, FileText } from "lucide-react";
import { formatDate, formatScore, getScoreColor } from "@/lib/utils";

export default async function AssessmentListPage() {
  const locale = await getLocale();
  const t = await getTranslations("assessment");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.supabaseUserId, user.id),
  });

  if (!dbUser) {
    redirect(`/${locale}/dashboard`);
  }

  const userAssessments = await db.query.assessments.findMany({
    where: eq(assessments.userId, dbUser.id),
    orderBy: desc(assessments.createdAt),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            Manage and track your compliance assessments
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/assessment/new`}>
            <Plus className="h-4 w-4 mr-2" />
            {t("start_assessment")}
          </Link>
        </Button>
      </div>

      {userAssessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("no_assessments")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("no_assessments_description")}
            </p>
            <Button asChild>
              <Link href={`/${locale}/assessment/new`}>
                <Plus className="h-4 w-4 mr-2" />
                {t("start_assessment")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userAssessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      assessment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {assessment.status === "completed"
                      ? t("completed")
                      : t("in_progress")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {assessment.framework.replace("_", " ")}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  {assessment.framework.replace("_", " ")} Assessment
                </CardTitle>
                <CardDescription>
                  {t("created_at")}: {formatDate(assessment.createdAt, locale)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assessment.status === "completed" &&
                assessment.overallScore !== null ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("overall_score")}
                      </span>
                      <span
                        className={`font-bold text-lg ${getScoreColor(
                          assessment.overallScore
                        )}`}
                      >
                        {formatScore(assessment.overallScore)}
                      </span>
                    </div>
                    <Progress
                      value={assessment.overallScore * 100}
                      className="h-2"
                    />
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/${locale}/assessment/${assessment.id}/results`}>
                        {t("view_details")}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/${locale}/assessment/${assessment.id}`}>
                      {t("continue_assessment")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
