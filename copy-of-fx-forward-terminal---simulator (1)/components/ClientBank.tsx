
import React from 'react';
import { AccountEntry, CurrencyPair } from '../types';

interface Props {
  entries: AccountEntry[];
  onTradeAction: (pair: CurrencyPair, amount: number, side: 'BUY' | 'SELL') => void;
}

const ClientBank: React.FC<Props> = ({ entries, onTradeAction }) => {
  const totalInrBalance = entries.reduce((acc, curr) => acc + curr.amountInr, 0);
  
  const initialHoldings: Record<string, number> = {};
  const ccyHoldings = entries.reduce((acc, curr) => {
      acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
      return acc;
  }, initialHoldings);

  const foreignCurrencies = Object.entries(ccyHoldings).filter(([ccy, amt]) => ccy !== 'INR' && Math.abs(amt as number) > 0.01);

  return (
    <div className="h-full flex flex-col bg-[#050505] font-mono select-none overflow-hidden">
      <div className="px-6 py-4 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center">
        <h2 className="text-[#ff9900] font-black text-[11px] uppercase tracking-widest">Master Currency Hub</h2>
        <div className="flex gap-4 items-center">
           <span className="text-[7px] text-gray-700 font-bold uppercase tracking-widest">System Integrated</span>
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* INR BALANCE PANE */}
        <div className="w-1/2 border-r border-[#222] p-8 flex flex-col bg-[#080808]">
          <div className="mb-12">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] block mb-4">Functional Balance (INR)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl text-gray-700 font-black tracking-tight">₹</span>
              <span className={`text-6xl font-black tracking-tighter ${totalInrBalance < 0 ? 'text-red-500' : 'text-[#00ff00]'}`}>
                {totalInrBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-[#00ff00] to-transparent opacity-20"></div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
             <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest block border-b border-[#111] pb-1">Activity Log</span>
             {[...entries].reverse().filter(e => e.amountInr !== 0).slice(0, 12).map(e => (
               <div key={e.id} className="flex justify-between items-center group bg-black/20 p-2 border border-[#111] rounded-sm mb-1">
                 <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 group-hover:text-white transition-colors truncate max-w-[140px] font-bold">{e.description}</span>
                    <span className="text-[7px] text-gray-700 font-bold">{e.timestamp.toLocaleTimeString()}</span>
                 </div>
                 <span className={`text-[10px] font-black ${e.amountInr > 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {e.amountInr > 0 ? '+' : ''}{e.amountInr.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                 </span>
               </div>
             ))}
          </div>
        </div>

        {/* FOREIGN ASSETS PANE */}
        <div className="w-1/2 p-8 flex flex-col bg-black">
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] block mb-8">Foreign Assets (USD / Others)</span>
          
          {foreignCurrencies.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 border border-dashed border-[#222] rounded-sm">
               <span className="text-[10px] font-black uppercase italic tracking-widest">No foreign currency in bank</span>
            </div>
          ) : (
            <div className="space-y-6">
              {foreignCurrencies.map(([ccy, amt]) => {
                const isPositive = (amt as number) > 0;
                return (
                  <div key={ccy} className="relative bg-[#111] border border-[#222] p-6 rounded-sm group overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[40px] font-black text-white/[0.02] pointer-events-none">{ccy}</div>
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                         <span className="text-[8px] text-blue-500 font-black uppercase tracking-widest block mb-1">{ccy} Pot</span>
                         <span className={`text-4xl font-black tracking-tighter ${isPositive ? 'text-white' : 'text-red-400'}`}>
                           {(amt as number).toLocaleString()}
                         </span>
                      </div>
                      <button 
                        onClick={() => onTradeAction(`${ccy}/INR` as CurrencyPair, Math.abs(amt as number), isPositive ? 'SELL' : 'BUY')}
                        className={`px-4 py-2 text-[9px] font-black uppercase rounded-sm border transition-all ${
                          isPositive 
                            ? 'bg-blue-600 text-white border-blue-500 hover:bg-white hover:text-black' 
                            : 'bg-red-600 text-white border-red-500 hover:bg-white hover:text-black'
                        }`}
                      >
                        {isPositive ? 'Liquidate' : 'Settle Payable'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-[#111]">
             <div className="flex items-start gap-3">
                <div className="w-1 h-6 bg-blue-500 opacity-40"></div>
                <p className="text-[8px] text-gray-700 leading-relaxed font-bold uppercase italic">
                  Note: Foreign currency held in the bank must be liquidated into INR to settle physical obligations and realize final profits.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-[#222] flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-gray-800">
        <span>Channel Secure ISO-20022</span>
        <span>Balance Refresh: Real-time</span>
      </div>
    </div>
  );
};

export default ClientBank;
