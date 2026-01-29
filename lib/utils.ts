import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.6) return "text-yellow-600";
  if (score >= 0.4) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-yellow-500";
  if (score >= 0.4) return "bg-orange-500";
  return "bg-red-500";
}

export function generateId(): string {
  return crypto.randomUUID();
}
