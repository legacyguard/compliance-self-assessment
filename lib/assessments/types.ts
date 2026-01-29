export type Framework = "NIS2" | "DORA" | "AI_ACT";

export interface AnswerOptionTemplate {
  label: {
    en: string;
    sk: string;
    cz: string;
  };
  score: number;
}

export interface QuestionTemplate {
  key: string;
  question: {
    en: string;
    sk: string;
    cz: string;
  };
  helpText?: {
    en: string;
    sk: string;
    cz: string;
  };
  weight: number;
  options: AnswerOptionTemplate[];
}

export interface CategoryTemplate {
  key: string;
  title: {
    en: string;
    sk: string;
    cz: string;
  };
  description?: {
    en: string;
    sk: string;
    cz: string;
  };
  weight: number;
  questions: QuestionTemplate[];
}

export interface AssessmentTemplateData {
  framework: Framework;
  version: string;
  categories: CategoryTemplate[];
}

export interface CategoryScore {
  key: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  gaps: Gap[];
  recommendations: RecommendationItem[];
}

export interface Gap {
  categoryKey: string;
  questionKey: string;
  score: number;
  maxScore: number;
  priority: number;
}

export interface RecommendationItem {
  categoryKey: string;
  priority: number;
  title: {
    en: string;
    sk: string;
    cz: string;
  };
  description: {
    en: string;
    sk: string;
    cz: string;
  };
}

// Standard answer options used across all frameworks
export const standardOptions: AnswerOptionTemplate[] = [
  {
    label: {
      en: "Fully implemented and documented",
      sk: "Plne implementované a zdokumentované",
      cz: "Plně implementováno a zdokumentováno",
    },
    score: 1.0,
  },
  {
    label: {
      en: "Mostly implemented",
      sk: "Väčšinou implementované",
      cz: "Většinou implementováno",
    },
    score: 0.75,
  },
  {
    label: {
      en: "Partially implemented",
      sk: "Čiastočne implementované",
      cz: "Částečně implementováno",
    },
    score: 0.5,
  },
  {
    label: {
      en: "In planning/early stages",
      sk: "V plánovacej/počiatočnej fáze",
      cz: "Ve fázi plánování/počáteční fázi",
    },
    score: 0.25,
  },
  {
    label: {
      en: "Not implemented",
      sk: "Neimplementované",
      cz: "Neimplementováno",
    },
    score: 0,
  },
];
