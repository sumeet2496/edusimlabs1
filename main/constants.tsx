
import React from 'react';
import {
  Calculator,
  Briefcase,
  TrendingUp,
  Globe,
  ShieldAlert,
  BarChart3,
  Building2,
  CircleDollarSign,
  Layers,
  Gavel,
  Zap,
  Target,
  Users,
  RefreshCw,
  Trophy,
  GitBranch,
  BarChart4,
  Activity,
  Workflow
} from 'lucide-react';
import { SimulationCategory, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Simulations', href: 'simulations' },
  { label: 'Capabilities', href: 'capabilities' },
  { label: 'Enterprise', href: 'enterprise' },
  { label: 'Contact', href: 'contact' },
];

const createSims = (titles: string[]) => titles.map(t => ({
  id: t.toLowerCase().replace(/\s+/g, '-'),
  title: t,
  description: `High-fidelity institutional simulation focused on ${t}. participants must navigate complex variables and regulatory constraints to achieve optimal outcomes.`
}));

export const SIMULATION_CATEGORIES: SimulationCategory[] = [
  {
    id: 'integrated-terminals',
    title: 'Integrated Terminals',
    description: 'High-fidelity, active simulation environments connected to standalone institutional terminals.',
    icon: 'Zap',
    subtopics: ['FX Terminal', 'Boardroom', 'FICC Trading'],
    simulations: [
      {
        id: 'fx-forward-terminal',
        title: 'FX Forward Terminal Simulator',
        description: 'Master FX forward hedging, margin utilization, and corporate mandates in this institutional bank terminal simulator.',
        internalRoute: '/fx-forward'
      },
      {
        id: 'multiplayer-boardroom',
        title: 'Multiplayer Boardroom - Global Capital',
        description: 'Maximize NPV in a deterministic global market. Compete against peers in this strategic capital allocation simulation.',
        internalRoute: '/boardroom'
      },
      {
        id: 'ficc-trademaster-pro',
        title: 'FICC Trademaster Pro',
        description: 'Navigate liquid markets, manage RFQs, and maintain desk P&L in this high-fidelity FICC trading terminal.',
        internalRoute: '/ficc-trademaster'
      }
    ]
  },
  {
    id: 'accounting',
    title: 'Financial Accounting',
    description: 'Master the three statements through dynamic, interactive ledger systems.',
    icon: 'Calculator',
    subtopics: ['Financial Reporting', 'Audit Trails', 'Cash Flow'],
    simulations: createSims([
      "Prepare 3 financial statements", "Cash vs profit simulation", "Working capital cycle",
      "Revenue recognition", "Cost control decisions", "Depreciation impact",
      "Inventory accounting", "Cash flow forecasting", "Financial distress", "Earnings quality"
    ])
  },
  {
    id: 'corp-fin',
    title: 'Corporate Finance',
    description: 'Solve real-world capital budgeting and working capital dilemmas.',
    icon: 'Briefcase',
    subtopics: ['Capital Budgeting', 'Dividends', 'WACC'],
    simulations: createSims([
      "Capital budgeting decision", "WACC calculation", "Debt–equity mix",
      "Dividend policy", "Leverage impact", "Capital rationing",
      "Project finance", "Dividend signaling", "Share buyback", "Agency problems"
    ])
  },
  {
    id: 'investment',
    title: 'Investment Analysis',
    description: 'Quantitative portfolio construction and performance attribution.',
    icon: 'TrendingUp',
    subtopics: ['Alpha Gen', 'Fixed Income', 'Equities'],
    simulations: createSims([
      "Equity valuation", "Bond valuation", "Portfolio construction",
      "Risk–return tradeoff", "Beta estimation", "Mutual fund mgmt",
      "Factor investing", "Portfolio rebalancing", "Performance attribution", "Active vs passive"
    ])
  },
  {
    id: 'markets',
    title: 'Financial Markets',
    description: 'Simulated order books and trading floors for global asset classes.',
    icon: 'Globe',
    subtopics: ['Microstructure', 'Arbitrage', 'FX'],
    simulations: createSims([
      "Stock market trading", "Bond yield movement", "IPO pricing",
      "Market crash response", "Trading strategies", "Market microstructure",
      "Market liquidity", "Market efficiency", "Algo trading basics", "Circuit breaker event"
    ])
  },
  {
    id: 'risk',
    title: 'Risk Management',
    description: 'Stress test portfolios against historical and synthetic black swan events.',
    icon: 'ShieldAlert',
    subtopics: ['VaR', 'Credit Risk', 'Hedging'],
    simulations: createSims([
      "Market risk simulation", "Credit risk scoring", "Liquidity risk stress",
      "VaR estimation", "Stress testing", "Scenario analysis",
      "Risk mitigation", "Operational risk", "Hedging decision", "Risk-adjusted return"
    ])
  },
  {
    id: 'valuation',
    title: 'Valuation & M&A',
    description: 'Complex LBO models and DCF transaction comps for IB rigor.',
    icon: 'BarChart3',
    subtopics: ['LBO', 'M&A Accretion', 'DCF'],
    simulations: createSims([
      "DCF valuation", "Comparable valuation", "Precedent transactions",
      "Synergy estimation", "Acquisition pricing", "Deal structuring",
      "LBO modeling", "Merger negotiation", "Post-merger integration", "Valuation sensitivity"
    ])
  },
  {
    id: 'banking',
    title: 'Banking & FI',
    description: 'Manage commercial bank balance sheets under Basel III constraints.',
    icon: 'Building2',
    subtopics: ['ALM Strategy', 'Capital Ratios', 'Lending'],
    simulations: createSims([
      "Bank balance sheet mgmt", "Loan appraisal process", "NPA recognition",
      "CASA management", "Credit approval", "Basel norms",
      "Treasury operations", "Asset–liability mgmt", "Loan restructuring", "Securitization"
    ])
  },
  {
    id: 'intl-fin',
    title: 'International Finance',
    description: 'Navigate cross-border capital flows and multi-currency exposure.',
    icon: 'Layers',
    subtopics: ['Currency Risk', 'Transfer Pricing', 'Sovereign'],
    simulations: createSims([
      "FX spot trading", "FX forward hedging", "Interest rate parity",
      "Currency arbitrage", "Balance of payments", "Currency exposure",
      "FX swap", "Central bank policy", "Currency crisis", "Trade finance"
    ])
  },
  {
    id: 'derivatives',
    title: 'Derivatives',
    description: 'Black-Scholes modeling and complex hedging strategies with Greeks.',
    icon: 'CircleDollarSign',
    subtopics: ['Options', 'Futures', 'Exotics'],
    simulations: createSims([
      "Forward contract pricing", "Futures trading", "Options payoff",
      "Options hedging", "Greeks analysis", "Swap valuation",
      "Interest rate swap", "Credit derivatives", "Margin management", "Exotic options"
    ])
  },
  {
    id: 'ethics',
    title: 'Ethics & Governance',
    description: 'Navigate high-stakes corporate governance and compliance scenarios.',
    icon: 'Gavel',
    subtopics: ['Board Ethics', 'ESG', 'Compliance'],
    simulations: createSims([
      "Insider trading case", "Accounting manipulation", "Conflict of interest",
      "Governance failure", "Whistleblower case", "Insider compliance",
      "Regulatory penalty", "Ethical dilemma", "ESG violation", "Corporate fraud"
    ])
  }
];

export const PLATFORM_CAPABILITIES = [
  {
    title: "Real-time Decision Impact",
    desc: "Proprietary simulation engine updates balance sheets and market indicators instantly based on user inputs.",
    icon: <RefreshCw className="w-5 h-5" />
  },
  {
    title: "Auto-scoring & Feedback",
    desc: "Instant quantitative assessment against professional benchmarks with detailed variance analysis.",
    icon: <Trophy className="w-5 h-5" />
  },
  {
    title: "Scenario Branching",
    desc: "Dynamic decision trees where early strategic choices fundamentally shift the simulation's trajectory.",
    icon: <GitBranch className="w-5 h-5" />
  },
  {
    title: "Financial Modeling Logic",
    desc: "Underlying Excel-compatible math engine ensures simulation fidelity to real-world accounting principles.",
    icon: <Calculator className="w-5 h-5" />
  },
  {
    title: "Instructor Dashboards",
    desc: "Full oversight of cohort progress with the ability to inject live 'Black Swan' events into active sessions.",
    icon: <BarChart4 className="w-5 h-5" />
  },
  {
    title: "Performance Analytics",
    desc: "Deep-dive metrics on student decision-making speed, risk tolerance, and technical accuracy.",
    icon: <Activity className="w-5 h-5" />
  },
  {
    title: "Case-Based Flow",
    desc: "Curated learning paths that combine technical tasks with narrative-driven executive challenges.",
    icon: <Workflow className="w-5 h-5" />
  }
];

export const SAMPLE_SIMULATIONS = [
  {
    title: "DCF Valuation Simulator",
    description: "Interactive multi-stage DCF modeling with dynamic sensitivity tables.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Market Crash Response",
    description: "Real-time crisis management simulation during a liquidity event.",
    image: "https://images.unsplash.com/photo-1611974715853-26d30574299a?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "LBO Modeling",
    description: "Build a leveraged buyout model from scratch including debt scheduling.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "FX Hedging Lab",
    description: "Manage global currency exposure using forwards, swaps, and options.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Credit Risk Engine",
    description: "Analyze borrower defaults and calculate credit spread adjustments.",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Insider Trading Case",
    description: "Navigate a regulatory compliance ethics simulation involving MNPI.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
  }
];

export const AUDIENCE_SEGMENTS = [
  { label: "Students", icon: <Users />, desc: "Bridge the gap between textbooks and the desk." },
  { label: "Universities", icon: <Building2 />, desc: "Deploy institutional-grade technical labs." },
  { label: "Corporates", icon: <Briefcase />, desc: "Accelerate professional development cycles." },
  { label: "Training Institutes", icon: <Target />, desc: "Add high-fidelity practical assessments." }
];

export const getIcon = (iconName: string) => {
  const props = { className: "w-6 h-6" };
  switch (iconName) {
    case 'Calculator': return <Calculator {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'BarChart3': return <BarChart3 {...props} />;
    case 'Building2': return <Building2 {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'CircleDollarSign': return <CircleDollarSign {...props} />;
    case 'Gavel': return <Gavel {...props} />;
    default: return <Zap {...props} />;
  }
};
