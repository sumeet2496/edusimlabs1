
import { MarketData, PairData, Quote, CurrencyPair, Tenor } from '../types';
import { INITIAL_PAIRS } from '../constants';

export class MarketEngine {
  private currentData: Record<CurrencyPair, PairData>;
  private fullCurves: Record<CurrencyPair, Quote[]>;
  private spotMids: Record<CurrencyPair, number>;
  private interestRates: Record<CurrencyPair, { domestic: number; foreign: number }>;

  constructor() {
    this.currentData = {} as any;
    this.fullCurves = {} as any;
    this.spotMids = {} as any;
    this.interestRates = {} as any;

    (Object.keys(INITIAL_PAIRS) as CurrencyPair[]).forEach(pair => {
      this.spotMids[pair] = INITIAL_PAIRS[pair].spot;
      this.interestRates[pair] = {
        domestic: INITIAL_PAIRS[pair].domesticRate,
        foreign: INITIAL_PAIRS[pair].foreignRate
      };
      this.fullCurves[pair] = this.calculateFullCurve(pair);
      this.currentData[pair] = this.mapCurveToPairData(pair);
    });
  }

  private calculateFullCurve(pair: CurrencyPair): Quote[] {
    const spotMid = this.spotMids[pair];
    const { domestic, foreign } = this.interestRates[pair];
    const spreadBase = pair === 'JPY/INR' ? 0.0010 : 0.0400; 
    const curve: Quote[] = [];

    for (let m = 0; m <= 60; m++) {
      const t = m / 12;
      // F = S * (1 + rd*t) / (1 + rf*t)
      const mid = spotMid * (1 + (domestic / 100) * t) / (1 + (foreign / 100) * t);
      
      curve.push({
        bid: Number((mid - spreadBase / 2).toFixed(4)),
        ask: Number((mid + spreadBase / 2).toFixed(4))
      });
    }
    return curve;
  }

  private mapCurveToPairData(pair: CurrencyPair): PairData {
    const curve = this.fullCurves[pair];
    const spot = curve[0];
    const m1 = curve[1];
    const m3 = curve[3];
    const m6 = curve[6];
    const y1 = curve[12];

    return {
      spot: { ...spot },
      m1: { ...m1 },
      m2: { ...curve[2] },
      m3: { ...m3 },
      oneMonthForward: { ...m1 },
      threeMonthForward: { ...m3 },
      sixMonthForward: { ...m6 },
      oneYearForward: { ...y1 },
      twoYearForward: { ...curve[24] },
      threeYearForward: { ...curve[36] },
      fourYearForward: { ...curve[48] },
      fiveYearForward: { ...curve[60] },
      oneMonthPoints: { bid: m1.bid - spot.bid, ask: m1.ask - spot.ask },
      threeMonthPoints: { bid: m3.bid - spot.bid, ask: m3.ask - spot.ask },
      history: this.currentData[pair]?.history || [ (spot.bid + spot.ask) / 2 ],
      rates: { ...this.interestRates[pair] }
    };
  }

  public jump(months: number) {
    (Object.keys(this.spotMids) as CurrencyPair[]).forEach(pair => {
      // Increased volatility for clearer P/L movement
      const volatility = 0.04; 
      const change = 1 + (Math.random() - 0.5) * volatility;
      this.spotMids[pair] *= change;

      // Drift rates
      this.interestRates[pair].domestic += (Math.random() - 0.5) * 0.5;
      this.interestRates[pair].foreign += (Math.random() - 0.5) * 0.2;

      this.fullCurves[pair] = this.calculateFullCurve(pair);
      
      const newData = this.mapCurveToPairData(pair);
      const spotMid = (newData.spot.bid + newData.spot.ask) / 2;
      newData.history = [...(this.currentData[pair].history || []), spotMid].slice(-30);
      this.currentData[pair] = newData;
    });
  }

  public tick(): MarketData {
    // Clone top-level objects to ensure React change detection
    const pairsClone = {} as any;
    (Object.keys(this.currentData) as CurrencyPair[]).forEach(p => {
        pairsClone[p] = { ...this.currentData[p] };
    });

    return {
      pairs: pairsClone,
      timestamp: new Date(),
      calendar: [
        { time: '10:00', event: 'RBI Policy Meet', impact: 'HIGH' },
        { time: '14:30', event: 'US CPI Data', impact: 'HIGH' }
      ],
      fullCurves: { ...this.fullCurves }
    };
  }

  public getQuote(pair: CurrencyPair, tenor: Tenor): Quote {
    const curve = this.fullCurves[pair];
    const tenorMap: Record<string, number> = { 'SPOT': 0, '1M': 1, '2M': 2, '3M': 3, '6M': 6, '1Y': 12 };
    const index = tenorMap[tenor] || 0;
    return curve[index] ? { ...curve[index] } : { ...curve[0] };
  }
}
