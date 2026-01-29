import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, assessments, recommendations, assessmentResponses } from "@/lib/db/schema";
import { lt, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Invalid cron secret" } },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find expired users
    const expiredUsers = await db.query.users.findMany({
      where: lt(users.expiresAt, now),
    });

    if (expiredUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired users to clean up",
        deletedCount: 0,
      });
    }

    const expiredUserIds = expiredUsers.map((u) => u.id);

    // Find assessments for expired users
    const expiredAssessments = await db.query.assessments.findMany({
      where: inArray(assessments.userId, expiredUserIds),
    });

    const expiredAssessmentIds = expiredAssessments.map((a) => a.id);

    // Delete in order (cascade)
    if (expiredAssessmentIds.length > 0) {
      // Delete recommendations
      await db
        .delete(recommendations)
        .where(inArray(recommendations.assessmentId, expiredAssessmentIds));

      // Delete responses
      await db
        .delete(assessmentResponses)
        .where(inArray(assessmentResponses.assessmentId, expiredAssessmentIds));

      // Delete assessments
      await db
        .delete(assessments)
        .where(inArray(assessments.id, expiredAssessmentIds));
    }

    // Delete users
    await db.delete(users).where(inArray(users.id, expiredUserIds));

    console.log(`Cleanup completed: Deleted ${expiredUsers.length} expired users`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${expiredUsers.length} expired users and ${expiredAssessments.length} assessments`,
      deletedUsers: expiredUsers.length,
      deletedAssessments: expiredAssessments.length,
    });
  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Cleanup failed" } },
      { status: 500 }
    );
  }
}

// Also allow GET for Vercel cron
export async function GET(request: NextRequest) {
  return POST(request);
}
