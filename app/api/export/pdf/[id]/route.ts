import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { assessments, users, recommendations } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { jsPDF } from "jspdf";
import { templates } from "@/lib/assessments/templates";
import type { Framework } from "@/lib/assessments/types";

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
    });

    if (!assessment) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Assessment not found" } },
        { status: 404 }
      );
    }

    const assessmentRecommendations = await db.query.recommendations.findMany({
      where: eq(recommendations.assessmentId, id),
      orderBy: asc(recommendations.priority),
    });

    const framework = assessment.framework as Framework;
    const template = templates[framework];
    const categoryScores = (assessment.categoryScores as Record<string, number>) || {};

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Watermark
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.text("FREE ASSESSMENT", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`${framework.replace("_", " ")} Compliance Assessment`, margin, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 40);
    if (dbUser.company) {
      doc.text(`Company: ${dbUser.company}`, margin, 48);
    }

    // Overall Score
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Overall Score", margin, 65);

    const overallScore = Math.round((assessment.overallScore || 0) * 100);
    doc.setFontSize(36);
    doc.setTextColor(
      overallScore >= 80 ? 34 : overallScore >= 60 ? 234 : overallScore >= 40 ? 249 : 239,
      overallScore >= 80 ? 197 : overallScore >= 60 ? 179 : overallScore >= 40 ? 115 : 68,
      overallScore >= 80 ? 94 : overallScore >= 60 ? 8 : overallScore >= 40 ? 22 : 68
    );
    doc.text(`${overallScore}%`, margin, 85);

    doc.setTextColor(0, 0, 0);

    // Category Scores
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Category Breakdown", margin, 110);

    let yPos = 125;
    doc.setFontSize(11);

    for (const category of template.categories) {
      const score = categoryScores[category.key] || 0;
      const scorePercent = Math.round(score * 100);

      doc.setFont("helvetica", "normal");
      doc.text(category.title.en, margin, yPos);
      doc.text(`${scorePercent}%`, pageWidth - margin - 20, yPos);

      // Score bar
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, yPos + 3, 100, 5, "F");
      doc.setFillColor(
        scorePercent >= 80 ? 34 : scorePercent >= 60 ? 234 : scorePercent >= 40 ? 249 : 239,
        scorePercent >= 80 ? 197 : scorePercent >= 60 ? 179 : scorePercent >= 40 ? 115 : 68,
        scorePercent >= 80 ? 94 : scorePercent >= 60 ? 8 : scorePercent >= 40 ? 22 : 68
      );
      doc.rect(margin, yPos + 3, scorePercent, 5, "F");

      yPos += 18;
    }

    // Recommendations
    if (assessmentRecommendations.length > 0) {
      yPos += 10;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Key Recommendations", margin, yPos);

      yPos += 15;
      doc.setFontSize(10);

      for (let i = 0; i < Math.min(assessmentRecommendations.length, 5); i++) {
        const rec = assessmentRecommendations[i];

        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = margin;

          // Watermark on new page
          doc.setFontSize(60);
          doc.setTextColor(230, 230, 230);
          doc.text("FREE ASSESSMENT", pageWidth / 2, pageHeight / 2, {
            align: "center",
            angle: 45,
          });
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
        }

        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}. ${rec.titleEn}`, margin, yPos);

        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(rec.descriptionEn, pageWidth - margin * 2);
        doc.text(descLines, margin, yPos + 6);

        yPos += 10 + descLines.length * 5;
      }
    }

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Compliance Self-Assessment Report",
      margin,
      pageHeight - 15
    );

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${framework}_Assessment_Report.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to generate PDF" } },
      { status: 500 }
    );
  }
}
