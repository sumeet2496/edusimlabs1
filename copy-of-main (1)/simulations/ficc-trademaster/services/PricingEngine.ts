
import { MarketData, Trade, TradeType, Currency, Tenor } from '../types';

export class PricingEngine {
  
  static calculateDV01(trade: Trade): number {
    const notional = trade.notional;
    const years = 5; 
    return notional * years * 0.0001;
  }

  static calculateMtM(trade: Trade, market: MarketData): number {
    if (trade.type === TradeType.IRS) {
      const curve = market.curves[trade.currency1];
      const mid = curve.rates['5Y'];
      const spread = (trade.fixedRate || mid) - mid;
      return trade.notional * spread * 4.5; // Simplified annuity
    }
    return 0;
  }

  private static tenorToYear(tenor: Tenor): number {
    const map: Record<Tenor, number> = { '1M': 1/12, '3M': 0.25, '6M': 0.5, '1Y': 1, '2Y': 2, '5Y': 5, '10Y': 10, '30Y': 30 };
    return map[tenor];
  }
}
