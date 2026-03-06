
import React from 'react';
import { MarketData, CurrencyPair, PairData } from '../types';

interface Props {
  market: MarketData;
  activePair: CurrencyPair;
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 15;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#00ff00"
        strokeWidth="1"
        points={points}
      />
    </svg>
  );
};

const MarketScreen: React.FC<Props> = ({ market, activePair }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end border-b border-[#444] mb-2">
        <h2 className="text-[#ff9900] text-xs font-bold uppercase tracking-widest">Global FX Monitor</h2>
        <span className="text-[9px] text-gray-600">SOURCE: BBG_LIVE_FEED</span>
      </div>

      <div className="grid grid-cols-12 gap-y-1 text-[10px]">
        {/* Header */}
        <div className="col-span-2 text-gray-500 uppercase">Ticker</div>
        <div className="col-span-2 text-gray-500 uppercase text-right">Bid</div>
        <div className="col-span-2 text-gray-500 uppercase text-right">Ask</div>
        <div className="col-span-2 text-gray-500 uppercase text-right">Trend</div>
        <div className="col-span-2 text-gray-500 uppercase text-right">1M Fwd</div>
        <div className="col-span-2 text-gray-500 uppercase text-right">Yield %</div>

        {(Object.entries(market.pairs) as [CurrencyPair, PairData][]).map(([pair, data]) => {
          const isActive = pair === activePair;
          return (
            <React.Fragment key={pair}>
              <div className={`col-span-2 font-bold ${isActive ? 'text-[#ff9900]' : 'text-white'}`}>
                {isActive && <span className="mr-1">▶</span>}{pair}
              </div>
              <div className="col-span-2 text-[#00ff00] text-right">{data.spot.bid.toFixed(4)}</div>
              <div className="col-span-2 text-[#00ff00] text-right">{data.spot.ask.toFixed(4)}</div>
              <div className="col-span-2 flex justify-end items-center">
                <Sparkline data={data.history} />
              </div>
              <div className="col-span-2 text-white text-right font-bold">{data.oneMonthForward.bid.toFixed(4)}</div>
              <div className="col-span-2 text-[#ff9900] text-right">
                {data.rates.domestic.toFixed(2)} / {data.rates.foreign.toFixed(2)}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[#222] pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#ff9900] text-[10px] uppercase font-bold">Forward Curve Details: {activePair}</h3>
          <div className="text-[9px] text-gray-500">LAST REFR: {market.timestamp.toLocaleTimeString()}</div>
        </div>
        <div className="flex gap-12">
           <div className="text-center">
             <div className="text-[9px] text-gray-500 uppercase">Spot Mid</div>
             <div className="text-xl text-[#00ff00] font-bold tracking-tighter">
               {((market.pairs[activePair].spot.bid + market.pairs[activePair].spot.ask) / 2).toFixed(4)}
             </div>
           </div>
           <div className="text-center border-l border-[#222] pl-12">
             <div className="text-[9px] text-gray-500 uppercase">1M Premium</div>
             <div className="text-lg text-white font-bold">+{market.pairs[activePair].oneMonthPoints.bid.toFixed(2)}</div>
           </div>
           <div className="text-center border-l border-[#222] pl-12">
             <div className="text-[9px] text-gray-500 uppercase">3M Premium</div>
             <div className="text-lg text-white font-bold">+{market.pairs[activePair].threeMonthPoints.bid.toFixed(2)}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketScreen;
