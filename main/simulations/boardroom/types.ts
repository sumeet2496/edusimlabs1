
export enum Phase {
  INTRO = 'INTRO',
  LOBBY = 'LOBBY',
  CFO_BRIEF = 'CFO_BRIEF',
  PRESENTATION = 'PRESENTATION',
  INVESTMENT_CONFIG = 'INVESTMENT_CONFIG',
  YEARLY_DECISION = 'YEARLY_DECISION',
  YEARLY_ALLOCATION = 'YEARLY_ALLOCATION',
  FINAL_RESULTS = 'FINAL_RESULTS',
  LEADERBOARD = 'LEADERBOARD'
}

export interface LeaderboardEntry {
  id: string;
  matchId: string;
  ceoName: string;
  country: string;
  npv: number;
  timestamp: number;
}

export interface DecisionLog {
  year: number;
  action: string;
  amountLocal: number;
  fxRate: number;
}

export interface OperatingAssumptions {
  baseYearRevenueLC: number;
  annualGrowthRate: number;
  variableCostRate: number;
  variableCostGrowth: number;
  fixedCostsLC: number;
  depreciationLC: number;
  initialCapexUSD: number;
  maintenanceCapexRate: number;
  workingCapitalRate: number;
  reinvestmentInterestRate: number;
  reinvestmentRate: number;
}

export interface PolicyAssumptions {
  localCorporateTax: number;
  repatriationTax: number;
  capitalControls: boolean;
  forcedReinvestment: boolean;
}

export interface MacroAssumptions {
  spotFX: number;
  expectedDrift: number;
  volatility: number;
  localInflation: number;
}

export interface Country {
  id: string;
  name: string;
  projectName: string;
  projectIcon: string;
  currency: string;
  region: string;
  classification: 'Developed' | 'Emerging' | 'Frontier';
  businessType: string;
  growthProfile: 'Low' | 'Medium' | 'High';
  fxStability: 'Low' | 'Medium' | 'High';
  politicalRisk: 'Low' | 'Medium' | 'High';
  repatriationFriction: 'Low' | 'Medium' | 'High';
  ops: OperatingAssumptions;
  policy: PolicyAssumptions;
  macro: MacroAssumptions;
  localBorrowingRate: number;
}

export interface FinancialRecord {
  year: number;
  calendarYear: number;
  revenue: number;
  variableCosts: number;
  ebitda: number;
  ebit: number;
  interestExpense: number;
  interestIncome: number;
  tax: number;
  netIncome: number;
  localCash: number;
  investedCapital: number;
  workingCapitalReserve: number;
  debtBalance: number;
  fxRate: number;
  repatriatedUSD: number;
  npvUSD: number;
}

export interface FinancialState {
  localCash: number;
  investedCapital: number;
  workingCapitalReserve: number;
  debtBalance: number; 
  repatriatedUSD: number;
  cumulativeTaxPaid: number;
  currentFXRate: number;
  isExited: boolean;
}

export interface Portfolio {
  [countryId: string]: FinancialState;
}

export interface SimState {
  matchId: string;
  year: number;
  calendarYear: number;
  totalRepatriatedUSD: number;
  portfolio: Portfolio;
  allocation: Record<string, number>;
  history: Record<string, FinancialRecord[]>;
}
