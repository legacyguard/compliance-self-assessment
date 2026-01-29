import { AssessmentTemplateData, standardOptions } from "../types";

export const aiActTemplate: AssessmentTemplateData = {
  framework: "AI_ACT",
  version: "1.0",
  categories: [
    {
      key: "ai_system_classification",
      title: {
        en: "AI System Classification",
        sk: "Klasifikácia AI Systémov",
        cz: "Klasifikace AI Systémů",
      },
      description: {
        en: "Identification and classification of AI systems by risk level",
        sk: "Identifikácia a klasifikácia AI systémov podľa úrovne rizika",
        cz: "Identifikace a klasifikace AI systémů podle úrovně rizika",
      },
      weight: 1.3,
      questions: [
        {
          key: "ai_inventory",
          question: {
            en: "Do you maintain an inventory of all AI systems used or developed?",
            sk: "Vedáte inventár všetkých používaných alebo vyvíjaných AI systémov?",
            cz: "Vedete inventář všech používaných nebo vyvíjených AI systémů?",
          },
          helpText: {
            en: "The AI Act requires organizations to know which AI systems they use or provide.",
            sk: "AI Act vyžaduje, aby organizácie vedeli, ktoré AI systémy používajú alebo poskytujú.",
            cz: "AI Act vyžaduje, aby organizace věděly, které AI systémy používají nebo poskytují.",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "risk_classification",
          question: {
            en: "Have you classified your AI systems according to risk levels?",
            sk: "Klasifikovali ste vaše AI systémy podľa úrovní rizika?",
            cz: "Klasifikovali jste vaše AI systémy podle úrovní rizika?",
          },
          helpText: {
            en: "Risk levels: Unacceptable, High-risk, Limited risk, Minimal risk.",
            sk: "Úrovne rizika: Neprijateľné, Vysoké riziko, Obmedzené riziko, Minimálne riziko.",
            cz: "Úrovně rizika: Nepřijatelné, Vysoké riziko, Omezené riziko, Minimální riziko.",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "prohibited_uses",
          question: {
            en: "Have you verified that you don't use prohibited AI applications?",
            sk: "Overili ste, že nepoužívate zakázané AI aplikácie?",
            cz: "Ověřili jste, že nepoužíváte zakázané AI aplikace?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "high_risk_identification",
          question: {
            en: "Have you identified any high-risk AI systems you use or provide?",
            sk: "Identifikovali ste nejaké vysoko rizikové AI systémy, ktoré používate alebo poskytujete?",
            cz: "Identifikovali jste nějaké vysoce rizikové AI systémy, které používáte nebo poskytujete?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "gpai_assessment",
          question: {
            en: "If using general-purpose AI, have you assessed provider compliance?",
            sk: "Ak používate AI na všeobecné účely, zhodnotili ste súlad poskytovateľa?",
            cz: "Pokud používáte AI pro obecné účely, zhodnotili jste soulad poskytovatele?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "risk_management",
      title: {
        en: "Risk Management",
        sk: "Riadenie Rizík",
        cz: "Řízení Rizik",
      },
      description: {
        en: "Risk management system for high-risk AI systems",
        sk: "Systém riadenia rizík pre vysoko rizikové AI systémy",
        cz: "Systém řízení rizik pro vysoce rizikové AI systémy",
      },
      weight: 1.2,
      questions: [
        {
          key: "risk_management_system",
          question: {
            en: "Do you have a risk management system for high-risk AI?",
            sk: "Máte systém riadenia rizík pre vysoko rizikové AI?",
            cz: "Máte systém řízení rizik pro vysoce rizikové AI?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "risk_identification",
          question: {
            en: "Do you identify and analyze known and foreseeable risks?",
            sk: "Identifikujete a analyzujete známe a predvídateľné riziká?",
            cz: "Identifikujete a analyzujete známá a předvídatelná rizika?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "risk_mitigation",
          question: {
            en: "Have you implemented risk mitigation measures?",
            sk: "Implementovali ste opatrenia na zmiernenie rizík?",
            cz: "Implementovali jste opatření ke zmírnění rizik?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "continuous_assessment",
          question: {
            en: "Is risk assessment conducted continuously throughout the AI lifecycle?",
            sk: "Vykonáva sa hodnotenie rizík priebežne počas životného cyklu AI?",
            cz: "Provádí se hodnocení rizik průběžně během životního cyklu AI?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "residual_risk",
          question: {
            en: "Is residual risk acceptable and communicated?",
            sk: "Je zostatkové riziko prijateľné a komunikované?",
            cz: "Je zbytkové riziko přijatelné a komunikované?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "data_governance",
      title: {
        en: "Data Governance",
        sk: "Správa Dát",
        cz: "Správa Dat",
      },
      description: {
        en: "Data quality, management practices, and training data governance",
        sk: "Kvalita dát, postupy správy a riadenie trénovacích dát",
        cz: "Kvalita dat, postupy správy a řízení tréninkových dat",
      },
      weight: 1.1,
      questions: [
        {
          key: "data_quality",
          question: {
            en: "Do you have data quality management practices for AI training data?",
            sk: "Máte postupy riadenia kvality dát pre trénovacie dáta AI?",
            cz: "Máte postupy řízení kvality dat pro tréninková data AI?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "bias_assessment",
          question: {
            en: "Do you assess training data for potential biases?",
            sk: "Hodnotíte trénovacie dáta z hľadiska potenciálnych skreslení?",
            cz: "Hodnotíte tréninková data z hlediska potenciálních zkreslení?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "data_documentation",
          question: {
            en: "Is AI training and testing data properly documented?",
            sk: "Sú trénovacie a testovacie dáta AI riadne zdokumentované?",
            cz: "Jsou tréninková a testovací data AI řádně zdokumentována?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "data_privacy",
          question: {
            en: "Do you ensure privacy compliance in AI data processing?",
            sk: "Zabezpečujete súlad so súkromím pri spracovaní dát AI?",
            cz: "Zajišťujete soulad se soukromím při zpracování dat AI?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "data_retention",
          question: {
            en: "Do you have data retention policies for AI systems?",
            sk: "Máte politiky uchovávania dát pre AI systémy?",
            cz: "Máte politiky uchovávání dat pro AI systémy?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "transparency",
      title: {
        en: "Transparency & Human Oversight",
        sk: "Transparentnosť a Ľudský Dohľad",
        cz: "Transparentnost a Lidský Dohled",
      },
      description: {
        en: "AI system transparency, explainability, and human oversight mechanisms",
        sk: "Transparentnosť AI systémov, vysvetliteľnosť a mechanizmy ľudského dohľadu",
        cz: "Transparentnost AI systémů, vysvětlitelnost a mechanismy lidského dohledu",
      },
      weight: 1.2,
      questions: [
        {
          key: "user_notification",
          question: {
            en: "Do you inform users when they interact with an AI system?",
            sk: "Informujete používateľov, keď interagujú s AI systémom?",
            cz: "Informujete uživatele, když interagují s AI systémem?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "explainability",
          question: {
            en: "Can you explain AI system decisions to affected individuals?",
            sk: "Dokážete vysvetliť rozhodnutia AI systémov dotknutým jednotlivcom?",
            cz: "Dokážete vysvětlit rozhodnutí AI systémů dotčeným jednotlivcům?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "human_oversight",
          question: {
            en: "Are there human oversight mechanisms for high-risk AI decisions?",
            sk: "Existujú mechanizmy ľudského dohľadu pre vysoko rizikové rozhodnutia AI?",
            cz: "Existují mechanismy lidského dohledu pro vysoce riziková rozhodnutí AI?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "override_capability",
          question: {
            en: "Can humans override or reverse AI decisions when necessary?",
            sk: "Môžu ľudia v prípade potreby prehliadnuť alebo zvrátiť rozhodnutia AI?",
            cz: "Mohou lidé v případě potřeby přehlédnout nebo zvrátit rozhodnutí AI?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "synthetic_content",
          question: {
            en: "Is AI-generated or synthetic content clearly marked?",
            sk: "Je obsah generovaný AI alebo syntetický obsah jasne označený?",
            cz: "Je obsah generovaný AI nebo syntetický obsah jasně označen?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "technical_documentation",
      title: {
        en: "Technical Documentation",
        sk: "Technická Dokumentácia",
        cz: "Technická Dokumentace",
      },
      description: {
        en: "Documentation requirements and conformity assessment",
        sk: "Požiadavky na dokumentáciu a hodnotenie zhody",
        cz: "Požadavky na dokumentaci a hodnocení shody",
      },
      weight: 1.0,
      questions: [
        {
          key: "technical_docs",
          question: {
            en: "Do you maintain technical documentation for high-risk AI systems?",
            sk: "Vedáte technickú dokumentáciu pre vysoko rizikové AI systémy?",
            cz: "Vedete technickou dokumentaci pro vysoce rizikové AI systémy?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "intended_purpose",
          question: {
            en: "Is the intended purpose of each AI system documented?",
            sk: "Je zamýšľaný účel každého AI systému zdokumentovaný?",
            cz: "Je zamýšlený účel každého AI systému zdokumentován?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "performance_metrics",
          question: {
            en: "Are AI system performance metrics documented and monitored?",
            sk: "Sú metriky výkonnosti AI systémov zdokumentované a monitorované?",
            cz: "Jsou metriky výkonnosti AI systémů zdokumentovány a monitorovány?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "logging",
          question: {
            en: "Is there adequate logging of AI system operations?",
            sk: "Je dostatočné protokolovanie operácií AI systémov?",
            cz: "Je dostatečné protokolování operací AI systémů?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "conformity",
          question: {
            en: "Have you conducted conformity assessment for high-risk AI?",
            sk: "Vykonali ste hodnotenie zhody pre vysoko rizikové AI?",
            cz: "Provedli jste hodnocení shody pro vysoce rizikové AI?",
          },
          weight: 1.3,
          options: standardOptions,
        },
      ],
    },
  ],
};
