
import React from 'react';
import { Trade, MarketData, AccountEntry, CurrencyPair, Tenor } from '../types';
import { SCENARIOS } from '../constants';

interface Props {
  trades: Trade[];
  market: MarketData;
  onSquareOff: (trade: Trade) => void;
  onPrepareReport: (scenarioId: number) => void;
  simulatedMonths: number;
  clientAccount: AccountEntry[];
  completedScenarioIds: number[];
}

const Portfolio: React.FC<Props> = ({ trades, market, onSquareOff, onPrepareReport, simulatedMonths, completedScenarioIds }) => {
  const calculateUnrealizedPnl = (trade: Trade) => {
    const curve = market.fullCurves[trade.pair];
    if (!curve) return 0;
    
    const remainingMonths = Math.max(0, trade.maturityMonth - simulatedMonths);
    const quote = curve[remainingMonths] || curve[0];
    const mid = (quote.bid + quote.ask) / 2;
    
    const basis = trade.pair === 'JPY/INR' ? 100 : 1;
    const quantity = trade.amount / basis;
    return trade.side === 'BUY' ? (mid - trade.rate) * quantity : (trade.rate - mid) * quantity;
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] font-mono">
      <div className="p-4 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center">
        <div>
          <h3 className="text-[#ff9900] font-black text-xs uppercase tracking-widest">Forward Portfolio & Strategy</h3>
          <span className="text-[8px] text-gray-600 font-bold uppercase">Derivative holdings & Mark-to-Market Valuation</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {completedScenarioIds.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[9px] text-green-500 font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div> Reconciled Mandates
            </h4>
            <div className="grid grid-cols-1 gap-1">
              {completedScenarioIds.map(id => {
                const s = SCENARIOS.find(sc => sc.id === id);
                return (
                  <div key={id} className="bg-green-600/5 border border-green-500/20 p-3 flex justify-between items-center rounded-sm">
                    <span className="text-green-400 font-black text-[10px] uppercase">{s?.name}</span>
                    <button onClick={() => onPrepareReport(id)} className="bg-[#ff9900] text-black text-[8px] font-black px-3 py-1.5 uppercase hover:bg-white transition-all">Report</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 bg-[#ff9900] rounded-full"></div> Hedge Positions (FWD)
          </h4>
          <div className="overflow-hidden border border-[#222] rounded-sm bg-[#0a0a0a]">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="text-gray-600 border-b border-[#222] text-left uppercase font-black bg-[#080808]">
                  <th className="p-3">Contract</th>
                  <th className="p-3 text-center">Side</th>
                  <th className="p-3 text-right">Strike</th>
                  <th className="p-3 text-right">Unreal. P/L</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(t => {
                  const pnl = calculateUnrealizedPnl(t);
                  const isMatured = t.maturityMonth <= simulatedMonths;
                  return (
                    <tr key={t.id} className={`border-b border-[#111] hover:bg-white/5 transition-colors ${isMatured ? 'bg-red-900/10' : ''}`}>
                      <td className="p-3 font-black text-white">
                        {t.pair}
                        <span className="block text-[7px] text-gray-600 font-bold uppercase">{t.tenor}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black border ${t.side === 'BUY' ? 'border-blue-900 text-blue-400' : 'border-red-900 text-red-400'}`}>
                          {t.side === 'BUY' ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      <td className="p-3 text-right text-gray-500 font-mono">{t.rate.toFixed(4)}</td>
                      <td className={`p-3 text-right font-black font-mono ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => onSquareOff(t)} 
                          className={`bg-white text-black hover:bg-[#ff9900] text-[8px] font-black px-3 py-1.5 uppercase transition-all ${!isMatured ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                        >
                          Square Off
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {trades.length === 0 && (
               <div className="p-8 text-center opacity-20">
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">No Active Hedges</span>
               </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-black border-t border-[#111] text-[8px] text-gray-700 font-black uppercase tracking-[0.2em] italic text-center">
        * MARK-TO-MARKET VALUATION BASED ON REAL-TIME INTERBANK FIXINGS.
      </div>
    </div>
  );
};

export default Portfolio;
