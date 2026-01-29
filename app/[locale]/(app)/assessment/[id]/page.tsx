"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { templates } from "@/lib/assessments/templates";
import type { Framework } from "@/lib/assessments/types";

interface AssessmentData {
  id: string;
  framework: Framework;
  status: string;
  currentCategoryIndex: number;
  responses: Array<{
    questionId: string;
    score: number;
  }>;
}

export default function AssessmentWizardPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const t = useTranslations("assessment");
  const router = useRouter();

  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionIndex: number; score: number }>>({});

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch assessment");
      }
      const data = await response.json();
      setAssessment(data.data);
      setCurrentCategoryIndex(data.data.currentCategoryIndex || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Assessment not found"}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(`/${locale}/dashboard`)}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const template = templates[assessment.framework];
  const categories = template.categories;
  const currentCategory = categories[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];

  const totalQuestions = categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const questionKey = `${currentCategory.key}_${currentQuestion.key}`;
  const currentAnswer = answers[questionKey];

  const getLocalizedText = (text: { en: string; sk: string; cz: string }) => {
    return text[locale as keyof typeof text] || text.en;
  };

  const handleAnswer = (optionIndex: number) => {
    const option = currentQuestion.options[optionIndex];
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: { optionIndex, score: option.score },
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All questions answered, complete assessment
      await completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      setCurrentQuestionIndex(
        categories[currentCategoryIndex - 1].questions.length - 1
      );
    }
  };

  const completeAssessment = async () => {
    setSaving(true);
    try {
      // Save all answers
      for (const [key, answer] of Object.entries(answers)) {
        await fetch(`/api/assessments/${id}/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: key,
            optionId: key,
            score: answer.score,
          }),
        });
      }

      // Complete assessment
      const response = await fetch(`/api/assessments/${id}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete assessment");
      }

      router.push(`/${locale}/assessment/${id}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete assessment");
    } finally {
      setSaving(false);
    }
  };

  const isLastQuestion =
    currentCategoryIndex === categories.length - 1 &&
    currentQuestionIndex === currentCategory.questions.length - 1;

  const questionNumber =
    categories
      .slice(0, currentCategoryIndex)
      .reduce((sum, cat) => sum + cat.questions.length, 0) +
    currentQuestionIndex +
    1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {assessment.framework.replace("_", " ")} Assessment
          </span>
          <span className="text-muted-foreground">
            {t("question_of", {
              current: questionNumber,
              total: totalQuestions,
            })}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={category.key}
            onClick={() => {
              setCurrentCategoryIndex(index);
              setCurrentQuestionIndex(0);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              index === currentCategoryIndex
                ? "bg-primary text-primary-foreground"
                : index < currentCategoryIndex
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index < currentCategoryIndex && (
              <CheckCircle className="h-4 w-4 inline mr-1" />
            )}
            {getLocalizedText(category.title)}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{t("category")}:</span>
            <span className="font-medium text-foreground">
              {getLocalizedText(currentCategory.title)}
            </span>
          </div>
          <CardTitle className="text-xl">
            {getLocalizedText(currentQuestion.question)}
          </CardTitle>
          {currentQuestion.helpText && (
            <CardDescription className="flex items-start gap-2 mt-2">
              <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {getLocalizedText(currentQuestion.helpText)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer?.optionIndex?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                  currentAnswer?.optionIndex === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleAnswer(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {getLocalizedText(option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("previous_question")}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!currentAnswer || saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : isLastQuestion ? (
            <>
              {t("complete_assessment")}
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              {t("next_question")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
