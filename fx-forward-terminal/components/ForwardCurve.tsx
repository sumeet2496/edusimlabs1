
import React from 'react';
import { MarketData, CurrencyPair, Tenor, Quote } from '../types';
import { getContractLabel } from '../App';

interface Props {
  market: MarketData;
  selected: CurrencyPair;
  onSelect: (p: CurrencyPair) => void;
  onQuoteClick: (pair: CurrencyPair, tenor: Tenor, side: 'BUY' | 'SELL', rate: number) => void;
  simulatedMonths: number;
}

const ForwardCurve: React.FC<Props> = ({ market, selected, onSelect, onQuoteClick, simulatedMonths }) => {
  const columns = [
    { offset: 0, type: 'CASH', label: 'SPOT' },
    ...(simulatedMonths > 0 ? [{ offset: 0, type: 'FORWARD', label: '0M' }] : []),
    { offset: 1, type: 'FORWARD', label: '1M' },
    { offset: 2, type: 'FORWARD', label: '2M' },
    { offset: 3, type: 'FORWARD', label: '3M' },
    { offset: 6, type: 'FORWARD', label: '6M' },
    { offset: 12, type: 'FORWARD', label: '1Y' },
  ];
  
  const getTenorLabel = (col: typeof columns[0]): Tenor => {
    if (col.type === 'CASH') return 'SPOT';
    return (col.label === '0M' ? 'SPOT' : col.label) as Tenor;
  };

  const getQuoteForColumn = (curve: Quote[], col: typeof columns[0]) => {
    if (col.offset === 0) return curve[0]; 
    return curve[col.offset] || curve[0];
  };

  const calculateMarginPercent = (spot: Quote, fwd: Quote, months: number) => {
    if (months === 0) return 0;
    const spotMid = (spot.bid + spot.ask) / 2;
    const fwdMid = (fwd.bid + fwd.ask) / 2;
    // Annualized percentage
    const margin = ((fwdMid - spotMid) / spotMid) * (12 / months) * 100;
    return margin;
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden select-none">
      <div className="bg-[#111] p-4 border-b border-[#333] flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-[#ff9900] font-black text-xs uppercase tracking-widest">Institutional Pricing Matrix</h2>
          <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 italic">
            Monitor "Margin %" to identify carry-trade opportunities and arbitrage.
          </span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-[7px] text-gray-500 uppercase font-black">Calendar Month</span>
             <span className="text-white text-[10px] font-black tracking-tighter">
                {getContractLabel(simulatedMonths, 0).replace('SPOT (', '').replace(')', '')}
             </span>
           </div>
           <div className="h-4 w-px bg-[#222]" />
           <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 ${simulatedMonths > 0 ? 'bg-blue-500' : 'bg-green-500'} rounded-full animate-pulse`}></span>
              <span className={`text-[9px] ${simulatedMonths > 0 ? 'text-blue-500' : 'text-green-500'} font-black uppercase tracking-widest`}>
                {simulatedMonths > 0 ? 'Feed: Converged' : 'Feed: Standard'}
              </span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#050505] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-black">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr className="bg-[#080808] text-[10px] text-gray-600 uppercase font-black border-b border-[#222] sticky top-0 z-30 shadow-md">
              <th className="p-4 sticky left-0 bg-[#080808] z-40 w-36 border-r border-[#222]">PAIR</th>
              {columns.map((col, idx) => {
                const isSpotCash = col.type === 'CASH';
                const label = getContractLabel(simulatedMonths, col.offset).replace('SPOT (', '').replace(')', '');
                
                return (
                  <th key={idx} className={`p-4 text-center border-l border-[#111] w-56 bg-[#080808] ${isSpotCash ? 'bg-[#ff9900]/5' : ''}`}>
                    <div className="flex flex-col">
                      <span className={`${isSpotCash ? 'text-[#ff9900]' : 'text-white'} text-[11px] mb-0.5`}>
                        {label}
                      </span>
                      <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                        {isSpotCash ? 'SPOT CASH' : `${col.label} FORWARD`}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(market.pairs) as CurrencyPair[]).map(pair => {
              const curve = market.fullCurves[pair];
              if (!curve) return null;
              const isSelected = selected === pair;
              const spotQuote = curve[0];

              return (
                <tr key={pair} className={`border-b border-[#111] transition-colors ${isSelected ? 'bg-blue-900/10' : 'hover:bg-white/5'}`}>
                  <td 
                    onClick={() => onSelect(pair)}
                    className="p-4 cursor-pointer sticky left-0 bg-black z-10 border-r border-[#222]"
                  >
                    <div className="flex flex-col">
                      <span className={`font-black text-[12px] tracking-tighter ${isSelected ? 'text-[#ff9900]' : 'text-white'}`}>{pair}</span>
                      <span className="text-[7px] text-gray-600 uppercase font-bold">Inst. Rate</span>
                    </div>
                  </td>
                  {columns.map((col, idx) => {
                    const q = getQuoteForColumn(curve, col);
                    const tenor = getTenorLabel(col);
                    const margin = calculateMarginPercent(spotQuote, q, col.offset);
                    const isSpotGroup = col.offset === 0;

                    return (
                      <td key={idx} className={`p-2 border-l border-[#111] ${isSpotGroup ? 'bg-[#ff9900]/5' : ''}`}>
                        <div className="flex flex-col gap-1.5 min-w-[140px]">
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[7px] text-gray-500 font-black uppercase">Margin</span>
                             <span className={`text-[8px] font-black ${margin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                               {margin === 0 ? '--' : `${margin > 0 ? '+' : ''}${margin.toFixed(2)}%`}
                             </span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onQuoteClick(pair, tenor, 'SELL', q.bid); }}
                            className="flex justify-between w-full px-3 py-1.5 bg-black/40 border border-[#222] hover:border-green-500 hover:bg-green-500/10 transition-all rounded-sm group/btn"
                          >
                            <span className="text-gray-600 text-[8px] font-black group-hover/btn:text-green-500">BID</span>
                            <span className="text-white font-mono font-bold">{q.bid.toFixed(4)}</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onQuoteClick(pair, tenor, 'BUY', q.ask); }}
                            className="flex justify-between w-full px-3 py-1.5 bg-black/40 border border-[#222] hover:border-blue-500 hover:bg-blue-500/10 transition-all rounded-sm group/btn"
                          >
                            <span className="text-gray-600 text-[8px] font-black group-hover/btn:text-blue-500">ASK</span>
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
      
      <div className="p-3 bg-[#050505] border-t border-[#333] flex justify-between items-center px-4 shrink-0">
        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#ff9900] rounded-full animate-pulse"></span>
          Yield Curve analysis uses Interest Rate Parity for Margin calculations.
        </div>
        <div className="text-[8px] text-[#ff9900] font-black uppercase">
          {new Date().toLocaleTimeString()} • SYSTEM READY
        </div>
      </div>
    </div>
  );
};

export default ForwardCurve;
