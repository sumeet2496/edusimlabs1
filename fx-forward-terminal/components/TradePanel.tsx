
import React from 'react';
import { MarketData, ClientScenario, ClientType, Tenor } from '../types';

interface Props {
  market: MarketData;
  scenario: ClientScenario;
  onConfirm: (trade: any) => void;
  disabled: boolean;
}

const TradePanel: React.FC<Props> = ({ market, scenario, disabled }) => {
  const currentPairData = market.pairs[scenario.pair];
  const spotMid = (currentPairData.spot.bid + currentPairData.spot.ask) / 2;

  const getDays = (t: Tenor) => {
    switch(t) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case '2Y': return 730;
      case '3Y': return 1095;
      case '4Y': return 1460;
      case '5Y': return 1825;
      default: return 0;
    }
  };

  return (
    <div className={`flex flex-col gap-4 h-full ${disabled ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
      <div className="text-[10px] text-[#ff9900] font-black border-b border-[#222] pb-2 uppercase tracking-widest flex items-center gap-2">
        <div className="w-2 h-2 bg-[#ff9900] animate-pulse"></div>
        Execution Guidance
      </div>
      
      <div className="space-y-2">
        <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Client Profile</label>
        <div className="bg-[#111] p-3 border border-[#333] flex flex-col rounded-sm shadow-inner">
          <span className="font-black text-white text-[12px] truncate">{scenario.name}</span>
          <div className="flex justify-between items-center mt-2">
             <span className="text-[10px] text-[#ff9900] font-black uppercase">{scenario.type}</span>
             <span className="text-[9px] text-gray-500 font-bold">{scenario.pair}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] border border-[#222] p-4 space-y-4 rounded-sm shadow-xl">
         <div className="text-[9px] text-blue-400 font-black border-b border-[#111] pb-2 uppercase tracking-widest">Mandate Metrics</div>
         <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px]">
            <div>
              <span className="text-gray-600 block uppercase text-[8px] font-black mb-1">Spot Index</span>
              <span className="text-white font-black text-xs">{spotMid.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-600 block uppercase text-[8px] font-black mb-1">Horizon</span>
              <span className="text-white font-black text-xs">{scenario.tenor}</span>
            </div>
            <div>
              <span className="text-gray-600 block uppercase text-[8px] font-black mb-1">Domestic Rate</span>
              <span className="text-[#ff9900] font-black text-xs">{currentPairData.rates.domestic.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-gray-600 block uppercase text-[8px] font-black mb-1">Foreign Rate</span>
              <span className="text-[#ff9900] font-black text-xs">{currentPairData.rates.foreign.toFixed(2)}%</span>
            </div>
         </div>
      </div>

      <div className="mt-auto bg-[#111] border-2 border-dashed border-[#333] p-6 text-center rounded-sm">
        <div className="text-[#ff9900] text-[10px] font-black uppercase mb-3 tracking-widest">Pricing Terminal</div>
        <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase">
          Select the correct rate from the <span className="text-white underline">Yield Curve Matrix</span>.
        </p>
        <div className="mt-4 space-y-2">
           <div className="text-[8px] text-blue-400 font-black uppercase border border-blue-900/30 p-1">Importer → Desk Sells → ASK</div>
           <div className="text-[8px] text-green-500 font-black uppercase border border-green-900/30 p-1">Exporter → Desk Buys → BID</div>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
