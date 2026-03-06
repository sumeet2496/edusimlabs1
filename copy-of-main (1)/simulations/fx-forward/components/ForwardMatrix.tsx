
import React from 'react';
import { MarketData, CurrencyPair, Tenor, Quote } from '../types';

interface Props {
  market: MarketData;
  selected: CurrencyPair;
  onSelect: (p: CurrencyPair) => void;
  onQuoteClick: (pair: CurrencyPair, tenor: Tenor, side: 'BUY' | 'SELL', rate: number) => void;
  baseYear: number;
}

const ForwardMatrix: React.FC<Props> = ({ market, selected, onSelect, onQuoteClick, baseYear }) => {
  const columns: { label: string; tenor: Tenor; sub?: string }[] = [
    { label: 'Spot', tenor: 'SPOT', sub: baseYear.toString() },
    { label: '1M', tenor: '1M', sub: 'Fixed' },
    { label: '3M', tenor: '3M', sub: 'Fixed' },
    { label: '6M', tenor: '6M', sub: 'Fixed' },
    { label: '1Y', tenor: '1Y', sub: (baseYear + 1).toString() },
    { label: '2Y', tenor: '2Y', sub: (baseYear + 2).toString() },
    { label: '3Y', tenor: '3Y', sub: (baseYear + 3).toString() },
    { label: '4Y', tenor: '4Y', sub: (baseYear + 4).toString() },
    { label: '5Y', tenor: '5Y', sub: (baseYear + 5).toString() },
  ];

  const getQuoteForTenor = (data: any, tenor: Tenor): Quote => {
    switch (tenor) {
      case 'SPOT': return data.spot;
      case '1M': return data.oneMonthForward;
      case '3M': return data.threeMonthForward;
      case '6M': return data.sixMonthForward;
      case '1Y': return data.oneYearForward;
      case '2Y': return data.twoYearForward;
      case '3Y': return data.threeYearForward;
      case '4Y': return data.fourYearForward;
      case '5Y': return data.fiveYearForward;
      default: return data.spot;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black border border-[#333] overflow-hidden rounded-sm select-none shadow-2xl">
      <div className="bg-[#111] p-2 border-b border-[#333] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff9900] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm">INTERACTIVE</div>
          <h2 className="text-[#ff9900] font-black text-[11px] uppercase tracking-[0.2em]">Yield Curve Matrix [2026 - 2031]</h2>
        </div>
        <div className="flex gap-4 text-[8px] font-black text-gray-500 uppercase tracking-widest">
          <span>Click Rates to Execute</span>
          <span className="text-[#ff9900]">|</span>
          <span>Feed: INST_LIQUIDITY</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-[#050505] sticky top-0 z-20 shadow-md">
              <th className="p-3 text-left text-gray-500 border-b border-[#222] font-black uppercase sticky left-0 bg-[#050505] z-30">Instrument</th>
              {columns.map((col, idx) => (
                <th key={idx} className="p-3 text-center border-b border-[#222] group">
                  <div className="flex flex-col">
                    <span className="text-white font-black uppercase text-[9px]">{col.label}</span>
                    <span className="text-gray-600 text-[7px] font-bold group-hover:text-[#ff9900] transition-colors">{col.sub}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(market.pairs) as CurrencyPair[]).map(pair => {
              const data = market.pairs[pair];
              const isSelected = selected === pair;

              return (
                <tr 
                  key={pair} 
                  className={`border-b border-[#111] transition-colors ${isSelected ? 'bg-blue-900/10' : 'hover:bg-white/5'}`}
                >
                  <td 
                    onClick={() => onSelect(pair)}
                    className="p-3 cursor-pointer sticky left-0 bg-black z-10 border-r border-[#111]"
                  >
                    <div className="flex flex-col">
                      <span className={`font-black text-[12px] tracking-tighter ${isSelected ? 'text-[#ff9900]' : 'text-white'}`}>{pair}</span>
                      <span className="text-[7px] text-gray-600 uppercase font-bold">Inst. Mid</span>
                    </div>
                  </td>
                  {columns.map((col, idx) => {
                    const q = getQuoteForTenor(data, col.tenor);
                    return (
                      <td key={idx} className="p-1 border-l border-[#111]">
                        <div className="flex flex-col gap-1 min-w-[70px]">
                          {/* BID BUTTON (Desk Buys / Client Sells) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onQuoteClick(pair, col.tenor, 'SELL', q.bid); }}
                            className="flex justify-between w-full px-2 py-1 bg-black/40 border border-[#222] hover:border-green-500 hover:bg-green-500/10 transition-all rounded-sm group/btn"
                          >
                            <span className="text-gray-600 text-[8px] font-black group-hover/btn:text-green-500">B</span>
                            <span className="text-white font-mono font-bold">{q.bid.toFixed(4)}</span>
                          </button>
                          {/* ASK BUTTON (Desk Sells / Client Buys) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onQuoteClick(pair, col.tenor, 'BUY', q.ask); }}
                            className="flex justify-between w-full px-2 py-1 bg-black/40 border border-[#222] hover:border-blue-500 hover:bg-blue-500/10 transition-all rounded-sm group/btn"
                          >
                            <span className="text-gray-600 text-[8px] font-black group-hover/btn:text-blue-500">A</span>
                            <span className="text-blue-400 font-mono font-bold">{q.ask.toFixed(4)}</span>
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-2 bg-[#050505] border-t border-[#333] flex justify-between items-center px-4">
        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Direct Curve Interaction Enabled • Value Year: {baseYear}
        </div>
        <div className="text-[8px] text-[#ff9900] font-black">
          {market.timestamp.toLocaleTimeString()} UTC
        </div>
      </div>
    </div>
  );
};

export default ForwardMatrix;
