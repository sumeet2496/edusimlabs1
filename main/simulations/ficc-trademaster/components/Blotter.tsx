
import React from 'react';
import { Trade } from '../types';
import TerminalPanel from './TerminalPanel';

const Blotter: React.FC<{ trades: Trade[], title?: string }> = ({ trades, title = "TRADE BLOTTER" }) => {
  return (
    <TerminalPanel title={title}>
      <div className="overflow-x-auto h-full bg-[#080808]">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead className="sticky top-0 bg-[#1a1a1a] text-gray-500 font-bold shadow-md z-10">
            <tr>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">TRADE ID</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">CPARTY</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">TYPE</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">CCY</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">NOTIONAL</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">RATE %</th>
              <th className="p-2 border-r border-[#222] uppercase tracking-tighter">DV01</th>
              <th className="p-2 uppercase tracking-tighter">MTM (USD)</th>
            </tr>
          </thead>
          <tbody className="font-mono divide-y divide-[#151515]">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-700 italic text-[14px] uppercase tracking-widest">No Executions Detected</td>
              </tr>
            ) : (
              trades.map((t) => (
                <tr key={t.id} className="hover:bg-[#111] transition-colors border-b border-[#111]">
                  <td className="p-2 text-white font-bold">{t.id}</td>
                  <td className="p-2 text-gray-400 truncate max-w-[100px]">{t.counterparty}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2 text-blue-500">{t.currency1}</td>
                  <td className="p-2">{(t.notional / 1000000).toFixed(1)}M</td>
                  <td className="p-2 text-orange-500">{(t.fixedRate! * 100).toFixed(4)}%</td>
                  <td className="p-2 text-gray-500">{(t.dv01 / 1000).toFixed(2)}k</td>
                  <td className={`p-2 font-bold ${t.mtm >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {t.mtm.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TerminalPanel>
  );
};

export default Blotter;
