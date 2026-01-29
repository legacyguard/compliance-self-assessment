import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, assessmentTemplates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { templates } from "@/lib/assessments/templates";
import type { Framework } from "@/lib/assessments/types";

// GET - List user's assessments
export async function GET() {
  try {
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

    const userAssessments = await db.query.assessments.findMany({
      where: eq(assessments.userId, dbUser.id),
      orderBy: desc(assessments.createdAt),
    });

    return NextResponse.json({ success: true, data: userAssessments });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch assessments" } },
      { status: 500 }
    );
  }
}

// POST - Create new assessment
export async function POST(request: NextRequest) {
  try {
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
    const { framework } = body as { framework: Framework };

    if (!framework || !["NIS2", "DORA", "AI_ACT"].includes(framework)) {
      return NextResponse.json(
        { error: { code: "INVALID_FRAMEWORK", message: "Invalid framework" } },
        { status: 400 }
      );
    }

    // Get or create user
    let dbUser = await db.query.users.findFirst({
      where: eq(users.supabaseUserId, user.id),
    });

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

    // Get or create template
    let template = await db.query.assessmentTemplates.findFirst({
      where: eq(assessmentTemplates.framework, framework),
    });

    if (!template) {
      const templateData = templates[framework];
      const [newTemplate] = await db
        .insert(assessmentTemplates)
        .values({
          framework,
          version: templateData.version,
          isActive: true,
        })
        .returning();
      template = newTemplate;
    }

    // Create assessment
    const [newAssessment] = await db
      .insert(assessments)
      .values({
        userId: dbUser.id,
        templateId: template.id,
        framework,
        status: "in_progress",
        currentCategoryIndex: 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: newAssessment });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create assessment" } },
      { status: 500 }
    );
  }
}
