
import { ClientScenario, ClientType, CurrencyPair } from './types';

export const INITIAL_PAIRS: Record<CurrencyPair, { spot: number; domesticRate: number; foreignRate: number }> = {
  'USD/INR': { spot: 83.50, domesticRate: 7.00, foreignRate: 4.50 },
  'EUR/INR': { spot: 92.20, domesticRate: 9.20, foreignRate: 3.50 },
  'GBP/INR': { spot: 108.40, domesticRate: 7.00, foreignRate: 5.00 },
  'JPY/INR': { spot: 0.5510, domesticRate: 7.00, foreignRate: 0.10 },
  'CHF/INR': { spot: 94.80, domesticRate: 7.00, foreignRate: 1.50 },
  'CAD/INR': { spot: 61.20, domesticRate: 7.00, foreignRate: 4.75 }
};

export interface ExtendedScenario extends ClientScenario {
  startMonth: number;
}

export const SCENARIOS: ExtendedScenario[] = [
  {
    id: 1,
    startMonth: 0,
    name: "Sun Pharma Exports",
    type: ClientType.EXPORTER,
    exposure: 'RECEIVABLE',
    amount: 300000,
    tenor: '1M',
    pair: 'USD/INR',
    description: "Inward remittance of USD 300k expected in February. Need to hedge the receivable.",
    persona: { role: "Treasurer", attitude: "Direct", technicalExpertise: "COMPETENT", negotiationStrategy: "Price sensitive", backstory: "Pharma treasury.", vocabulary: ["receivable", "inward", "hedge"] }
  },
  {
    id: 2,
    startMonth: 2,
    name: "Britannia Engineering",
    type: ClientType.EXPORTER,
    exposure: 'RECEIVABLE',
    amount: 420000,
    tenor: '2M',
    pair: 'GBP/INR',
    description: "GBP inflows confirmed for May. Quote best forward bid.",
    persona: { role: "Finance Head", attitude: "Professional", technicalExpertise: "EXPERT", negotiationStrategy: "Aggressive", backstory: "Quarterly planner.", vocabulary: ["inflows", "quarter"] }
  },
  {
    id: 3,
    startMonth: 5,
    name: "Eurotech Machinery",
    type: ClientType.IMPORTER,
    exposure: 'PAYABLE',
    amount: 1100000,
    tenor: '3M',
    pair: 'EUR/INR',
    description: "Import obligation for precision tools due in September. Need to lock the payable cost.",
    persona: { role: "Ops Manager", attitude: "Cautious", technicalExpertise: "NOVICE", negotiationStrategy: "Firm", backstory: "Heavy machinery imports.", vocabulary: ["obligation", "cost lock"] }
  },
  {
    id: 4,
    startMonth: 9,
    name: "Nippon Auto India",
    type: ClientType.IMPORTER,
    exposure: 'PAYABLE',
    amount: 38000000,
    tenor: '1M',
    pair: 'JPY/INR',
    description: "Yen payable for auto-components due in October. Shipment arriving soon.",
    persona: { role: "Supply Chain Head", attitude: "Urgent", technicalExpertise: "COMPETENT", negotiationStrategy: "Analytic", backstory: "Auto parts logistics.", vocabulary: ["shipment", "payable"] }
  },
  {
    id: 5,
    startMonth: 11,
    name: "Cloudstack Systems",
    type: ClientType.EXPORTER,
    exposure: 'RECEIVABLE',
    amount: 1750000,
    tenor: '1M',
    pair: 'USD/INR',
    description: "Software service receivables in USD due in December.",
    persona: { role: "CFO", attitude: "Strategic", technicalExpertise: "EXPERT", negotiationStrategy: "Tough", backstory: "IT Services revenue.", vocabulary: ["receivables", "revenue"] }
  }
];
