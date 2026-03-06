
import React from 'react';
import { MarketData } from '../types';

interface Props {
  market: MarketData;
  simulatedDays: number;
  onLeap: () => void;
  canLeap: boolean;
  tenorDays: number;
  onShowGuide: () => void;
}

const EconomicHeader: React.FC<Props> = ({ market, simulatedDays, onLeap, canLeap, tenorDays, onShowGuide }) => {
  return (
    <div className="h-12 bg-[#111] border-b border-[#333] flex items-center px-4 gap-8 text-[10px]">
      <div className="flex items-center gap-2">
        <span className="text-[#ff9900] font-bold">VAL DATE:</span>
        <span className="bg-black px-2 py-0.5 border border-[#333] text-white font-bold">
          {new Date(Date.now() + simulatedDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </span>
      </div>

      <div className="h-6 w-px bg-[#333]" />

      <div className="flex-1 flex gap-6 overflow-hidden items-center">
        <span className="text-gray-500 font-bold uppercase whitespace-nowrap">CAL:</span>
        {market.calendar.map((ev, i) => (
          <div key={i} className="flex gap-2 whitespace-nowrap group">
            <span className="text-gray-400">{ev.time}</span>
            <span className={ev.impact === 'HIGH' ? 'text-red-500 font-bold' : 'text-white'}>{ev.event}</span>
          </div>
        ))}
      </div>

      <div className="h-6 w-px bg-[#333]" />

      <div className="flex items-center gap-3">
        <button 
          onClick={onShowGuide}
          className="px-4 py-2 text-gray-400 hover:text-white border border-[#333] hover:border-[#555] font-black uppercase text-[9px] tracking-widest transition-all"
        >
          Help / Guide
        </button>
        <button 
          onClick={onLeap}
          disabled={!canLeap}
          className={`px-6 py-2 font-black uppercase text-xs tracking-widest transition-all ${
            canLeap 
              ? 'bg-[#ff9900] text-black hover:bg-white animate-pulse shadow-[0_0_15px_rgba(255,153,0,0.4)]' 
              : 'bg-[#222] text-[#444] border border-[#333] cursor-not-allowed'
          }`}
        >
          {canLeap ? `⚡ LEAP ${tenorDays} DAYS` : 'AWAITING DEAL'}
        </button>
      </div>
    </div>
  );
};

export default EconomicHeader;
