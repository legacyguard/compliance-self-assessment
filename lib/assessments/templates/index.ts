import { nis2Template } from "./nis2-template";
import { doraTemplate } from "./dora-template";
import { aiActTemplate } from "./ai-act-template";
import { Framework, AssessmentTemplateData } from "../types";

export const templates: Record<Framework, AssessmentTemplateData> = {
  NIS2: nis2Template,
  DORA: doraTemplate,
  AI_ACT: aiActTemplate,
};

export function getTemplate(framework: Framework): AssessmentTemplateData {
  return templates[framework];
}

export { nis2Template, doraTemplate, aiActTemplate };
