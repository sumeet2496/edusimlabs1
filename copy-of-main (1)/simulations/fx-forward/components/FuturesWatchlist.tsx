
import React from 'react';
import { MarketData, CurrencyPair } from '../types';

interface Props {
  market: MarketData;
  selected: CurrencyPair;
  onSelect: (p: CurrencyPair) => void;
}

const FuturesWatchlist: React.FC<Props> = ({ market, selected, onSelect }) => {
  return (
    <div className="flex flex-col h-full text-[10px] border-l border-[#333]">
      <div className="bg-[#111] p-2 font-bold text-blue-400 border-b border-[#333] flex justify-between items-center">
        <span>FUTURES 1Y</span>
        <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">S/D ADJ.</span>
      </div>
      <div className="grid grid-cols-12 px-2 py-1 text-gray-500 uppercase font-black border-b border-[#222] text-[8px] tracking-tighter">
        <div className="col-span-4">Ticker</div>
        <div className="col-span-4 text-center">Bid</div>
        <div className="col-span-4 text-right">Ask</div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#080808]">
        {(Object.keys(market.pairs) as CurrencyPair[]).map(pair => {
          const data = market.pairs[pair];
          const isSelected = selected === pair;
          const points = data.oneYearForward.bid - data.spot.bid;
          const isPremium = points > 0;

          return (
            <div 
              key={pair} 
              onClick={() => onSelect(pair)}
              className={`group flex flex-col p-2 border-b border-[#111] cursor-pointer hover:bg-[#1a1a1a] transition-all ${isSelected ? 'bg-blue-900/10 border-r-2 border-r-blue-500' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className={`font-black text-[9px] tracking-tight ${isSelected ? 'text-blue-400' : 'text-gray-500'}`}>
                  {pair}
                </div>
                <div className={`text-[7px] font-black px-1 rounded-sm leading-none py-0.5 ${isPremium ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {isPremium ? 'PREM' : 'DISC'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-[13px] font-black text-white tracking-tighter leading-none">
                    {data.oneYearForward.bid.toFixed(4)}
                  </span>
                  <span className="text-[6px] text-gray-700 uppercase font-black mt-1">BID</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-black text-blue-200/70 tracking-tighter leading-none">
                    {data.oneYearForward.ask.toFixed(4)}
                  </span>
                  <span className="text-[6px] text-gray-700 uppercase font-black mt-1">ASK</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 bg-[#050505] border-t border-[#222]">
        <div className="flex justify-between items-center text-[7px] text-gray-600 font-black uppercase tracking-widest">
          <span>VOLATILITY: HIGH</span>
          <span className="text-blue-900">FIXED_1Y</span>
        </div>
      </div>
    </div>
  );
};

export default FuturesWatchlist;
