
import { MarketData, Currency, YieldCurve, FXRate, Tenor, MacroEvent, EventCategory } from '../types';

export class MarketEngine {
  private static KAPPA = 0.15;
  private static SIGMA_R = 0.0012;
  private static SIGMA_FX = 0.005;

  static getInitialMarket(): MarketData {
    return {
      timestamp: Date.now(),
      volRegime: 'normal',
      activeEvent: null,
      curves: {
        [Currency.USD]: this.createCurve(Currency.USD, 0.045),
        [Currency.EUR]: this.createCurve(Currency.EUR, 0.032),
        [Currency.INR]: this.createCurve(Currency.INR, 0.071),
        [Currency.JPY]: this.createCurve(Currency.JPY, 0.001),
      },
      fx: {
        'EUR/USD': this.createFXRate('EUR/USD', 1.0852),
        'USD/INR': this.createFXRate('USD/INR', 83.12),
        'USD/JPY': this.createFXRate('USD/JPY', 151.22),
      },
      basisSpreads: { 'USDINR': -0.0025, 'EURUSD': -0.0005 },
      creditSpreads: { 'AAA': 0.0025, 'AA': 0.0050, 'A': 0.0125, 'BBB': 0.0350 },
      liquidityPremiums: { 'Low': 0.0005, 'Standard': 0.0015, 'High': 0.0045 },
      sovereignRisk: { [Currency.USD]: 0, [Currency.EUR]: 0.0005, [Currency.INR]: 0.0215, [Currency.JPY]: 0.0002 }
      // Removed duplicate timestamp property
    };
  }

  private static createCurve(ccy: Currency, base: number): YieldCurve {
    return {
      currency: ccy,
      rates: {
        '1M': base - 0.005, '3M': base - 0.002, '6M': base,
        '1Y': base + 0.002, '2Y': base + 0.005, '5Y': base + 0.008,
        '10Y': base + 0.012, '30Y': base + 0.015
      }
    };
  }

  private static createFXRate(pair: string, spot: number): FXRate {
    return {
      pair, bid: spot, ask: spot + (spot * 0.0002), change: 0,
      forwardPoints: { '1M': 10, '3M': 35, '6M': 80, '1Y': 180, '2Y': 400, '5Y': 1100, '10Y': 2500, '30Y': 8000 }
    };
  }

  static evolve(current: MarketData): MarketData {
    const next = JSON.parse(JSON.stringify(current)) as MarketData;
    next.timestamp = Date.now();
    const dt = 1 / 252;

    if (!next.activeEvent && Math.random() > 0.99) {
      next.activeEvent = {
        id: 'EVT-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        category: EventCategory.MACRO,
        title: "FED HAWKISH PIVOT",
        impact: "high",
        description: "Unexpected inflation data drives US yield curve higher.",
        startTime: next.timestamp,
        duration: 15,
        impactParams: { shiftUSD: 0.0025 }
      };
    }

    Object.keys(next.curves).forEach((ccy) => {
      const curve = next.curves[ccy as Currency];
      const theta = ccy === Currency.USD ? 0.05 : (ccy === Currency.INR ? 0.075 : 0.03);
      
      Object.keys(curve.rates).forEach((tenor) => {
        const key = tenor as Tenor;
        const r = curve.rates[key];
        const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt);
        let dr = this.KAPPA * (theta - r) * dt + this.SIGMA_R * dW;
        
        if (next.activeEvent?.title === "FED HAWKISH PIVOT" && ccy === Currency.USD) {
          dr += 0.0004;
        }
        curve.rates[key] += dr;
      });
    });

    Object.keys(next.fx).forEach((pair) => {
      const fx = next.fx[pair];
      const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt);
      const move = fx.bid * this.SIGMA_FX * dW;
      fx.bid += move;
      fx.ask = fx.bid * 1.0002;
      fx.change = move / fx.bid;

      const ccy1 = pair.split('/')[0] as Currency;
      const ccy2 = pair.split('/')[1] as Currency;
      
      Object.keys(fx.forwardPoints).forEach((tenor) => {
        const t = this.tenorToYear(tenor as Tenor);
        const r1 = next.curves[ccy1].rates[tenor as Tenor];
        const r2 = next.curves[ccy2].rates[tenor as Tenor];
        const f = fx.bid * (1 + r2 * t) / (1 + r1 * t);
        fx.forwardPoints[tenor as Tenor] = (f - fx.bid) * 10000;
      });
    });

    if (next.activeEvent) {
      next.activeEvent.duration--;
      if (next.activeEvent.duration <= 0) next.activeEvent = null;
    }

    return next;
  }

  private static tenorToYear(tenor: Tenor): number {
    const map: Record<Tenor, number> = { '1M': 1/12, '3M': 0.25, '6M': 0.5, '1Y': 1, '2Y': 2, '5Y': 5, '10Y': 10, '30Y': 30 };
    return map[tenor];
  }
}
