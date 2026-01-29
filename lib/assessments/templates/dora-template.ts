import { AssessmentTemplateData, standardOptions } from "../types";

export const doraTemplate: AssessmentTemplateData = {
  framework: "DORA",
  version: "1.0",
  categories: [
    {
      key: "ict_risk_management",
      title: {
        en: "ICT Risk Management",
        sk: "Riadenie ICT Rizík",
        cz: "Řízení ICT Rizik",
      },
      description: {
        en: "ICT risk management framework and governance",
        sk: "Rámec riadenia ICT rizík a správa",
        cz: "Rámec řízení ICT rizik a správa",
      },
      weight: 1.3,
      questions: [
        {
          key: "ict_risk_framework",
          question: {
            en: "Do you have a comprehensive ICT risk management framework?",
            sk: "Máte komplexný rámec riadenia ICT rizík?",
            cz: "Máte komplexní rámec řízení ICT rizik?",
          },
          helpText: {
            en: "DORA requires financial entities to establish and maintain a sound ICT risk management framework.",
            sk: "DORA vyžaduje, aby finančné subjekty zaviedli a udržiavali spoľahlivý rámec riadenia ICT rizík.",
            cz: "DORA vyžaduje, aby finanční subjekty zavedly a udržovaly spolehlivý rámec řízení ICT rizik.",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "ict_governance",
          question: {
            en: "Is ICT risk management integrated into overall governance?",
            sk: "Je riadenie ICT rizík integrované do celkového riadenia?",
            cz: "Je řízení ICT rizik integrováno do celkového řízení?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "ict_strategy",
          question: {
            en: "Do you have an ICT strategy aligned with business objectives?",
            sk: "Máte ICT stratégiu zosúladenú s obchodnými cieľmi?",
            cz: "Máte ICT strategii sladěnou s obchodními cíli?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "ict_budget",
          question: {
            en: "Is there adequate budget for ICT security and resilience?",
            sk: "Je dostatočný rozpočet na ICT bezpečnosť a odolnosť?",
            cz: "Je dostatečný rozpočet na ICT bezpečnost a odolnost?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "board_oversight",
          question: {
            en: "Does the management body oversee ICT risk management?",
            sk: "Dohliada riadiaci orgán na riadenie ICT rizík?",
            cz: "Dohlíží řídící orgán na řízení ICT rizik?",
          },
          weight: 1.5,
          options: standardOptions,
        },
      ],
    },
    {
      key: "ict_incident_management",
      title: {
        en: "ICT Incident Management",
        sk: "Riadenie ICT Incidentov",
        cz: "Řízení ICT Incidentů",
      },
      description: {
        en: "ICT-related incident detection, classification, and reporting",
        sk: "Detekcia, klasifikácia a hlásenie incidentov súvisiacich s ICT",
        cz: "Detekce, klasifikace a hlášení incidentů souvisejících s ICT",
      },
      weight: 1.3,
      questions: [
        {
          key: "incident_process",
          question: {
            en: "Do you have a documented ICT-related incident management process?",
            sk: "Máte zdokumentovaný proces riadenia incidentov súvisiacich s ICT?",
            cz: "Máte zdokumentovaný proces řízení incidentů souvisejících s ICT?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "incident_classification",
          question: {
            en: "Do you classify ICT-related incidents according to DORA criteria?",
            sk: "Klasifikujete incidenty súvisiace s ICT podľa kritérií DORA?",
            cz: "Klasifikujete incidenty související s ICT podle kritérií DORA?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "incident_reporting",
          question: {
            en: "Can you report major ICT incidents to competent authorities?",
            sk: "Dokážete hlásiť závažné ICT incidenty príslušným orgánom?",
            cz: "Dokážete hlásit závažné ICT incidenty příslušným orgánům?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "incident_logging",
          question: {
            en: "Do you maintain a log of all ICT-related incidents?",
            sk: "Vedáte záznamy o všetkých incidentoch súvisiacich s ICT?",
            cz: "Vedete záznamy o všech incidentech souvisejících s ICT?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "incident_review",
          question: {
            en: "Do you conduct root cause analysis after major incidents?",
            sk: "Vykonávate analýzu príčin po závažných incidentoch?",
            cz: "Provádíte analýzu příčin po závažných incidentech?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "digital_resilience_testing",
      title: {
        en: "Digital Operational Resilience Testing",
        sk: "Testovanie Digitálnej Prevádzkovej Odolnosti",
        cz: "Testování Digitální Provozní Odolnosti",
      },
      description: {
        en: "Testing program including vulnerability assessments and penetration testing",
        sk: "Testovací program vrátane hodnotení zraniteľností a penetračného testovania",
        cz: "Testovací program včetně hodnocení zranitelností a penetračního testování",
      },
      weight: 1.2,
      questions: [
        {
          key: "testing_program",
          question: {
            en: "Do you have a digital operational resilience testing program?",
            sk: "Máte program testovania digitálnej prevádzkovej odolnosti?",
            cz: "Máte program testování digitální provozní odolnosti?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "vulnerability_scanning",
          question: {
            en: "Do you perform regular vulnerability scans?",
            sk: "Vykonávate pravidelné skenovanie zraniteľností?",
            cz: "Provádíte pravidelné skenování zranitelností?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "penetration_testing",
          question: {
            en: "Do you conduct penetration testing at least annually?",
            sk: "Vykonávate penetračné testovanie aspoň raz ročne?",
            cz: "Provádíte penetrační testování alespoň jednou ročně?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "tlpt",
          question: {
            en: "Have you considered threat-led penetration testing (TLPT)?",
            sk: "Zvažovali ste penetračné testovanie na základe hrozieb (TLPT)?",
            cz: "Zvažovali jste penetrační testování na základě hrozeb (TLPT)?",
          },
          helpText: {
            en: "TLPT is required for significant financial entities under DORA.",
            sk: "TLPT je vyžadované pre významné finančné subjekty podľa DORA.",
            cz: "TLPT je vyžadováno pro významné finanční subjekty podle DORA.",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "testing_follow_up",
          question: {
            en: "Do you remediate findings from resilience testing?",
            sk: "Riešite zistenia z testovania odolnosti?",
            cz: "Řešíte zjištění z testování odolnosti?",
          },
          weight: 1.2,
          options: standardOptions,
        },
      ],
    },
    {
      key: "third_party_risk",
      title: {
        en: "ICT Third-Party Risk Management",
        sk: "Riadenie Rizík ICT Tretích Strán",
        cz: "Řízení Rizik ICT Třetích Stran",
      },
      description: {
        en: "Management of ICT service providers and concentration risk",
        sk: "Správa poskytovateľov ICT služieb a koncentračné riziko",
        cz: "Správa poskytovatelů ICT služeb a koncentrační riziko",
      },
      weight: 1.2,
      questions: [
        {
          key: "provider_register",
          question: {
            en: "Do you maintain a register of all ICT service providers?",
            sk: "Vedáte register všetkých poskytovateľov ICT služieb?",
            cz: "Vedete registr všech poskytovatelů ICT služeb?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "due_diligence",
          question: {
            en: "Do you perform due diligence before engaging ICT providers?",
            sk: "Vykonávate due diligence pred angažovaním poskytovateľov ICT?",
            cz: "Provádíte due diligence před zapojením poskytovatelů ICT?",
          },
          weight: 1.3,
          options: standardOptions,
        },
        {
          key: "contract_requirements",
          question: {
            en: "Do contracts with ICT providers include DORA-required provisions?",
            sk: "Obsahujú zmluvy s poskytovateľmi ICT ustanovenia požadované DORA?",
            cz: "Obsahují smlouvy s poskytovateli ICT ustanovení požadovaná DORA?",
          },
          weight: 1.5,
          options: standardOptions,
        },
        {
          key: "concentration_risk",
          question: {
            en: "Have you assessed concentration risk in ICT service provision?",
            sk: "Zhodnotili ste koncentračné riziko v poskytovaní ICT služieb?",
            cz: "Zhodnotili jste koncentrační riziko v poskytování ICT služeb?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "exit_strategies",
          question: {
            en: "Do you have exit strategies for critical ICT service providers?",
            sk: "Máte exit stratégie pre kritických poskytovateľov ICT služieb?",
            cz: "Máte exit strategie pro kritické poskytovatele ICT služeb?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
    {
      key: "information_sharing",
      title: {
        en: "Information Sharing",
        sk: "Zdieľanie Informácií",
        cz: "Sdílení Informací",
      },
      description: {
        en: "Cyber threat intelligence sharing and information exchange",
        sk: "Zdieľanie informácií o kybernetických hrozbách a výmena informácií",
        cz: "Sdílení informací o kybernetických hrozbách a výměna informací",
      },
      weight: 0.8,
      questions: [
        {
          key: "threat_intelligence",
          question: {
            en: "Do you participate in cyber threat intelligence sharing?",
            sk: "Zúčastňujete sa zdieľania informácií o kybernetických hrozbách?",
            cz: "Účastníte se sdílení informací o kybernetických hrozbách?",
          },
          weight: 1.2,
          options: standardOptions,
        },
        {
          key: "sharing_arrangements",
          question: {
            en: "Have you established information sharing arrangements?",
            sk: "Zaviedli ste dojednania o zdieľaní informácií?",
            cz: "Zavedli jste ujednání o sdílení informací?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "sector_collaboration",
          question: {
            en: "Do you collaborate with sector-specific threat intelligence groups?",
            sk: "Spolupracujete so skupinami spravodajstva o hrozbách špecifických pre sektor?",
            cz: "Spolupracujete se skupinami zpravodajství o hrozbách specifických pro sektor?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "sharing_procedures",
          question: {
            en: "Do you have procedures for sharing incident information?",
            sk: "Máte postupy na zdieľanie informácií o incidentoch?",
            cz: "Máte postupy pro sdílení informací o incidentech?",
          },
          weight: 1.0,
          options: standardOptions,
        },
        {
          key: "confidentiality",
          question: {
            en: "Are there safeguards for confidentiality in information sharing?",
            sk: "Existujú záruky dôvernosti pri zdieľaní informácií?",
            cz: "Existují záruky důvěrnosti při sdílení informací?",
          },
          weight: 1.0,
          options: standardOptions,
        },
      ],
    },
  ],
};
