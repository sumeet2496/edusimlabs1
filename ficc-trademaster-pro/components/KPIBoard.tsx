
import React from 'react';
import { KPIs } from '../types';

const KPIBoard: React.FC<{ kpis: KPIs }> = ({ kpis }) => {
  const metrics = [
    { label: 'Client Trust', value: kpis.clientTrust, color: 'text-blue-400', barColor: 'bg-blue-600' },
    { label: 'Boss Satisfaction', value: kpis.bossSatisfaction, color: 'text-orange-400', barColor: 'bg-orange-600' },
    { label: 'Market Reputation', value: kpis.marketReputation, color: 'text-purple-400', barColor: 'bg-purple-600' },
    { label: 'Risk Rating', value: kpis.riskCompliance, color: 'text-green-400', barColor: 'bg-green-600' },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0a0a0a] border border-[#333] rounded-sm shadow-xl">
      <div className="flex items-center justify-between border-b border-[#222] pb-2">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Desk Performance Index</span>
        <span className="text-amber-500 font-bold text-2xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] font-mono">
            {kpis.compositeScore.toFixed(0)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 py-2">
        {metrics.map(m => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex justify-between text-[9px] uppercase font-bold tracking-tighter">
              <span className="text-gray-400">{m.label}</span>
              <span className={m.color}>{m.value.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-[#151515] w-full rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${m.barColor}`}
                style={{ width: `${m.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-[#222] grid grid-cols-2 gap-2">
        <div className="bg-[#050505] p-2 border border-[#1a1a1a]">
            <div className="text-[8px] text-gray-600 uppercase font-bold text-center mb-1 tracking-tighter">Desk P&L</div>
            <div className={`text-sm font-mono font-bold text-center ${kpis.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${(kpis.pnl / 1000).toFixed(1)}K
            </div>
        </div>
        <div className="bg-[#050505] p-2 border border-[#1a1a1a]">
            <div className="text-[8px] text-gray-600 uppercase font-bold text-center mb-1 tracking-tighter">Commission</div>
            <div className="text-sm font-mono font-bold text-center text-blue-400">
                ${(kpis.commissionEarned / 1000).toFixed(2)}K
            </div>
        </div>
      </div>
    </div>
  );
};

export default KPIBoard;
