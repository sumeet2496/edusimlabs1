
import { RFQ, DecisionResult, MarketData, ClientPersona } from '../types';

export class DecisionEngine {
  static evaluateQuote(rfq: RFQ, userQuote: number, market: MarketData): DecisionResult {
    const mid = market.curves[rfq.ccy1]?.rates[rfq.tenor] || 0.05;
    let targetSpread = 0;

    // Commission logic based on persona
    let commissionRate = 0;
    if (rfq.clientType === ClientPersona.HEDGE_FUND) commissionRate = 0.00005; // 0.5bps
    if (rfq.clientType === ClientPersona.CORPORATE) commissionRate = 0.0001; // 1bp
    if (rfq.clientType === ClientPersona.INTERDEALER) commissionRate = 0.00002; // 0.2bps

    switch (rfq.requiredConcept) {
      case 'CREDIT_BBB': targetSpread = market.creditSpreads['BBB']; break;
      case 'CREDIT_A': targetSpread = market.creditSpreads['A']; break;
      case 'CREDIT_AA': targetSpread = market.creditSpreads['AA']; break;
      case 'LIQUIDITY_HIGH': targetSpread = market.liquidityPremiums['High']; break;
      case 'LIQUIDITY_STD': targetSpread = market.liquidityPremiums['Standard']; break;
      case 'LIQUIDITY_LOW': targetSpread = market.liquidityPremiums['Low']; break;
      case 'SOVEREIGN_RISK': targetSpread = market.sovereignRisk[rfq.ccy1]; break;
      case 'SPREAD_DISCOUNT': targetSpread = -0.000125; break;
      case 'MID_FLAT': targetSpread = 0; break;
      default: targetSpread = 0;
    }

    // Expected rate accounts for market mid + the specific risk adjustment
    const expectedRate = mid + targetSpread;
    const errorBps = Math.abs(userQuote - expectedRate) * 10000;
    
    // Tolerance is 0.5 bps
    const executed = errorBps < 0.5;

    let message = '';
    let trustImpact = 0;
    let bossImpact = 0;

    if (!executed) {
      message = errorBps > 2.0 
        ? "Client rejected: 'Your level is way off the risk-adjusted mid.'" 
        : "Client rejected: 'Almost there, but your spread calculation is slightly inaccurate.'";
      trustImpact = -10;
      bossImpact = -5;
    } else {
      message = "Trade Confirmed. Booking at your level.";
      trustImpact = 12;
      bossImpact = 8;
    }

    return {
      executed,
      pricingErrorBps: errorBps,
      latencySeconds: rfq.initialExpiry - rfq.expiry,
      pnlImpact: executed ? (targetSpread * rfq.notional * 0.1) : 0, // Simplified PnL impact
      commission: executed ? (commissionRate * rfq.notional) : 0,
      trustImpact,
      bossSatisfactionImpact: bossImpact,
      message
    };
  }
}
