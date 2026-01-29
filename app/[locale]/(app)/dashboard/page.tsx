import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Plus,
  FileText,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDate, formatScore, getScoreColor } from "@/lib/utils";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const ta = await getTranslations("assessment");
  const tc = await getTranslations("common");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Get user from our database
  let dbUser = await db.query.users.findFirst({
    where: eq(users.supabaseUserId, user.id),
  });

  // Create user if doesn't exist
  if (!dbUser) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const [newUser] = await db
      .insert(users)
      .values({
        email: user.email!,
        name: user.user_metadata?.name,
        company: user.user_metadata?.company,
        supabaseUserId: user.id,
        expiresAt,
      })
      .returning();
    dbUser = newUser;
  }

  // Get user's assessments
  const userAssessments = await db.query.assessments.findMany({
    where: eq(assessments.userId, dbUser.id),
    orderBy: desc(assessments.createdAt),
    with: {
      template: true,
    },
  });

  // Calculate days until expiry
  const daysUntilExpiry = Math.ceil(
    (new Date(dbUser.expiresAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const userName = user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("welcome", { name: userName })}
          </p>
        </div>
        <Button asChild>
          <Link href="/en/assessment/new">
            <Plus className="h-4 w-4 mr-2" />
            {t("new_assessment")}
          </Link>
        </Button>
      </div>

      {/* Data Retention Warning */}
      {daysUntilExpiry <= 7 && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">
            {t("data_expires_soon")}
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            {daysUntilExpiry} {t("days_until_expiry")}
          </AlertDescription>
        </Alert>
      )}

      {/* Assessments Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t("assessments_title")}</h2>
          {userAssessments.length > 0 && (
            <Link
              href="/en/assessment"
              className="text-sm text-primary hover:underline"
            >
              {t("view_all")}
            </Link>
          )}
        </div>

        {userAssessments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {ta("no_assessments")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {ta("no_assessments_description")}
              </p>
              <Button asChild>
                <Link href="/en/assessment/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {ta("start_assessment")}
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
                        ? ta("completed")
                        : ta("in_progress")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {assessment.framework}
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {assessment.framework} Assessment
                  </CardTitle>
                  <CardDescription>
                    {ta("created_at")}: {formatDate(assessment.createdAt, "en")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assessment.status === "completed" && assessment.overallScore !== null ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {ta("overall_score")}
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
                        <Link href={`/en/assessment/${assessment.id}/results`}>
                          {ta("view_details")}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={`/en/assessment/${assessment.id}`}>
                        {ta("continue_assessment")}
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

      {/* Quick Stats */}
      {userAssessments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("score_overview")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {userAssessments.length}
                </span>
                <span className="text-muted-foreground">assessments</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{ta("completed")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  {userAssessments.filter((a) => a.status === "completed").length}
                </span>
                <span className="text-muted-foreground">completed</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{tc("data_retention_notice")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{daysUntilExpiry}</span>
                <span className="text-muted-foreground">days left</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
