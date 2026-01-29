import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, assessmentResponses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// POST - Save response
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

    const body = await request.json();
    const { questionId, optionId, score } = body;

    if (!questionId || !optionId || score === undefined) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Missing required fields" } },
        { status: 400 }
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
    });

    if (!assessment) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Assessment not found" } },
        { status: 404 }
      );
    }

    // Check if response already exists for this question
    const existingResponse = await db.query.assessmentResponses.findFirst({
      where: and(
        eq(assessmentResponses.assessmentId, id),
        eq(assessmentResponses.questionId, questionId)
      ),
    });

    if (existingResponse) {
      // Update existing response
      await db
        .update(assessmentResponses)
        .set({
          selectedOptionId: optionId,
          score,
        })
        .where(eq(assessmentResponses.id, existingResponse.id));
    } else {
      // Create new response
      await db.insert(assessmentResponses).values({
        assessmentId: id,
        questionId,
        selectedOptionId: optionId,
        score,
      });
    }

    return NextResponse.json({ success: true, message: "Response saved" });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to save response" } },
      { status: 500 }
    );
  }
}
