
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  INR = 'INR',
  JPY = 'JPY'
}

export type Tenor = '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | '10Y' | '30Y';

export interface YieldCurve {
  currency: Currency;
  rates: Record<Tenor, number>;
}

export interface FXRate {
  pair: string;
  bid: number;
  ask: number;
  change: number;
  forwardPoints: Record<Tenor, number>;
}

export enum ClientPersona {
  HEDGE_FUND = 'HEDGE_FUND',
  CORPORATE = 'CORPORATE',
  INTERDEALER = 'INTERDEALER',
  ASSET_MANAGER = 'ASSET_MANAGER',
  SOVEREIGN = 'SOVEREIGN'
}

export enum EventCategory {
  MACRO = 'MACRO',
  CREDIT = 'CREDIT',
  LIQUIDITY = 'LIQUIDITY',
  REGULATORY = 'REGULATORY',
  BOSS_INSTRUCTION = 'BOSS_INSTRUCTION',
  CLIENT_ESCALATION = 'CLIENT_ESCALATION'
}

export interface MacroEvent {
  id: string;
  category: EventCategory;
  title: string;
  impact: string;
  description: string;
  startTime: number;
  duration: number;
  impactParams: Record<string, any>;
}

export interface MarketData {
  curves: Record<Currency, YieldCurve>;
  fx: Record<string, FXRate>;
  basisSpreads: Record<string, number>;
  creditSpreads: Record<string, number>;
  liquidityPremiums: Record<string, number>;
  sovereignRisk: Record<string, number>;
  timestamp: number;
  volRegime: 'normal' | 'stressed';
  activeEvent: MacroEvent | null;
}

export enum TradeType {
  IRS = 'IRS',
  CCS = 'CCS',
  FX_FORWARD = 'FX_FORWARD',
  BOND = 'BOND',
  FUTURE = 'FUTURE'
}

export enum DifficultyLevel {
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3
}

export interface RFQ {
  id: string;
  client: string;
  clientType: ClientPersona;
  type: TradeType;
  ccy1: Currency;
  ccy2?: Currency;
  side: 'BUY' | 'SELL';
  notional: number;
  tenor: Tenor;
  expiry: number;
  initialExpiry: number;
  spreadSensitivity: number;
  scenario: string;
  message: string;
  status: 'PENDING' | 'QUOTED' | 'EVALUATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  userQuote?: number;
  targetSpreadBps?: number;
  requiredConcept?: string;
  commission?: number;
}

export interface Trade {
  id: string;
  type: TradeType;
  currency1: Currency;
  currency2?: Currency;
  notional: number;
  fixedRate?: number;
  entryRate: number;
  maturityDate: string;
  entryDate: string;
  mtm: number;
  realizedPnl: number;
  carryPnl: number;
  commission: number;
  dv01: number;
  delta: number;
  counterparty: string;
  clientType: ClientPersona;
}

export interface RiskMetrics {
  totalDV01: number;
  dv01ByCcy: Record<Currency, number>;
  totalDelta: Record<Currency, number>;
  basisExposure: number;
  var95: number;
  limitBreaches: string[];
}

export interface KPIs {
  pnl: number;
  realizedPnl: number;
  unrealizedPnl: number;
  carry: number;
  commissionEarned: number;
  clientTrust: number;
  bossSatisfaction: number;
  marketReputation: number;
  riskCompliance: number;
  operationalAccuracy: number;
  strategicJudgment: number;
  compositeScore: number;
}

export type TerminalView = 'MKT' | 'TBT' | 'RISK' | 'PNL' | 'HEDGE' | 'NEWS';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  type: 'CLIENT' | 'SYSTEM' | 'BOSS';
}

export interface SimulationState {
  market: MarketData;
  trades: Trade[];
  pendingTrades: RFQ[]; 
  rfqs: RFQ[];
  risk: RiskMetrics;
  kpis: KPIs;
  events: string[];
  chatHistory: ChatMessage[];
  currentView: TerminalView;
  difficulty: DifficultyLevel;
  hintsEnabled: boolean;
  isChatMinimized: boolean;
}

export interface DecisionResult {
  executed: boolean;
  pricingErrorBps: number;
  latencySeconds: number;
  pnlImpact: number;
  commission: number;
  trustImpact: number;
  bossSatisfactionImpact: number;
  message: string;
}
