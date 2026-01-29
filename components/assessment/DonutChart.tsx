"use client";

import { cn, getScoreBgColor } from "@/lib/utils";

interface DonutChartProps {
  value: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
}

export function DonutChart({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  showPercentage = true,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - value * circumference;

  const percentage = Math.round(value * 100);

  const getColor = (v: number) => {
    if (v >= 0.8) return "#22c55e"; // green-500
    if (v >= 0.6) return "#eab308"; // yellow-500
    if (v >= 0.4) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
