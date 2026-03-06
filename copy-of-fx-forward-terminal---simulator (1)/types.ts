
export type Tenor = 'SPOT' | '1M' | '2M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | '4Y' | '5Y';
export type CurrencyPair = 'USD/INR' | 'EUR/INR' | 'GBP/INR' | 'JPY/INR' | 'CHF/INR' | 'CAD/INR';

export interface Quote {
  bid: number;
  ask: number;
}

export interface PairData {
  spot: Quote;
  m1: Quote;
  m2: Quote;
  m3: Quote;
  oneMonthForward: Quote;
  threeMonthForward: Quote;
  sixMonthForward: Quote;
  oneYearForward: Quote;
  twoYearForward: Quote;
  threeYearForward: Quote;
  fourYearForward: Quote;
  fiveYearForward: Quote;
  oneMonthPoints: Quote;
  threeMonthPoints: Quote;
  history: number[];
  rates: {
    domestic: number;
    foreign: number;
  };
}

export interface MarketEvent {
  time: string;
  event: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MarketData {
  pairs: Record<CurrencyPair, PairData>;
  timestamp: Date;
  calendar: MarketEvent[];
  fullCurves: Record<CurrencyPair, Quote[]>;
}

export enum ClientType {
  IMPORTER = 'IMPORTER',
  EXPORTER = 'EXPORTER'
}

export interface ClientPersona {
  role: string;
  attitude: string;
  technicalExpertise: 'NOVICE' | 'COMPETENT' | 'EXPERT';
  negotiationStrategy: string;
  backstory: string;
  vocabulary: string[];
}

export interface ClientScenario {
  id: number;
  name: string;
  type: ClientType;
  exposure: 'RECEIVABLE' | 'PAYABLE';
  amount: number;
  tenor: Tenor;
  pair: CurrencyPair;
  description: string;
  persona: ClientPersona;
}

export interface Trade {
  id: string;
  scenarioId?: number;
  pair: CurrencyPair;
  side: 'BUY' | 'SELL';
  amount: number;
  rate: number;
  tenor: Tenor;
  timestamp: Date;
  status: 'OPEN' | 'CLOSED' | 'ACCEPTED';
  maturityMonth: number;
  closingHedgeId?: string; // Links a spot trade to a specific open forward
}

export interface SettlementResult {
  trade: Trade;
  actualCashSettlement: number;
  finalSpot: number;
  isCorrect: boolean;
}

export interface AccountEntry {
  id: string;
  scenarioId?: number;
  timestamp: Date;
  description: string;
  amountCcy: number;
  ccy: string;
  rate: number;
  amountInr: number;
  type: 'HEDGE_SETTLEMENT' | 'BUSINESS_FLOW' | 'MARGIN_PAYMENT';
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export type MainTab = 'QUOTES' | 'PORTFOLIO' | 'BANK' | 'LEDGER';

export interface AppState {
  currentScenarioIndex: number;
  market: MarketData;
  activeTab: MainTab;
  isChatOpen: boolean;
  chatHistory: ChatHistoryItem[];
  simulatedMonths: number;
  selectedPair: CurrencyPair;
  isConfirmed: boolean;
  realizedPnl: number;
  totalCommissions: number;
  clientAccount: AccountEntry[];
  businessFlowsPending: number[];
  completedScenarioIds: number[];
  settledScenarioIds: number[];
  isQuoteValidated: boolean;
}
