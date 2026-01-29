import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, assessmentResponses, recommendations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { calculateAssessmentResult } from "@/lib/assessments/scoring";
import { templates } from "@/lib/assessments/templates";
import type { Framework } from "@/lib/assessments/types";

// POST - Complete assessment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.supabaseUserId, user.id),
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    const assessment = await db.query.assessments.findFirst({
      where: and(eq(assessments.id, id), eq(assessments.userId, dbUser.id)),
      with: {
        responses: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Assessment not found" } },
        { status: 404 }
      );
    }

    const framework = assessment.framework as Framework;
    const template = templates[framework];

    // Build response data for scoring
    const responseData = assessment.responses.map((response) => {
      // Find the question and category for this response
      let questionKey = "";
      let categoryKey = "";
      let weight = 1;

      for (const category of template.categories) {
        for (const question of category.questions) {
          // Match by position since we don't have exact IDs
          if (question.key) {
            questionKey = question.key;
            categoryKey = category.key;
            weight = question.weight;
          }
        }
      }

      return {
        questionKey,
        categoryKey,
        score: response.score,
        weight,
      };
    });

    // If no responses, create mock data based on template
    let scoringData = responseData;
    if (scoringData.length === 0) {
      // Create scoring data from all template questions with default score of 0
      scoringData = template.categories.flatMap((category) =>
        category.questions.map((question) => ({
          questionKey: question.key,
          categoryKey: category.key,
          score: 0,
          weight: question.weight,
        }))
      );
    }

    // Calculate results
    const result = calculateAssessmentResult(scoringData, framework);

    // Update assessment
    await db
      .update(assessments)
      .set({
        status: "completed",
        overallScore: result.overallScore,
        categoryScores: result.categoryScores,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id));

    // Save recommendations
    for (const rec of result.recommendations) {
      await db.insert(recommendations).values({
        assessmentId: id,
        categoryKey: rec.categoryKey,
        priority: rec.priority,
        titleEn: rec.title.en,
        titleSk: rec.title.sk,
        titleCz: rec.title.cz,
        descriptionEn: rec.description.en,
        descriptionSk: rec.description.sk,
        descriptionCz: rec.description.cz,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        overallScore: result.overallScore,
        categoryScores: result.categoryScores,
        gaps: result.gaps,
        recommendations: result.recommendations,
      },
    });
  } catch (error) {
    console.error("Error completing assessment:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to complete assessment" } },
      { status: 500 }
    );
  }
}
