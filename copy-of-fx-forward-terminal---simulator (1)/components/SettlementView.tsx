
import React, { useState } from 'react';
import { SettlementResult } from '../types';

interface Props {
  result: SettlementResult;
  onCalculate: (val: number) => void;
  onNext: () => void;
}

const SettlementView: React.FC<Props> = ({ result, onCalculate, onNext }) => {
  const [inputVal, setInputVal] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal);
    if (!isNaN(val)) {
      setHasAttempted(true);
      onCalculate(val);
    }
  };

  const pairBase = result.trade.pair.split('/')[0];
  const isPositive = result.actualCashSettlement > 0;

  return (
    <div className="h-full bg-black p-6 flex flex-col gap-6 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border-t border-[#ff9900]">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-[#333] pb-4">
         <div>
            <div className="text-xl font-black text-white uppercase tracking-tighter">Economic Reconciliation</div>
            <div className="text-[8px] text-[#ff9900] font-black uppercase tracking-[0.4em] mt-0.5 opacity-80">Value Date Audit Terminal</div>
         </div>
         <div className="text-right flex flex-col items-end">
            <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">Final Market Fix (Spot)</div>
            <div className="text-3xl font-black text-[#00ff00] tracking-tighter leading-none">{result.finalSpot.toFixed(4)}</div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-8 flex-1 items-start">
        {/* Audit Details Panel */}
        <div className="space-y-4">
          <div className="text-[9px] text-gray-500 uppercase font-black border-b border-[#222] pb-1 tracking-widest">Audit Specifications</div>
          <div className="space-y-2.5 bg-[#080808] p-4 border border-[#1a1a1a] rounded-sm shadow-inner">
            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span className="opacity-60">Contract Rate:</span> 
              <span className="text-white font-black">{result.trade.rate.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span className="opacity-60">Settlement Notional:</span> 
              <span className="text-white font-black">{pairBase} {result.trade.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-mono border-t border-[#111] pt-2">
              <span className="opacity-60">Market Side:</span> 
              <span className={`font-black uppercase ${result.trade.side === 'BUY' ? 'text-blue-500' : 'text-red-500'}`}>{result.trade.side}</span>
            </div>
          </div>
          
          <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm border-l-2 border-blue-500/50">
            <span className="font-black text-white block mb-2 uppercase text-[8px] tracking-widest opacity-80">Settlement Math:</span>
            <div className="text-[10px] text-gray-400 font-mono leading-relaxed italic">
              {result.trade.side === 'BUY' ? (
                <p>Net P/L = (Final Fix - Contract Rate) × {result.trade.amount.toLocaleString()}</p>
              ) : (
                <p>Net P/L = (Contract Rate - Final Fix) × {result.trade.amount.toLocaleString()}</p>
              )}
            </div>
          </div>
          
          <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest px-1">
             <span className="text-[#ff9900]">Note:</span> Clearing house accepts ±4,000 INR discrepancy due to floating point rounding.
          </div>
        </div>

        {/* Action / Result Area */}
        <div className="col-span-2 bg-[#050505] border border-[#1a1a1a] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] rounded-sm shadow-2xl">
          {!result.isCorrect ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-sm animate-in fade-in duration-500">
              <div className="w-full text-center">
                 <label className="block text-[10px] text-[#ff9900] uppercase mb-4 tracking-[0.3em] font-black opacity-80">Calculated Cash Settlement (INR)</label>
                 <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 font-black text-3xl">₹</span>
                    <input 
                      type="number" 
                      value={inputVal}
                      onChange={e => { setInputVal(e.target.value); setHasAttempted(false); }}
                      placeholder="0.00"
                      className="w-full bg-black border border-[#222] text-[#00ff00] p-5 pl-12 text-3xl font-black focus:border-[#ff9900] focus:shadow-[0_0_40px_rgba(255,153,0,0.1)] outline-none tracking-tighter transition-all rounded-sm placeholder:text-gray-900"
                      autoFocus
                    />
                 </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#ff9900] text-black font-black py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all transform hover:scale-[1.02] shadow-xl active:scale-95"
              >
                PROPOSE TO CLEARING HOUSE
              </button>
              {hasAttempted && !result.isCorrect && (
                <div className="text-red-500 text-[9px] font-black uppercase animate-shake border border-red-900/50 p-3 bg-red-950/20 w-full text-center tracking-widest rounded-sm">
                   Audit Failure: Value does not match counterparty records.
                </div>
              )}
            </form>
          ) : (
            <div className="text-center space-y-6 py-2 animate-in zoom-in-95 w-full">
               <div className="inline-block px-8 py-2 bg-green-500/10 border border-green-500/50 rounded-sm">
                  <div className="text-green-500 font-black text-sm uppercase tracking-[0.4em]">Audit Status: Verified</div>
               </div>
               <div className="space-y-1">
                  <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.5em]">Realized Settlement Flux</p>
                  <p className={`text-5xl font-black tracking-tighter ${isPositive ? 'text-[#00ff00]' : 'text-red-500'} drop-shadow-2xl`}>
                    {isPositive ? '+' : '-'} ₹{Math.abs(result.actualCashSettlement).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black opacity-40">Contract FWD-{Math.floor(Math.random()*90000) + 10000} closed.</p>
               </div>
               <div className="pt-8">
                 <button onClick={onNext} className="bg-white text-black font-black px-12 py-3 text-[10px] uppercase hover:bg-[#ff9900] transition-all shadow-2xl tracking-[0.3em] active:scale-95 rounded-sm">
                   ACCEPT NEXT MANDATE
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default SettlementView;
