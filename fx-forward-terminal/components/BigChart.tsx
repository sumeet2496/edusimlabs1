
import React from 'react';
import { PairData, CurrencyPair } from '../types';

interface Props {
  pair: CurrencyPair;
  data: PairData;
}

const BigChart: React.FC<Props> = ({ pair, data }) => {
  const history = data.history.filter(v => !isNaN(v) && isFinite(v));
  if (!history.length) return (
    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-black italic">
      Initializing Market Feed...
    </div>
  );

  const min = Math.min(...history);
  const max = Math.max(...history);
  const currentPrice = history[history.length - 1];
  
  const range = (max - min) || 0.0001;
  const padding = range * 0.35; 
  const viewMin = min - padding;
  const viewMax = max + padding;
  const viewRange = viewMax - viewMin;

  const width = 1000;
  const height = 400;

  const points = history.map((d, i) => {
    const x = (i / (history.length - 1)) * width;
    const y = height - ((d - viewMin) / viewRange) * height;
    return `${x},${y}`;
  }).join(' ');

  const gridCount = 10;
  const gridLines = Array.from({ length: gridCount + 1 }).map((_, i) => {
    const price = viewMax - (i * (viewRange / gridCount));
    const y = (i / gridCount) * height;
    return { price, y };
  });

  const currentY = height - ((currentPrice - viewMin) / viewRange) * height;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-black select-none font-mono transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <div className="text-3xl font-black text-white tracking-tighter leading-none flex items-baseline gap-3">
            {pair} 
            <span className="text-[#ff9900] text-[10px] font-black uppercase tracking-[0.3em] opacity-60 border-l-2 border-[#333] pl-3">
              Institutional Feed
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 bg-[#111] w-fit px-2 py-1 border border-[#222] rounded-sm shadow-inner">
            <span className="h-2 w-2 bg-[#00ff00] rounded-full animate-pulse"></span>
            <span className="text-[9px] text-[#00ff00] font-black uppercase tracking-widest">Active Live</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-gray-500 uppercase font-black mb-0.5 tracking-[0.1em]">Mid Benchmark</div>
          <div className="text-4xl font-black text-[#00ff00] tracking-tighter leading-none drop-shadow-xl">
            {currentPrice.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex border border-[#222] relative bg-[#050505] rounded-sm overflow-hidden mb-2">
        <div className="flex-1 relative cursor-crosshair">
          {/* Subtle Vertical Grid */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-4 opacity-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-px h-full bg-white"></div>
            ))}
          </div>

          {/* Price Grids */}
          {gridLines.map((line, i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-[#111] pointer-events-none flex items-center"
              style={{ top: `${line.y}px` }}
            >
              <div className="absolute left-2 bg-[#050505] border border-[#222] px-1 py-0.5 text-[7px] text-gray-600 font-bold translate-y-[-50%] z-20 opacity-30">
                {line.price.toFixed(4)}
              </div>
            </div>
          ))}

          {/* Current Market Price Tracker */}
          <div 
            className="absolute w-full border-t border-dashed border-[#00ff00]/20 z-10 pointer-events-none transition-all duration-300"
            style={{ top: `${currentY}px` }}
          >
            <div className="absolute right-0 bg-[#00ff00] text-black text-[9px] font-black px-1.5 py-0.5 translate-y-[-50%] shadow-xl">
              {currentPrice.toFixed(4)}
            </div>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9900" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#ff9900" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ff9900" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <path
              d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
              fill="url(#chartGradient)"
              className="transition-all duration-300"
            />
            
            <polyline 
              fill="none" 
              stroke="#ff9900" 
              strokeWidth="3.5" 
              points={points} 
              strokeLinejoin="round"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(255,153,0,0.7)] transition-all duration-300" 
            />
          </svg>
        </div>

        <div className="w-20 bg-[#0a0a0a] border-l border-[#333] flex flex-col justify-between text-[9px] text-gray-600 font-black relative overflow-hidden">
          {gridLines.map((line, i) => (
            <div key={i} className="flex-1 flex items-center justify-center border-b border-[#111] bg-black/20">
              {line.price.toFixed(4)}
            </div>
          ))}
          <div 
            className="absolute right-0 w-full bg-[#ff9900] text-black flex items-center justify-center h-5 font-black z-30 shadow-xl border-l-2 border-white transition-all duration-300"
            style={{ top: `${currentY}px`, transform: 'translateY(-50%)' }}
          >
            {currentPrice.toFixed(4)}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[9px] text-gray-600 font-black border-t border-[#222] pt-3">
        <div className="flex gap-6">
          <div className="flex gap-2 items-center">
            <span className="text-[#ff9900] uppercase tracking-tighter">Day High:</span>
            <span className="text-white text-[10px] tracking-tighter">{max.toFixed(4)}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[#ff9900] uppercase tracking-tighter">Day Low:</span>
            <span className="text-white text-[10px] tracking-tighter">{min.toFixed(4)}</span>
          </div>
        </div>
        <div className="flex gap-4 items-center opacity-30 uppercase tracking-[0.2em] italic">
          <span>Stochastic V7.0</span>
          <span className="h-2.5 w-px bg-gray-800"></span>
          <span>EM Precision Feed</span>
        </div>
      </div>
    </div>
  );
};

export default BigChart;
