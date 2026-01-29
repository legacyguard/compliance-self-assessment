import { AssessmentTemplateData, standardOptions } from "../types";

export const nis2Template: AssessmentTemplateData = {
  framework: "NIS2",
  version: "1.0",
  categories: [
    {
      key: "governance",
      title: {
        en: "Governance & Risk Management",
        sk: "Riadenie a Manažment Rizík",
        cz: "Řízení a Management Rizik",
      },
      description: {
        en: "Organizational governance, risk assessment, and management accountability",
        sk: "Organizačné riadenie, hodnotenie rizík a manažérska zodpovednosť",
        cz: "Organizační řízení, hodnocení rizik a manažerská odpovědnost",
      },
      weight: 1.2,
      questions: [
        {
          key: "risk_assessment",
          question: {
            en: "Do you have a documented cybersecurity risk assessment process?",
            sk: "Máte zdokumentovaný proces hodnotenia kybernetických rizík?",
            cz: "Máte zdokumentovaný proces hodnocení kybernetických rizik?",
          },
          helpText: {
            en: "This includes regular risk identification, analysis, and evaluation procedures.",
            sk: "Zahŕňa pravidelné postupy identifikácie, analýzy a hodnotenia rizík.",
            cz: "Zahrnuje pravidelné postupy identifikace, analýzy a hodnocení rizik.",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "management_accountability",
          question: {
            en: "Is there clear management accountability for cybersecurity at board level?",
            sk: "Existuje jasná manažérska zodpovednosť za kybernetickú bezpečnosť na úrovni vedenia?",
            cz: "Existuje jasná manažerská odpovědnost za kybernetickou bezpečnost na úrovni vedení?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "security_policies",
          question: {
            en: "Do you have comprehensive cybersecurity policies approved by management?",
            sk: "Máte komplexné politiky kybernetickej bezpečnosti schválené vedením?",
            cz: "Máte komplexní politiky kybernetické bezpečnosti schválené vedením?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "security_budget",
          question: {
            en: "Is there a dedicated budget for cybersecurity measures?",
            sk: "Existuje vyhradený rozpočet na opatrenia kybernetickej bezpečnosti?",
            cz: "Existuje vyhrazený rozpočet na opatření kybernetické bezpečnosti?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "compliance_monitoring",
          question: {
            en: "Do you have processes to monitor compliance with cybersecurity requirements?",
            sk: "Máte procesy na monitorovanie súladu s požiadavkami kybernetickej bezpečnosti?",
            cz: "Máte procesy pro monitorování souladu s požadavky kybernetické bezpečnosti?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "incident_management",
      title: {
        en: "Incident Handling & Response",
        sk: "Spracovanie Incidentov a Reakcia",
        cz: "Zpracování Incidentů a Reakce",
      },
      description: {
        en: "Incident detection, response procedures, and reporting capabilities",
        sk: "Detekcia incidentov, postupy reakcie a schopnosti hlásenia",
        cz: "Detekce incidentů, postupy reakce a schopnosti hlášení",
      },
      weight: 1.3,
      questions: [
        {
          key: "incident_response_plan",
          question: {
            en: "Do you have a documented incident response plan?",
            sk: "Máte zdokumentovaný plán reakcie na incidenty?",
            cz: "Máte zdokumentovaný plán reakce na incidenty?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "incident_detection",
          question: {
            en: "Do you have automated systems for detecting security incidents?",
            sk: "Máte automatizované systémy na detekciu bezpečnostných incidentov?",
            cz: "Máte automatizované systémy pro detekci bezpečnostních incidentů?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "incident_reporting",
          question: {
            en: "Can you report significant incidents to authorities within 24 hours?",
            sk: "Dokážete nahlásiť významné incidenty úradom do 24 hodín?",
            cz: "Dokážete nahlásit významné incidenty úřadům do 24 hodin?",
          },
          helpText: {
            en: "NIS2 requires early warning within 24 hours and full notification within 72 hours.",
            sk: "NIS2 vyžaduje včasné varovanie do 24 hodín a plné oznámenie do 72 hodín.",
            cz: "NIS2 vyžaduje včasné varování do 24 hodin a plné oznámení do 72 hodin.",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "incident_classification",
          question: {
            en: "Do you have a system for classifying incident severity?",
            sk: "Máte systém na klasifikáciu závažnosti incidentov?",
            cz: "Máte systém pro klasifikaci závažnosti incidentů?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "post_incident_review",
          question: {
            en: "Do you conduct post-incident reviews and lessons learned?",
            sk: "Vykonávate post-incidentné hodnotenia a získané skúsenosti?",
            cz: "Provádíte post-incidentní hodnocení a získané zkušenosti?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "business_continuity",
      title: {
        en: "Business Continuity",
        sk: "Kontinuita Podnikania",
        cz: "Kontinuita Podnikání",
      },
      description: {
        en: "Backup management, disaster recovery, and crisis management",
        sk: "Správa záloh, obnova po havárii a krízový manažment",
        cz: "Správa záloh, obnova po havárii a krizový management",
      },
      weight: 1.1,
      questions: [
        {
          key: "backup_procedures",
          question: {
            en: "Do you have documented backup and recovery procedures?",
            sk: "Máte zdokumentované postupy zálohovania a obnovy?",
            cz: "Máte zdokumentované postupy zálohování a obnovy?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "disaster_recovery",
          question: {
            en: "Is there a tested disaster recovery plan?",
            sk: "Existuje otestovaný plán obnovy po havárii?",
            cz: "Existuje otestovaný plán obnovy po havárii?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "backup_testing",
          question: {
            en: "Are backups regularly tested for integrity and recoverability?",
            sk: "Sú zálohy pravidelne testované na integritu a obnoviteľnosť?",
            cz: "Jsou zálohy pravidelně testovány na integritu a obnovitelnost?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "critical_systems",
          question: {
            en: "Have you identified critical systems and their recovery priorities?",
            sk: "Identifikovali ste kritické systémy a ich priority obnovy?",
            cz: "Identifikovali jste kritické systémy a jejich priority obnovy?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "crisis_communication",
          question: {
            en: "Do you have crisis communication procedures?",
            sk: "Máte postupy krízovej komunikácie?",
            cz: "Máte postupy krizové komunikace?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "supply_chain",
      title: {
        en: "Supply Chain Security",
        sk: "Bezpečnosť Dodávateľského Reťazca",
        cz: "Bezpečnost Dodavatelského Řetězce",
      },
      description: {
        en: "Third-party risk management and supply chain security measures",
        sk: "Riadenie rizík tretích strán a opatrenia bezpečnosti dodávateľského reťazca",
        cz: "Řízení rizik třetích stran a opatření bezpečnosti dodavatelského řetězce",
      },
      weight: 1.0,
      questions: [
        {
          key: "supplier_assessment",
          question: {
            en: "Do you assess the cybersecurity posture of your suppliers?",
            sk: "Hodnotíte stav kybernetickej bezpečnosti vašich dodávateľov?",
            cz: "Hodnotíte stav kybernetické bezpečnosti vašich dodavatelů?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "supplier_contracts",
          question: {
            en: "Do supplier contracts include cybersecurity requirements?",
            sk: "Obsahujú zmluvy s dodávateľmi požiadavky na kybernetickú bezpečnosť?",
            cz: "Obsahují smlouvy s dodavateli požadavky na kybernetickou bezpečnost?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "supplier_monitoring",
          question: {
            en: "Do you monitor supplier security throughout the relationship?",
            sk: "Monitorujete bezpečnosť dodávateľov počas celého vzťahu?",
            cz: "Monitorujete bezpečnost dodavatelů po celou dobu vztahu?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "critical_suppliers",
          question: {
            en: "Have you identified suppliers critical to your operations?",
            sk: "Identifikovali ste dodávateľov kritických pre vaše operácie?",
            cz: "Identifikovali jste dodavatele kritické pro vaše operace?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "supplier_incidents",
          question: {
            en: "Are there procedures for handling supplier security incidents?",
            sk: "Existujú postupy na riešenie bezpečnostných incidentov dodávateľov?",
            cz: "Existují postupy pro řešení bezpečnostních incidentů dodavatelů?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "technical_security",
      title: {
        en: "Technical Security Measures",
        sk: "Technické Bezpečnostné Opatrenia",
        cz: "Technická Bezpečnostní Opatření",
      },
      description: {
        en: "Network security, access control, encryption, and vulnerability management",
        sk: "Sieťová bezpečnosť, riadenie prístupu, šifrovanie a správa zraniteľností",
        cz: "Síťová bezpečnost, řízení přístupu, šifrování a správa zranitelností",
      },
      weight: 1.2,
      questions: [
        {
          key: "access_control",
          question: {
            en: "Do you have role-based access control for critical systems?",
            sk: "Máte riadenie prístupu založené na rolách pre kritické systémy?",
            cz: "Máte řízení přístupu založené na rolích pro kritické systémy?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "encryption",
          question: {
            en: "Is sensitive data encrypted at rest and in transit?",
            sk: "Sú citlivé údaje šifrované v pokoji aj pri prenose?",
            cz: "Jsou citlivá data šifrována v klidu i při přenosu?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "vulnerability_management",
          question: {
            en: "Do you have a vulnerability management program?",
            sk: "Máte program správy zraniteľností?",
            cz: "Máte program správy zranitelností?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "mfa",
          question: {
            en: "Is multi-factor authentication implemented for privileged access?",
            sk: "Je pre privilegovaný prístup implementovaná viacfaktorová autentifikácia?",
            cz: "Je pro privilegovaný přístup implementována vícefaktorová autentizace?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "network_segmentation",
          question: {
            en: "Is your network appropriately segmented?",
            sk: "Je vaša sieť primerane segmentovaná?",
            cz: "Je vaše síť přiměřeně segmentována?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
  ],
};
