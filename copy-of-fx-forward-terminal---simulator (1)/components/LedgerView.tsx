
import React, { useState } from 'react';
import { AccountEntry, Trade } from '../types';

interface Props {
  entries: AccountEntry[];
  trades: Trade[];
}

type LedgerSubTab = 'CASH_FLOWS' | 'TRADE_BOOK';

const LedgerView: React.FC<Props> = ({ entries, trades }) => {
  const [activeTab, setActiveTab] = useState<LedgerSubTab>('CASH_FLOWS');

  return (
    <div className="h-full flex flex-col bg-[#050505] font-mono select-none">
      {/* Navigation Header */}
      <div className="p-4 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center">
        <div className="flex gap-4">
          {(['CASH_FLOWS', 'TRADE_BOOK'] as LedgerSubTab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? 'text-[#ff9900] border-[#ff9900]' : 'text-gray-600 border-transparent hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">Master Audit Terminal</span>
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {activeTab === 'CASH_FLOWS' && (
          <div className="space-y-1">
             <div className="grid grid-cols-12 px-3 py-2 text-gray-600 font-black uppercase text-[8px] border-b border-[#111] mb-2">
                <div className="col-span-2">TIMESTAMP</div>
                <div className="col-span-5">EVENT DESCRIPTION</div>
                <div className="col-span-2 text-right">MKT RATE</div>
                <div className="col-span-3 text-right">INR DELTA</div>
             </div>
             {entries.length === 0 ? (
                <div className="p-20 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.3em] italic">No Liquidity Events Recorded</div>
             ) : (
                [...entries].reverse().map((entry) => (
                  <div key={entry.id} className="grid grid-cols-12 px-3 py-3 border-b border-[#111] hover:bg-white/5 transition-colors items-center group">
                    <div className="col-span-2 flex flex-col">
                      <span className="text-gray-500 text-[9px] font-bold">{entry.timestamp.toLocaleTimeString()}</span>
                      <span className="text-gray-800 text-[7px] font-black uppercase">{entry.id}</span>
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-1 h-3 ${
                        entry.type === 'HEDGE_SETTLEMENT' ? 'bg-[#ff9900]' : 
                        entry.type === 'MARGIN_PAYMENT' ? (entry.amountInr > 0 ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'
                      }`}></div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-[11px] uppercase tracking-tight group-hover:text-[#ff9900] transition-colors">
                          {entry.description}
                        </span>
                        <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">
                           {entry.type.replace('_', ' ')} {entry.amountCcy !== 0 ? `[${entry.ccy}]` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-black text-blue-400 text-[11px]">
                      {entry.rate > 0 ? entry.rate.toFixed(4) : '--'}
                    </div>
                    <div className={`col-span-3 text-right font-black text-sm tracking-tighter ${entry.amountInr > 0 ? 'text-green-500' : entry.amountInr < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {entry.amountInr > 0 ? '+' : ''}{entry.amountInr.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ))
             )}
          </div>
        )}

        {activeTab === 'TRADE_BOOK' && (
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="text-gray-600 border-b border-[#222] font-black uppercase text-[9px]">
                <th className="p-3 text-left">Trade ID / Time</th>
                <th className="p-3 text-left">Instrument</th>
                <th className="p-3 text-center">Side</th>
                <th className="p-3 text-right">Notional</th>
                <th className="p-3 text-right">Strike</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center opacity-20 text-xs font-black uppercase tracking-widest italic">No Open Positions</td>
                </tr>
              ) : (
                [...trades].reverse().map((trade) => (
                  <tr key={trade.id} className="border-b border-[#111] hover:bg-white/5 transition-colors group">
                    <td className="p-3">
                      <span className="text-gray-500 block text-[9px] font-bold">{trade.timestamp.toLocaleTimeString()}</span>
                      <span className="text-gray-700 text-[8px] font-black uppercase group-hover:text-[#ff9900]">{trade.id}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-black text-white uppercase tracking-tight">{trade.pair}</span>
                        <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">{trade.tenor}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black border ${trade.side === 'BUY' ? 'border-blue-900 text-blue-400' : 'border-red-900 text-red-400'}`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-white">
                      {trade.amount.toLocaleString()} <span className="text-[7px] text-gray-700">{trade.pair.split('/')[0]}</span>
                    </td>
                    <td className="p-3 text-right font-black text-[#00ff00]">
                      {trade.rate.toFixed(4)}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm ${trade.status === 'OPEN' ? 'bg-blue-600/10 text-blue-500' : 'bg-gray-800 text-gray-500'}`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-3 bg-black border-t border-[#222] flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-700 italic">
        <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-green-500"></div> Liquidity Inflow</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-red-500"></div> Margin Lockdown</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Spot Fixings</span>
        </div>
        <span>Comprehensive Audit Feed • Session: ESC_922</span>
      </div>
    </div>
  );
};

export default LedgerView;
