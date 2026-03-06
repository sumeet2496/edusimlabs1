
import { Trade, MarketData } from '../types';
import { PricingEngine } from './PricingEngine';

export class PnLEngine {
  static calculateCarry(trade: Trade, market: MarketData): number {
    // Carry = (FixedRate - currentFloatRate) * Notional * (1/360)
    // Simplified: 1/360th of the annual spread per tick (simulating daily carry)
    const curve = market.curves[trade.currency1];
    const floatRate = curve.rates['1M']; // Using 1M as float proxy
    const spread = (trade.fixedRate || 0) - floatRate;
    return (trade.notional * spread) / 360;
  }

  static updateTradePnl(trade: Trade, market: MarketData): Trade {
    const unrealized = PricingEngine.calculateMtM(trade, market);
    const newCarry = trade.carryPnl + this.calculateCarry(trade, market);
    
    return {
      ...trade,
      mtm: unrealized,
      carryPnl: newCarry
    };
  }
}
