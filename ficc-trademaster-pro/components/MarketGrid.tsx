
import React from 'react';
import { MarketData, Currency, FXRate, Tenor } from '../types';
import TerminalPanel from './TerminalPanel';

const MarketGrid: React.FC<{ market: MarketData }> = ({ market }) => {
  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-[#1a1a1a] shrink-0">
        {Object.values(Currency).map((ccy) => {
          const mid = market.curves[ccy].rates['5Y'];
          const spread = 0.0002; // 2bps
          return (
            <div key={ccy} className="bg-black border border-[#333] p-3 hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-amber-500 font-bold text-[10px] tracking-widest uppercase">{ccy} 5Y IRS</span>
                <span className="text-[8px] text-gray-700 font-mono">CCY_{ccy}</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                  {(mid * 100).toFixed(4)}
                </span>
                <span className="text-[10px] font-mono text-gray-600">%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#111] text-[10px] font-mono">
                 <div className="flex flex-col">
                    <span className="text-gray-600 uppercase text-[8px] font-bold">BID</span>
                    <span className="text-red-400 font-bold">{((mid - spread/2) * 100).toFixed(4)}</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-gray-600 uppercase text-[8px] font-bold">ASK</span>
                    <span className="text-blue-400 font-bold">{((mid + spread/2) * 100).toFixed(4)}</span>
                 </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-3 gap-1 p-1 min-h-0">
        <TerminalPanel title="GLOBAL FX FORWARDS MONITOR">
          <div className="p-2 overflow-y-auto h-full space-y-1">
            {(Object.values(market.fx) as FXRate[]).map(rate => (
              <div key={rate.pair} className="bg-[#080808] border border-[#222] p-2 flex justify-between items-center group transition-colors hover:bg-[#111]">
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">{rate.pair}</div>
                  <div className="text-[11px] font-mono text-white flex space-x-2">
                    <span className="text-red-400">B: {rate.bid.toFixed(4)}</span>
                    <span className="text-blue-400">A: {rate.ask.toFixed(4)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-mono ${rate.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(rate.change * 100).toFixed(3)}%
                  </div>
                  <div className="text-[8px] text-gray-700 uppercase font-bold font-mono">F_PTS: {rate.forwardPoints['1Y'].toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
        </TerminalPanel>

        <TerminalPanel title="MULTI-CURVE MATRIX">
          <div className="h-full overflow-y-auto">
            <table className="w-full text-[10px] font-mono text-left border-collapse">
              <thead className="text-gray-600 bg-[#080808] sticky top-0 border-b border-[#222]">
                <tr>
                  <th className="p-2">TENOR</th>
                  <th className="p-2">USD</th>
                  <th className="p-2">EUR</th>
                  <th className="p-2">INR</th>
                </tr>
              </thead>
              <tbody>
                {(['1M', '3M', '6M', '1Y', '5Y', '10Y', '30Y'] as Tenor[]).map(tenor => (
                  <tr key={tenor} className="border-b border-[#111] hover:bg-[#111] group">
                    <td className="p-2 text-gray-500 font-bold group-hover:text-amber-500">{tenor}</td>
                    <td className="p-2 text-blue-400">{(market.curves[Currency.USD].rates[tenor] * 100).toFixed(3)}</td>
                    <td className="p-2 text-orange-400">{(market.curves[Currency.EUR].rates[tenor] * 100).toFixed(3)}</td>
                    <td className="p-2 text-green-400">{(market.curves[Currency.INR].rates[tenor] * 100).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalPanel>

        <TerminalPanel title="RISK ADJUSTMENT SPECS">
          <div className="p-3 h-full overflow-y-auto font-mono space-y-4">
             <div>
                <h5 className="text-[9px] text-amber-500 font-bold uppercase mb-2 border-b border-amber-900/30">Credit Spread [BPS]</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                   {Object.entries(market.creditSpreads).map(([rating, val]) => (
                     <React.Fragment key={rating}>
                        <span className="text-gray-500">{rating}</span>
                        <span className="text-white text-right">{(Number(val) * 10000).toFixed(1)}</span>
                     </React.Fragment>
                   ))}
                </div>
             </div>
             <div>
                <h5 className="text-[9px] text-blue-500 font-bold uppercase mb-2 border-b border-blue-900/30">Liquidity [BPS]</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                   {Object.entries(market.liquidityPremiums).map(([tier, val]) => (
                     <React.Fragment key={tier}>
                        <span className="text-gray-500">{tier}</span>
                        <span className="text-white text-right">{(Number(val) * 10000).toFixed(1)}</span>
                     </React.Fragment>
                   ))}
                </div>
             </div>
             <div className="p-2 bg-blue-950/20 border border-blue-900 mt-4">
                <p className="text-[8px] text-blue-300 uppercase leading-tight italic">Note: Use these values when completing your pricing worksheets to ensure accurate spread capture.</p>
             </div>
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
};

export default MarketGrid;
