import {
  CategoryScore,
  AssessmentResult,
  Gap,
  RecommendationItem,
  CategoryTemplate,
  Framework,
} from "./types";
import { templates } from "./templates";

interface ResponseData {
  questionKey: string;
  categoryKey: string;
  score: number;
  weight: number;
}

export function calculateCategoryScore(
  responses: ResponseData[],
  categoryKey: string,
  categoryWeight: number
): CategoryScore {
  const categoryResponses = responses.filter(
    (r) => r.categoryKey === categoryKey
  );

  if (categoryResponses.length === 0) {
    return {
      key: categoryKey,
      score: 0,
      maxScore: 0,
      percentage: 0,
    };
  }

  const totalWeightedScore = categoryResponses.reduce(
    (sum, r) => sum + r.score * r.weight,
    0
  );
  const totalWeight = categoryResponses.reduce((sum, r) => sum + r.weight, 0);

  const score = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  return {
    key: categoryKey,
    score: totalWeightedScore,
    maxScore: totalWeight,
    percentage: score,
  };
}

export function calculateOverallScore(
  categoryScores: CategoryScore[],
  categories: CategoryTemplate[]
): number {
  if (categoryScores.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const catScore of categoryScores) {
    const category = categories.find((c) => c.key === catScore.key);
    const weight = category?.weight || 1;
    totalWeightedScore += catScore.percentage * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

export function identifyGaps(
  responses: ResponseData[],
  threshold: number = 0.5
): Gap[] {
  const gaps: Gap[] = responses
    .filter((r) => r.score < threshold)
    .map((r, index) => ({
      categoryKey: r.categoryKey,
      questionKey: r.questionKey,
      score: r.score,
      maxScore: 1,
      priority: Math.round((1 - r.score) * 100), // Higher priority for lower scores
    }))
    .sort((a, b) => b.priority - a.priority);

  return gaps.slice(0, 10); // Return top 10 gaps
}

export function generateRecommendations(
  gaps: Gap[],
  framework: Framework
): RecommendationItem[] {
  const template = templates[framework];
  const recommendations: RecommendationItem[] = [];

  const categoryGaps = new Map<string, Gap[]>();
  for (const gap of gaps) {
    const existing = categoryGaps.get(gap.categoryKey) || [];
    existing.push(gap);
    categoryGaps.set(gap.categoryKey, existing);
  }

  let priority = 1;
  for (const [categoryKey, catGaps] of Array.from(categoryGaps.entries())) {
    const category = template.categories.find((c) => c.key === categoryKey);
    if (!category) continue;

    const avgScore =
      catGaps.reduce((sum: number, g: Gap) => sum + g.score, 0) / catGaps.length;

    recommendations.push({
      categoryKey,
      priority: priority++,
      title: {
        en: `Improve ${category.title.en}`,
        sk: `Zlepšiť ${category.title.sk}`,
        cz: `Zlepšit ${category.title.cz}`,
      },
      description: getRecommendationDescription(categoryKey, avgScore, framework),
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

function getRecommendationDescription(
  categoryKey: string,
  avgScore: number,
  framework: Framework
): { en: string; sk: string; cz: string } {
  const urgency = avgScore < 0.25 ? "urgently" : avgScore < 0.5 ? "soon" : "gradually";
  const urgencySk = avgScore < 0.25 ? "urgentne" : avgScore < 0.5 ? "čoskoro" : "postupne";
  const urgencyCz = avgScore < 0.25 ? "urgentně" : avgScore < 0.5 ? "brzy" : "postupně";

  const descriptions: Record<string, { en: string; sk: string; cz: string }> = {
    governance: {
      en: `You need to ${urgency} strengthen your governance and risk management practices. Consider establishing clear accountability, documenting policies, and allocating adequate resources.`,
      sk: `Potrebujete ${urgencySk} posilniť vaše postupy riadenia a manažmentu rizík. Zvážte zavedenie jasnej zodpovednosti, dokumentovanie politík a pridelenie dostatočných zdrojov.`,
      cz: `Potřebujete ${urgencyCz} posílit vaše postupy řízení a managementu rizik. Zvažte zavedení jasné odpovědnosti, dokumentování politik a přidělení dostatečných zdrojů.`,
    },
    incident_management: {
      en: `You need to ${urgency} improve your incident handling capabilities. Focus on detection systems, response procedures, and meeting reporting deadlines.`,
      sk: `Potrebujete ${urgencySk} zlepšiť vaše schopnosti spracovania incidentov. Zamerajte sa na detekčné systémy, postupy reakcie a dodržiavanie termínov hlásenia.`,
      cz: `Potřebujete ${urgencyCz} zlepšit vaše schopnosti zpracování incidentů. Zaměřte se na detekční systémy, postupy reakce a dodržování termínů hlášení.`,
    },
    business_continuity: {
      en: `You need to ${urgency} enhance your business continuity capabilities. Implement robust backup procedures and test your disaster recovery plans.`,
      sk: `Potrebujete ${urgencySk} zlepšiť vaše schopnosti kontinuity podnikania. Implementujte robustné postupy zálohovania a testujte plány obnovy po havárii.`,
      cz: `Potřebujete ${urgencyCz} zlepšit vaše schopnosti kontinuity podnikání. Implementujte robustní postupy zálohování a testujte plány obnovy po havárii.`,
    },
    supply_chain: {
      en: `You need to ${urgency} address supply chain security gaps. Assess your suppliers, include security requirements in contracts, and monitor ongoing compliance.`,
      sk: `Potrebujete ${urgencySk} riešiť medzery v bezpečnosti dodávateľského reťazca. Zhodnoťte svojich dodávateľov, zahrňte bezpečnostné požiadavky do zmlúv a monitorujte priebežný súlad.`,
      cz: `Potřebujete ${urgencyCz} řešit mezery v bezpečnosti dodavatelského řetězce. Zhodnoťte své dodavatele, zahrňte bezpečnostní požadavky do smluv a monitorujte průběžný soulad.`,
    },
    technical_security: {
      en: `You need to ${urgency} strengthen technical security measures. Implement access controls, encryption, vulnerability management, and network segmentation.`,
      sk: `Potrebujete ${urgencySk} posilniť technické bezpečnostné opatrenia. Implementujte riadenie prístupu, šifrovanie, správu zraniteľností a segmentáciu siete.`,
      cz: `Potřebujete ${urgencyCz} posílit technická bezpečnostní opatření. Implementujte řízení přístupu, šifrování, správu zranitelností a segmentaci sítě.`,
    },
    ict_risk_management: {
      en: `You need to ${urgency} establish a comprehensive ICT risk management framework as required by DORA.`,
      sk: `Potrebujete ${urgencySk} zaviesť komplexný rámec riadenia ICT rizík podľa požiadaviek DORA.`,
      cz: `Potřebujete ${urgencyCz} zavést komplexní rámec řízení ICT rizik podle požadavků DORA.`,
    },
    ict_incident_management: {
      en: `You need to ${urgency} improve ICT incident management processes to meet DORA requirements.`,
      sk: `Potrebujete ${urgencySk} zlepšiť procesy riadenia ICT incidentov na splnenie požiadaviek DORA.`,
      cz: `Potřebujete ${urgencyCz} zlepšit procesy řízení ICT incidentů pro splnění požadavků DORA.`,
    },
    digital_resilience_testing: {
      en: `You need to ${urgency} implement a digital operational resilience testing program.`,
      sk: `Potrebujete ${urgencySk} implementovať program testovania digitálnej prevádzkovej odolnosti.`,
      cz: `Potřebujete ${urgencyCz} implementovat program testování digitální provozní odolnosti.`,
    },
    third_party_risk: {
      en: `You need to ${urgency} strengthen ICT third-party risk management and establish proper due diligence.`,
      sk: `Potrebujete ${urgencySk} posilniť riadenie rizík ICT tretích strán a zaviesť náležitú due diligence.`,
      cz: `Potřebujete ${urgencyCz} posílit řízení rizik ICT třetích stran a zavést náležitou due diligence.`,
    },
    information_sharing: {
      en: `Consider ${urgency} establishing information sharing arrangements with relevant parties.`,
      sk: `Zvážte ${urgencySk} zavedenie dojednaní o zdieľaní informácií s relevantnými stranami.`,
      cz: `Zvažte ${urgencyCz} zavedení ujednání o sdílení informací s relevantními stranami.`,
    },
    ai_system_classification: {
      en: `You need to ${urgency} classify your AI systems according to risk levels as required by the AI Act.`,
      sk: `Potrebujete ${urgencySk} klasifikovať vaše AI systémy podľa úrovní rizika podľa požiadaviek AI Act.`,
      cz: `Potřebujete ${urgencyCz} klasifikovat vaše AI systémy podle úrovní rizika podle požadavků AI Act.`,
    },
    risk_management: {
      en: `You need to ${urgency} establish a risk management system for your high-risk AI systems.`,
      sk: `Potrebujete ${urgencySk} zaviesť systém riadenia rizík pre vaše vysoko rizikové AI systémy.`,
      cz: `Potřebujete ${urgencyCz} zavést systém řízení rizik pro vaše vysoce rizikové AI systémy.`,
    },
    data_governance: {
      en: `You need to ${urgency} improve data governance practices for AI training and testing data.`,
      sk: `Potrebujete ${urgencySk} zlepšiť postupy správy dát pre trénovacie a testovacie dáta AI.`,
      cz: `Potřebujete ${urgencyCz} zlepšit postupy správy dat pro tréninková a testovací data AI.`,
    },
    transparency: {
      en: `You need to ${urgency} enhance transparency and human oversight for your AI systems.`,
      sk: `Potrebujete ${urgencySk} zlepšiť transparentnosť a ľudský dohľad nad vašimi AI systémami.`,
      cz: `Potřebujete ${urgencyCz} zlepšit transparentnost a lidský dohled nad vašimi AI systémy.`,
    },
    technical_documentation: {
      en: `You need to ${urgency} improve technical documentation for your AI systems.`,
      sk: `Potrebujete ${urgencySk} zlepšiť technickú dokumentáciu pre vaše AI systémy.`,
      cz: `Potřebujete ${urgencyCz} zlepšit technickou dokumentaci pro vaše AI systémy.`,
    },
  };

  return (
    descriptions[categoryKey] || {
      en: `You need to ${urgency} address gaps in this area to improve compliance.`,
      sk: `Potrebujete ${urgencySk} riešiť medzery v tejto oblasti na zlepšenie súladu.`,
      cz: `Potřebujete ${urgencyCz} řešit mezery v této oblasti pro zlepšení souladu.`,
    }
  );
}

export function calculateAssessmentResult(
  responses: ResponseData[],
  framework: Framework
): AssessmentResult {
  const template = templates[framework];

  const categoryScores: CategoryScore[] = template.categories.map((category) =>
    calculateCategoryScore(responses, category.key, category.weight)
  );

  const overallScore = calculateOverallScore(categoryScores, template.categories);
  const gaps = identifyGaps(responses);
  const recommendations = generateRecommendations(gaps, framework);

  return {
    overallScore,
    categoryScores: Object.fromEntries(
      categoryScores.map((cs) => [cs.key, cs.percentage])
    ),
    gaps,
    recommendations,
  };
}
