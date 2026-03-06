
import { KPIs, Trade, RiskMetrics, RFQ } from '../types';

export class KPIEngine {
  static calculateComposite(prev: KPIs, trades: Trade[], risk: RiskMetrics): KPIs {
    // Weights: PnL 40%, Trust 20%, Boss 20%, Risk 10%, Ops 5%, Judgment 5%
    
    // Risk Compliance logic
    let riskScore = 100 - (risk.limitBreaches.length * 20);
    
    // Strategic Judgment - simplified
    const totalPnl = trades.reduce((acc, t) => acc + t.mtm + t.realizedPnl + t.carryPnl, 0);
    const realized = trades.reduce((acc, t) => acc + t.realizedPnl, 0);
    const unrealized = trades.reduce((acc, t) => acc + t.mtm, 0);
    const carry = trades.reduce((acc, t) => acc + t.carryPnl, 0);
    
    const judgmentScore = Math.min(100, 70 + (realized > 0 ? 10 : -10));

    // Market Reputation is driven by PnL consistency and quote hit ratio
    const marketRep = Math.min(100, 75 + (realized / 500000) * 10);

    const composite = (
      (Math.min(100, Math.max(0, 50 + realized / 100000)) * 0.4) +
      (prev.clientTrust * 0.2) +
      (prev.bossSatisfaction * 0.2) +
      (riskScore * 0.1) +
      (prev.operationalAccuracy * 0.05) +
      (judgmentScore * 0.05)
    );

    return {
      ...prev,
      pnl: totalPnl,
      realizedPnl: realized,
      unrealizedPnl: unrealized,
      carry: carry,
      riskCompliance: riskScore,
      strategicJudgment: judgmentScore,
      marketReputation: marketRep,
      compositeScore: composite
    };
  }
}
