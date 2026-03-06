
import React, { useMemo } from 'react';
import { RiskMetrics, Trade, Currency, Tenor } from '../types';
import TerminalPanel from './TerminalPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

const RiskDashboard: React.FC<{ risk: RiskMetrics, trades: Trade[] }> = ({ risk, trades }) => {
  const chartData = Object.entries(risk.dv01ByCcy).map(([ccy, value]) => ({
    name: ccy,
    value: value
  }));

  const totalCarry = useMemo(() => trades.reduce((acc, t) => acc + t.carryPnl, 0), [trades]);
  
  // Tenor Heatmap Data (Simulated for visualization)
  const tenorData = [
    { tenor: '1M', usd: 12, eur: -5, inr: 2, jpy: 0 },
    { tenor: '1Y', usd: 45, eur: 12, inr: -8, jpy: 1 },
    { tenor: '5Y', usd: (risk.dv01ByCcy[Currency.USD] / 100).toFixed(0), eur: (risk.dv01ByCcy[Currency.EUR] / 100).toFixed(0), inr: 45, jpy: -2 },
    { tenor: '10Y', usd: -20, eur: 30, inr: 12, jpy: 5 },
    { tenor: '30Y', usd: 5, eur: -10, inr: 0, jpy: 2 },
  ];

  return (
    <TerminalPanel title="ADVANCED RISK & ANALYTICS MONITOR">
      <div className="p-4 space-y-4 flex flex-col h-full overflow-y-auto bg-black font-mono">
        
        {/* TOP LEVEL METRIC CARDS */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
           <div className="bg-[#111] border border-[#222] p-2 relative">
              <div className="text-[8px] text-gray-600 uppercase font-bold">Aggregate DV01</div>
              <div className="text-lg font-bold text-orange-500">{(risk.totalDV01 / 1000).toFixed(2)}K</div>
              <div className="text-[7px] text-gray-700 absolute bottom-1 right-2">USD EQV</div>
           </div>
           <div className="bg-[#111] border border-[#222] p-2 relative">
              <div className="text-[8px] text-gray-600 uppercase font-bold">95% VaR (1D)</div>
              <div className="text-lg font-bold text-white">${(risk.var95 / 1000).toFixed(1)}K</div>
              <div className="text-[7px] text-gray-700 absolute bottom-1 right-2 italic">Normal Distribution</div>
           </div>
           <div className="bg-[#111] border border-[#222] p-2 relative overflow-hidden">
              <div className="text-[8px] text-gray-600 uppercase font-bold">Daily Carry Accrual</div>
              <div className={`text-lg font-bold ${totalCarry >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${(totalCarry / 1000).toFixed(2)}K
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-10">
                 <div className="w-10 h-10 border-4 border-white rotate-45"></div>
              </div>
           </div>
        </div>

        {/* DV01 CONCENTRATION BY CCY */}
        <div className="h-32 shrink-0">
           <h4 className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest flex justify-between">
              <span>DV01 Concentration (USD)</span>
              <span className="text-blue-900">Live_Delta_Feed</span>
           </h4>
           <div className="h-full w-full bg-[#050505] border border-[#111]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#333" fontSize={8} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '9px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={40}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#4ade80' : '#f87171'} fillOpacity={0.6} stroke={entry.value >= 0 ? '#4ade80' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* COMPLICATED TENOR HEATMAP TABLE */}
        <div className="shrink-0">
           <h4 className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">DV01 Tenor Map (Pips/1M Notional)</h4>
           <table className="w-full text-[8px] text-center border border-[#222]">
             <thead className="bg-[#111] text-gray-500">
               <tr>
                 <th className="p-1 border border-[#222]">TENOR</th>
                 <th className="p-1 border border-[#222]">USD</th>
                 <th className="p-1 border border-[#222]">EUR</th>
                 <th className="p-1 border border-[#222]">INR</th>
                 <th className="p-1 border border-[#222]">JPY</th>
               </tr>
             </thead>
             <tbody>
               {tenorData.map(d => (
                 <tr key={d.tenor} className="hover:bg-[#111]">
                   <td className="p-1 border border-[#222] font-bold text-gray-400">{d.tenor}</td>
                   <td className={`p-1 border border-[#222] ${+d.usd >= 0 ? 'text-green-900' : 'text-red-900'}`}>{d.usd}</td>
                   <td className={`p-1 border border-[#222] ${+d.eur >= 0 ? 'text-green-900' : 'text-red-900'}`}>{d.eur}</td>
                   <td className={`p-1 border border-[#222] ${+d.inr >= 0 ? 'text-green-900' : 'text-red-900'}`}>{d.inr}</td>
                   <td className={`p-1 border border-[#222] ${+d.jpy >= 0 ? 'text-green-900' : 'text-red-900'}`}>{d.jpy}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        {/* ALERTS SECTION */}
        <div className="space-y-1.5 flex-1 min-h-[100px]">
           <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#222] pb-1">Risk Violations & Log</h4>
           <div className="overflow-y-auto max-h-[150px] space-y-1">
            {risk.limitBreaches.length === 0 ? (
              <div className="text-[9px] text-green-900 italic py-4 text-center border border-dashed border-green-900/30">LMT_CHECK_PASSED: All positions within policy.</div>
            ) : (
              risk.limitBreaches.map((b, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/40 p-1.5 flex items-start space-x-2 animate-pulse">
                    <span className="text-red-600 font-bold">[!]</span>
                    <div className="text-[8px] font-bold text-red-500 uppercase leading-tight">{b}</div>
                </div>
              ))
            )}
           </div>
        </div>

      </div>
    </TerminalPanel>
  );
};

export default RiskDashboard;
