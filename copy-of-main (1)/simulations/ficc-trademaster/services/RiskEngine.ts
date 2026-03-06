
import { Trade, MarketData, Currency, RiskMetrics } from '../types';
import { PricingEngine } from './PricingEngine';

export class RiskEngine {
  private static LIMITS = {
    DV01: 100000, // Aggregate 100K
    FX_DELTA: 50000000, // 50M
  };

  static calculateMetrics(trades: Trade[], market: MarketData): RiskMetrics {
    const dv01ByCcy: Record<Currency, number> = {
      [Currency.USD]: 0, [Currency.EUR]: 0, [Currency.INR]: 0, [Currency.JPY]: 0
    };
    const totalDelta: Record<Currency, number> = {
      [Currency.USD]: 0, [Currency.EUR]: 0, [Currency.INR]: 0, [Currency.JPY]: 0
    };
    
    let totalDV01 = 0;
    let breaches: string[] = [];

    trades.forEach(t => {
      // Aggregate DV01
      const tradeDV01 = t.dv01;
      dv01ByCcy[t.currency1] += tradeDV01;
      totalDV01 += tradeDV01;

      // Simple Delta logic: Notional exposure to CCY2 if FX Forward
      if (t.currency2) {
        totalDelta[t.currency2] += t.notional;
      }
    });

    if (Math.abs(totalDV01) > this.LIMITS.DV01) {
      breaches.push(`DV01 Limit Breach: ${totalDV01.toFixed(0)} > ${this.LIMITS.DV01}`);
    }

    return {
      totalDV01,
      dv01ByCcy,
      totalDelta,
      basisExposure: 0,
      var95: Math.abs(totalDV01) * 2.33 * 1.5, // Simplified VaR: DV01 * Z * Vol
      limitBreaches: breaches
    };
  }
}
