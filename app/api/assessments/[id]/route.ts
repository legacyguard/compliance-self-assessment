import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, assessmentResponses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Get assessment details
export async function GET(
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

    return NextResponse.json({ success: true, data: assessment });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch assessment" } },
      { status: 500 }
    );
  }
}

// DELETE - Delete assessment
export async function DELETE(
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
    });

    if (!assessment) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Assessment not found" } },
        { status: 404 }
      );
    }

    await db.delete(assessments).where(eq(assessments.id, id));

    return NextResponse.json({ success: true, message: "Assessment deleted" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete assessment" } },
      { status: 500 }
    );
  }
}
