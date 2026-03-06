
import { MarketData, MacroEvent, EventCategory } from '../types';

export class EventEngine {
  static triggerRandomEvent(market: MarketData): MacroEvent | null {
    if (Math.random() < 0.995) return null; // 0.5% chance per second

    const categories = Object.values(EventCategory);
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const events: Partial<MacroEvent>[] = [
      { 
        id: 'E1', category: EventCategory.MACRO, title: 'FED EMERGENCY HIKE', 
        impact: 'high', description: 'Surprise inflation data triggers 50bps parallel USD curve shift.',
        impactParams: { shiftUSD: 0.0050 }
      },
      { 
        id: 'E2', category: EventCategory.LIQUIDITY, title: 'INTERBANK FREEZE', 
        impact: 'medium', description: 'Credit concerns widen bid/ask spreads across all desks.',
        impactParams: { spreadWidening: 2.0 }
      },
      { 
        id: 'E3', category: EventCategory.BOSS_INSTRUCTION, title: 'LIMIT REDUCTION ORDER', 
        impact: 'low', description: 'Boss: "The book is too heavy. Cut aggregate DV01 by 30% now."',
        impactParams: { targetDV01Reduction: 0.3 }
      }
    ];

    const base = events[Math.floor(Math.random() * events.length)];
    return {
      ...base,
      startTime: Date.now(),
      duration: 15 + Math.floor(Math.random() * 20)
    } as MacroEvent;
  }
}
