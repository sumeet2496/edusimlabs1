
import React, { useState, useMemo, useEffect } from 'react';
import { Trade, CurrencyPair, Tenor, ClientScenario, MarketData } from '../types';

interface Props {
  scenario?: ClientScenario;
  market: MarketData;
  onBook: (trade: Trade) => void;
  draft?: Partial<Trade> | null;
  simulatedMonths: number;
  isAlreadyBooked?: boolean;
  isQuoteValidated: boolean;
}

const tenorToMonths = (t: string): number => {
  if (t === 'SPOT') return 0;
  const mMatch = t.match(/(\d+)M/);
  if (mMatch) return parseInt(mMatch[1]);
  const yMatch = t.match(/(\d+)Y/);
  if (yMatch) return parseInt(yMatch[1]) * 12;
  return 0;
};

const CONTRACT_SPECS: Record<string, { lotSize: number; basis: number }> = {
  'USD/INR': { lotSize: 1000, basis: 1 },
  'EUR/INR': { lotSize: 1000, basis: 1 },
  'GBP/INR': { lotSize: 1000, basis: 1 },
  'JPY/INR': { lotSize: 100000, basis: 100 },
  'CHF/INR': { lotSize: 1000, basis: 1 },
  'CAD/INR': { lotSize: 1000, basis: 1 },
};

const MARGIN_PERCENTAGE = 0.05; // Constant 5% Margin Requirement

const OrderPanel: React.FC<Props> = ({ scenario, market, onBook, simulatedMonths, draft, isAlreadyBooked, isQuoteValidated }) => {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | ''>('');
  const [selectedTenor, setSelectedTenor] = useState<Tenor | ''>('');
  const [lots, setLots] = useState<number>(0);
  const [rate, setRate] = useState<string>('');
  const [side, setSide] = useState<'BUY' | 'SELL' | null>(null);
  const [closingHedgeId, setClosingHedgeId] = useState<string | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | null>(null);

  const spec = selectedPair ? CONTRACT_SPECS[selectedPair] : null;
  const totalNotional = spec ? lots * spec.lotSize : 0;
  
  const totalMarginRequired = useMemo(() => {
    const finalRate = parseFloat(rate);
    if (!totalNotional || isNaN(finalRate)) return 0;
    const basis = spec?.basis || 1;
    return (totalNotional / basis) * finalRate * MARGIN_PERCENTAGE;
  }, [totalNotional, rate, spec]);

  const liveQuotes = useMemo(() => {
    if (!selectedPair || !selectedTenor) return { bid: 0, ask: 0 };
    const curve = market.fullCurves?.[selectedPair];
    if (!curve) return { bid: 0, ask: 0 };
    const tenorMap: any = { 'SPOT': 0, '1M': 1, '2M': 2, '3M': 3, '6M': 6, '1Y': 12 };
    const idx = tenorMap[selectedTenor] ?? 0;
    return curve[idx] || curve[0];
  }, [selectedPair, selectedTenor, market]);

  useEffect(() => {
    if (draft) {
      if (draft.pair) setSelectedPair(draft.pair);
      if (draft.tenor) setSelectedTenor(draft.tenor);
      if (draft.side) setSide(draft.side);
      if (draft.amount && draft.pair) {
        const lotSize = CONTRACT_SPECS[draft.pair].lotSize;
        setLots(Math.ceil(draft.amount / lotSize));
      }
      if (draft.rate) setRate(draft.rate.toFixed(4));
      if (draft.closingHedgeId) setClosingHedgeId(draft.closingHedgeId);
    }
  }, [draft]);

  useEffect(() => {
    if (side && selectedPair && selectedTenor) {
      const quotedRate = side === 'SELL' ? liveQuotes.bid : liveQuotes.ask;
      setRate(quotedRate.toFixed(4));
    }
  }, [selectedPair, selectedTenor, side, liveQuotes]);

  const mismatchReason = useMemo(() => {
    if (!scenario || !selectedPair || !selectedTenor || lots === 0) return null;
    const isSettlement = !!closingHedgeId || (isAlreadyBooked && selectedTenor === 'SPOT');
    if (selectedPair !== scenario.pair) return "PAIR MISMATCH";
    if (totalNotional !== scenario.amount) return "VOLUME ERROR";
    if (!isSettlement && selectedTenor !== scenario.tenor) return "TENOR MISMATCH";
    return null;
  }, [scenario, selectedPair, selectedTenor, totalNotional, closingHedgeId, lots, isAlreadyBooked]);

  const handleBook = () => {
    const finalRate = parseFloat(rate);
    if (!side || !selectedPair || !selectedTenor || lots <= 0 || isNaN(finalRate)) return;
    
    const marketRate = side === 'SELL' ? liveQuotes.bid : liveQuotes.ask;
    if (Math.abs(finalRate - marketRate) > 0.005) {
      setValidationError("RATE REJECTED");
      setTimeout(() => setValidationError(null), 2000);
      return;
    }

    if (mismatchReason) {
      setValidationError(mismatchReason);
      setTimeout(() => setValidationError(null), 2000);
      return;
    }

    onBook({
      id: `TR-${Math.floor(Math.random() * 90000) + 10000}`,
      pair: selectedPair as CurrencyPair,
      side: side,
      amount: totalNotional,
      rate: finalRate,
      tenor: selectedTenor as Tenor,
      timestamp: new Date(),
      status: 'OPEN',
      maturityMonth: simulatedMonths + tenorToMonths(selectedTenor),
      closingHedgeId: closingHedgeId
    });
    
    setLots(0);
    setSide(null);
    setSelectedPair('');
    setSelectedTenor('');
    setRate('');
    setClosingHedgeId(undefined);
  };

  const isReady = side && rate && lots > 0 && selectedPair && selectedTenor;

  const isScenarioTrade = useMemo(() => {
    if (!scenario) return false;
    return selectedPair === scenario.pair && 
           totalNotional === scenario.amount && 
           selectedTenor === scenario.tenor;
  }, [scenario, selectedPair, totalNotional, selectedTenor]);

  const canExecute = useMemo(() => {
    if (!isReady) return false;
    // If it's the primary hedge for the scenario, it MUST be validated in chat first
    if (isScenarioTrade && !isQuoteValidated) return false;
    return true;
  }, [isReady, isScenarioTrade, isQuoteValidated]);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border-l border-[#222] font-mono select-none">
      <div className="p-4 border-b border-[#222] bg-[#111] flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest leading-none">Execution Desk</span>
          <span className="text-[7px] text-gray-600 font-bold uppercase mt-1 tracking-widest">Trade Processing Module</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#00ff00] rounded-full animate-pulse"></div>
          <span className="text-[8px] font-black uppercase text-[#00ff00]">Streaming Feed</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] text-gray-600 uppercase font-black tracking-tight">Instrument</label>
            <select 
              value={selectedPair} 
              onChange={(e) => setSelectedPair(e.target.value as CurrencyPair)} 
              className="w-full bg-black border border-[#333] p-2 text-white font-black text-[11px] outline-none hover:border-[#444] transition-all"
            >
              <option value="">SELECT...</option>
              {Object.keys(CONTRACT_SPECS).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-gray-600 uppercase font-black tracking-tight">Maturity</label>
            <select 
              value={selectedTenor} 
              onChange={(e) => setSelectedTenor(e.target.value as Tenor)} 
              className="w-full bg-black border border-[#333] p-2 text-white font-black text-[11px] outline-none hover:border-[#444] transition-all"
            >
              <option value="">SELECT...</option>
              {['SPOT', '1M', '2M', '3M', '6M', '1Y'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button 
            onClick={() => { setSide('SELL'); setClosingHedgeId(undefined); }} 
            disabled={!selectedPair || !selectedTenor}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-sm transition-all ${!selectedPair || !selectedTenor ? 'opacity-30 cursor-not-allowed' : ''} ${side === 'SELL' ? 'border-red-600 bg-red-600/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-[#222] bg-[#111] hover:border-red-900/50'}`}
          >
            <span className="text-[8px] font-black text-gray-600 uppercase mb-1">SELL (BID)</span>
            <span className={`text-lg font-black ${side === 'SELL' ? 'text-red-500' : 'text-white'}`}>
              {selectedPair && selectedTenor ? liveQuotes.bid.toFixed(4) : '---'}
            </span>
          </button>
          <button 
            onClick={() => { setSide('BUY'); setClosingHedgeId(undefined); }} 
            disabled={!selectedPair || !selectedTenor}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-sm transition-all ${!selectedPair || !selectedTenor ? 'opacity-30 cursor-not-allowed' : ''} ${side === 'BUY' ? 'border-blue-600 bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-[#222] bg-[#111] hover:border-blue-900/50'}`}
          >
            <span className="text-[8px] font-black text-gray-600 uppercase mb-1">BUY (ASK)</span>
            <span className={`text-lg font-black ${side === 'BUY' ? 'text-blue-500' : 'text-white'}`}>
               {selectedPair && selectedTenor ? liveQuotes.ask.toFixed(4) : '---'}
            </span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9px] text-[#ff9900] uppercase font-black">Quantity (Lots)</label>
            <span className="text-[7px] text-gray-700 font-bold uppercase tracking-widest">
              {spec ? `1 Lot = ${spec.lotSize.toLocaleString()}` : 'Select Pair'}
            </span>
          </div>
          <input 
            type="number" 
            min="1" 
            value={lots || ''} 
            onChange={(e) => setLots(Math.max(0, parseInt(e.target.value) || 0))} 
            className="w-full bg-black border-2 border-[#333] p-4 text-white font-black focus:border-[#ff9900] outline-none text-3xl tracking-tighter shadow-inner" 
            placeholder="0" 
          />
          
          <div className="mt-3 bg-[#111] border border-[#222] rounded-sm divide-y divide-[#222]">
            <div className="p-3 flex justify-between items-center">
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Total Notional</span>
              <span className="text-[13px] text-[#00ff00] font-black tracking-tight">
                {totalNotional.toLocaleString()} <span className="text-[9px] opacity-40 font-bold uppercase ml-1">{selectedPair ? selectedPair.split('/')[0] : ''}</span>
              </span>
            </div>
            
            <div className="p-3 flex justify-between items-center bg-red-950/5">
              <span className="text-[8px] text-red-500 font-black uppercase tracking-widest">Margin Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[7px] text-gray-600 font-bold uppercase">INR</span>
                <span className="text-[13px] text-red-500 font-black tracking-tight">
                  {totalMarginRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Execution Rate</label>
            {closingHedgeId && (
              <span className="text-[7px] text-red-500 font-black uppercase animate-pulse">Closing Hedge #{closingHedgeId}</span>
            )}
          </div>
          <div className="relative group">
            <input 
              type="number" 
              readOnly 
              value={rate} 
              className="w-full bg-black border-2 border-[#111] p-4 text-4xl text-center text-white font-black outline-none tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity" 
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#050505] border-t border-[#222]">
        {validationError ? (
          <div className="w-full py-6 bg-red-600 text-white font-black text-center text-xs uppercase tracking-[0.2em] rounded-sm animate-pulse shadow-xl">
             NOT ACCEPTED: {validationError}
          </div>
        ) : (
          <div className="space-y-2">
            {!canExecute && isReady && isScenarioTrade && !isQuoteValidated && (
              <div className="text-[9px] text-red-500 font-black uppercase text-center animate-pulse mb-2">
                [AWAITING CLIENT CONFIRMATION IN CHAT]
              </div>
            )}
            <button 
              onClick={handleBook} 
              disabled={!canExecute} 
              className={`w-full py-6 font-black text-sm uppercase tracking-[0.3em] rounded-sm transition-all shadow-2xl ${!canExecute ? 'bg-gray-800 text-gray-600 cursor-not-allowed grayscale' : 'bg-[#ff9900] text-black hover:bg-white active:scale-95'}`}
            >
              EXECUTE TRADE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPanel;
