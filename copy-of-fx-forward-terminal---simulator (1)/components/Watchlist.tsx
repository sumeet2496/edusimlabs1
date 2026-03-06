
import React from 'react';
import { MarketData, CurrencyPair } from '../types';

interface Props {
  market: MarketData;
  selected: CurrencyPair;
  onSelect: (p: CurrencyPair) => void;
}

const Watchlist: React.FC<Props> = ({ market, selected, onSelect }) => {
  return (
    <div className="flex flex-col h-full text-[10px]">
      <div className="bg-[#111] p-2 font-bold text-[#ff9900] border-b border-[#333] flex justify-between items-center">
        <span>FX MONITOR</span>
        <span className="text-[8px] text-gray-500 font-normal">SECURE FEED</span>
      </div>
      <div className="grid grid-cols-12 px-2 py-1 text-gray-500 uppercase font-bold border-b border-[#222] text-[9px]">
        <div className="col-span-4">Ticker</div>
        <div className="col-span-4 text-center">Bid</div>
        <div className="col-span-4 text-right">Ask</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {(Object.keys(market.pairs) as CurrencyPair[]).map(pair => {
          const data = market.pairs[pair];
          const isSelected = selected === pair;
          return (
            <div 
              key={pair} 
              onClick={() => onSelect(pair)}
              className={`group flex flex-col p-3 border-b border-[#111] cursor-pointer hover:bg-[#111] transition-colors ${isSelected ? 'bg-[#151515] border-l-4 border-l-[#ff9900]' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className={`font-bold text-[11px] ${isSelected ? 'text-[#ff9900]' : 'text-gray-300'}`}>{pair}</div>
              </div>
              <div className="flex justify-between items-end gap-2">
                <div className="flex flex-col">
                  <span className="text-[20px] font-bold text-[#00ff00] leading-none tracking-tighter">
                    {data.spot.bid.toFixed(2)}
                  </span>
                  <span className="text-[8px] text-gray-600 uppercase mt-1">BID</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[20px] font-bold text-[#00cc00] leading-none tracking-tighter opacity-80">
                    {data.spot.ask.toFixed(2)}
                  </span>
                  <span className="text-[8px] text-gray-600 uppercase mt-1">ASK</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 bg-[#0a0a0a] border-t border-[#222]">
        <div className="text-[8px] text-gray-600 italic leading-tight">
          * Market is deterministic. Update occurs on month leap.
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
