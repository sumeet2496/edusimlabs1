
import React from 'react';

interface Props {
  onClose: () => void;
}

const UserGuide: React.FC<Props> = ({ onClose }) => {
  const steps = [
    {
      title: "1. ANALYZE THE MANDATE",
      color: "text-[#ff9900]",
      desc: "Review the 'Corporate Mandate Summary'. Identify if the client is an Importer (Buying FX) or Exporter (Selling FX). Note the Notional Amount and the Tenor (1M to 2Y)."
    },
    {
      title: "2. NEGOTIATE TERMS",
      color: "text-blue-400",
      desc: "Use the 'Institutional Chat' to talk to the client. They may have specific concerns about market volatility. Be professional—they are looking for your expertise as a Banker."
    },
    {
      title: "3. CALCULATE & QUOTE",
      color: "text-white",
      desc: "Look at 'Pricing Benchmarks' in the Trade Panel. A Forward Rate is calculated as: Spot Rate × (1 + Domestic Rate × T) / (1 + Foreign Rate × T). Submit your firm quote to the client."
    },
    {
      title: "4. THE TIME LEAP",
      color: "text-[#ff9900]",
      desc: "Once the deal is 'ACCEPTED', use the 'LEAP' button in the header. This simulates the passage of time, jumping forward to the 'Value Date' (Maturity) of the contract."
    },
    {
      title: "5. RECONCILIATION",
      color: "text-[#00ff00]",
      desc: "At maturity, the Market Spot will have changed. Calculate the Cash Settlement P/L. If you hedged correctly, the client's risk is mitigated. Submit your math to the Clearing House to finish."
    }
  ];

  return (
    <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="max-w-4xl w-full bg-[#0a0a0a] border-2 border-[#333] flex flex-col shadow-[0_0_100px_rgba(255,153,0,0.2)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#111] p-4 border-b border-[#333] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[#ff9900] font-black text-lg tracking-tighter uppercase italic">Institutional Training Manual</span>
            <span className="bg-[#ff9900] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm">V1.0</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest px-3 py-1 border border-[#333] hover:border-white">
            Exit [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="space-y-6">
            <h2 className="text-[#ff9900] font-black text-2xl tracking-tighter leading-tight border-b border-[#222] pb-4 uppercase">
              How to operate the <br/> FX Forward Terminal
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              This simulator places you on the Foreign Exchange Desk of a Tier-1 Investment Bank. 
              Your goal is to provide hedging solutions for corporate clients while managing the bank's exposure to interest rate differentials.
            </p>
            <div className="bg-[#111] p-5 border-l-2 border-[#ff9900] rounded-sm space-y-3 shadow-inner">
              <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">The Core Formula: Interest Rate Parity</span>
              <p className="text-[#ff9900] font-mono text-sm font-bold bg-black p-3 text-center border border-[#222]">
                F = S × [ (1 + r<sub>d</sub> × t) / (1 + r<sub>f</sub> × t) ]
              </p>
              <p className="text-[9px] text-gray-500 italic">
                S=Spot, r<sub>d</sub>=Domestic Rate (INR), r<sub>f</sub>=Foreign Rate, t=Time in years.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="group flex gap-4 p-4 border border-[#1a1a1a] hover:bg-white/5 transition-colors duration-300 rounded-sm">
                <div className={`text-xl font-black opacity-30 group-hover:opacity-100 transition-opacity ${step.color}`}>
                  0{idx + 1}
                </div>
                <div>
                  <h4 className={`text-[11px] font-black mb-1 uppercase tracking-widest ${step.color}`}>{step.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#050505] p-6 border-t border-[#222] flex justify-between items-center">
          <div className="flex gap-4 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            <span>Market Simulation: Stochastic V7</span>
            <span>|</span>
            <span>Encrypted Data Feed</span>
          </div>
          <button 
            onClick={onClose}
            className="bg-[#ff9900] text-black font-black px-10 py-3 text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95"
          >
            I am Ready to Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
