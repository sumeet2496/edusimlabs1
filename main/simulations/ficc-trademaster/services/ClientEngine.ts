
import { RFQ, ClientPersona, TradeType, Currency, Tenor, MarketData } from '../types';

export class ClientEngine {
  private static SCENARIOS: Record<TradeType, { text: string, concept: string }[]> = {
    [TradeType.IRS]: [
      { text: "Managing our term loan exposure. We need to swap floating for fixed.", concept: "CREDIT_A" },
      { text: "Relative value fund rebalance. Looking for a receiver swap quote.", concept: "LIQUIDITY_STD" },
      { text: "Duration target adjustment. We need to pay fixed on a 5Y swap.", concept: "MID_FLAT" }
    ],
    [TradeType.FX_FORWARD]: [
      { text: "Hedging import receivables in 3 months. Give us a forward quote.", concept: "FX_HEDGE" },
      { text: "Repatriating offshore earnings. Need a 1Y USD/INR forward.", concept: "FX_FORWARD" },
      { text: "Currency exposure limit reached. Need a short-dated forward hedge.", concept: "LIQUIDITY_LOW" }
    ],
    [TradeType.CCS]: [
      { text: "Raising USD to fund INR infrastructure projects. Need a CCS quote.", concept: "BASIS_SWAP" },
      { text: "Funding our Mumbai subsidiary via a cross-currency basis swap.", concept: "SOVEREIGN_RISK" }
    ],
    [TradeType.BOND]: [],
    [TradeType.FUTURE]: []
  };

  static generateRequest(market: MarketData, forceTrigger: boolean = false): RFQ | null {
    const spawnChance = 0.033; 
    if (!forceTrigger && Math.random() > spawnChance) return null;

    const personas = Object.values(ClientPersona);
    const personaType = personas[Math.floor(Math.random() * personas.length)];
    
    const clientNames: Record<ClientPersona, string[]> = {
      [ClientPersona.HEDGE_FUND]: ['BlueCrest Alpha', 'Renaissance Tech', 'Point72', 'Millennium'],
      [ClientPersona.CORPORATE]: ['BMW Finance', 'Reliance Treasury', 'Apple Global', 'Toyota Fin'],
      [ClientPersona.INTERDEALER]: ['Goldman Sachs', 'JP Morgan', 'Barclays', 'DB London'],
      [ClientPersona.ASSET_MANAGER]: ['BlackRock', 'Vanguard', 'PIMCO', 'Fidelity'],
      [ClientPersona.SOVEREIGN]: ['RBI India', 'Norges Bank', 'GIC Singapore', 'SAMA']
    };

    const clientName = clientNames[personaType][Math.floor(Math.random() * clientNames[personaType].length)];
    
    // Weighted product selection
    const rand = Math.random();
    let type = TradeType.IRS;
    if (rand < 0.45) type = TradeType.IRS;
    else if (rand < 0.85) type = TradeType.FX_FORWARD;
    else type = TradeType.CCS;

    const scenarios = this.SCENARIOS[type] || [{ text: "Inquiring about market levels.", concept: "GENERAL" }];
    const scenarioObj = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const ccy1 = [Currency.USD, Currency.EUR, Currency.INR][Math.floor(Math.random() * 3)];
    // CCS and FX_FORWARD usually involve USD as a reference
    const ccy2 = (type === TradeType.FX_FORWARD || type === TradeType.CCS) 
      ? (ccy1 === Currency.USD ? Currency.EUR : Currency.USD) 
      : undefined;

    const tenorMap: Record<TradeType, Tenor> = {
      [TradeType.IRS]: '5Y',
      [TradeType.FX_FORWARD]: '3M',
      [TradeType.CCS]: '2Y',
      [TradeType.BOND]: '5Y',
      [TradeType.FUTURE]: '3M'
    };
    const tenor = tenorMap[type];
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const notional = (Math.floor(Math.random() * 90) + 10) * 1000000;
    
    let message = `${clientName} >> ${scenarioObj.text} Quote us for ${notional/1000000}M ${ccy1}${ccy2 ? '/' + ccy2 : ''} at ${tenor}.`;

    return {
      id: `RFQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      client: clientName,
      clientType: personaType,
      type,
      ccy1,
      ccy2,
      side,
      notional,
      tenor,
      expiry: 150, // Slightly longer for the new worksheet flow
      initialExpiry: 150,
      spreadSensitivity: 3, 
      scenario: scenarioObj.text,
      requiredConcept: scenarioObj.concept,
      message,
      status: 'PENDING'
    };
  }
}
