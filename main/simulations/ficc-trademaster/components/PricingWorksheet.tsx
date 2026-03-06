
import React, { useState, useMemo } from 'react';
import { RFQ, MarketData, DifficultyLevel, Currency, Tenor, TradeType } from '../types';

interface PricingWorksheetProps {
  rfq: RFQ;
  market: MarketData;
  difficulty: DifficultyLevel;
  hintsEnabled: boolean;
  onSubmit: (finalQuote: number) => void;
  onCancel: () => void;
}

const PricingWorksheet: React.FC<PricingWorksheetProps> = ({ rfq, market, difficulty, hintsEnabled, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const T_MAP: Record<Tenor, number> = { '1M': 1/12, '3M': 0.25, '6M': 0.5, '1Y': 1, '2Y': 2, '5Y': 5, '10Y': 10, '30Y': 30 };

  // Calculate "Market Truth" for validation
  const truth = useMemo(() => {
    const t = T_MAP[rfq.tenor];
    const r = market.curves[rfq.ccy1].rates[rfq.tenor];
    const df = Math.exp(-r * t);
    
    if (rfq.type === TradeType.IRS) {
      const floatPV = 1.0 - df;
      const annuity = (1.0 - df) / r;
      const parRate = floatPV / annuity;
      return { df, floatPV, parRate, final: parRate };
    }
    
    if (rfq.type === TradeType.FX_FORWARD) {
      const pair = `${rfq.ccy1}/${rfq.ccy2}`;
      const spot = market.fx[pair]?.bid || 1;
      const rd = market.curves[rfq.ccy1].rates[rfq.tenor];
      const rf = market.curves[rfq.ccy2!]?.rates[rfq.tenor] || 0.05;
      const fwd = spot * (1 + rd * t) / (1 + rf * t);
      return { spot, rd, rf, t, fwd, final: fwd };
    }

    return { final: r };
  }, [rfq, market]);

  const validate = () => {
    const errors: string[] = [];
    if (rfq.type === TradeType.IRS) {
      if (step === 1 && Math.abs(parseFloat(inputs.df) - truth.df!) > 0.005) errors.push("Step 1: Discount Factor is mathematically incorrect.");
      if (step === 2 && Math.abs(parseFloat(inputs.float_pv) - truth.floatPV!) > 0.01) errors.push("Step 2: Floating leg PV mismatch.");
      if (step === 3 && Math.abs(parseFloat(inputs.par_rate)/100 - truth.parRate!) > 0.0001) errors.push("Step 3: Par rate calculation error.");
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };

  const submit = () => {
    const q = parseFloat(inputs.quote) / 100;
    if (!isNaN(q)) onSubmit(q);
  };

  const renderIRSWorksheet = () => (
    <div className="space-y-4 font-mono">
      <div className="bg-[#111] p-3 border border-[#333] text-[10px]">
        <h3 className="text-white font-bold mb-2 uppercase">Pricing Environment: {rfq.ccy1} IRS {rfq.tenor}</h3>
        <p>Market Zero Rate: <span className="text-blue-400">{(market.curves[rfq.ccy1].rates[rfq.tenor]*100).toFixed(4)}%</span></p>
      </div>

      {step === 1 && (
        <div className="bg-black border border-[#222] p-4 space-y-3">
          <label className="block text-[10px] text-gray-500 uppercase font-bold">Step 1: Compute Discount Factor DF(T)</label>
          <input 
            type="text" value={inputs.df || ''} onChange={e => setInputs({...inputs, df: e.target.value})}
            className="w-full bg-black border border-blue-900 text-blue-400 p-2 text-sm outline-none" placeholder="0.0000"
          />
          {hintsEnabled && <p className="text-[9px] text-blue-900 italic">DF(t) = exp(-r * t)</p>}
        </div>
      )}

      {step === 2 && (
        <div className="bg-black border border-[#222] p-4 space-y-3">
          <label className="block text-[10px] text-gray-500 uppercase font-bold">Step 2: Floating-Leg PV Calculation</label>
          <input 
            type="text" value={inputs.float_pv || ''} onChange={e => setInputs({...inputs, float_pv: e.target.value})}
            className="w-full bg-black border border-blue-900 text-blue-400 p-2 text-sm outline-none" placeholder="0.0000"
          />
          {hintsEnabled && <p className="text-[9px] text-blue-900 italic">PV_float = 1 - DF(t)</p>}
        </div>
      )}

      {step === 3 && (
        <div className="bg-black border border-[#222] p-4 space-y-3">
          <label className="block text-[10px] text-gray-500 uppercase font-bold">Step 3: Par Swap Rate (%)</label>
          <input 
            type="text" value={inputs.par_rate || ''} onChange={e => setInputs({...inputs, par_rate: e.target.value})}
            className="w-full bg-black border border-amber-900 text-amber-500 p-2 text-sm outline-none" placeholder="0.0000"
          />
          {hintsEnabled && <p className="text-[9px] text-blue-900 italic">Par rate = PV_float / Annuity</p>}
        </div>
      )}

      {step === 4 && (
        <div className="bg-black border border-[#222] p-4 space-y-3">
          <label className="block text-[10px] text-gray-500 uppercase font-bold">Step 4: Enter Client Bid/Ask Quote (%)</label>
          <input 
            type="text" value={inputs.quote || ''} onChange={e => setInputs({...inputs, quote: e.target.value})}
            className="w-full bg-[#050505] border border-green-900 text-green-500 p-3 text-2xl font-bold outline-none" placeholder="0.0000"
          />
          <p className="text-[9px] text-gray-600 italic uppercase">Applying Desk Spread for {rfq.clientType}.</p>
        </div>
      )}
    </div>
  );

  const renderFXWorksheet = () => (
    <div className="space-y-4 font-mono">
      <div className="bg-[#111] p-3 border border-[#333] text-[10px]">
        <h3 className="text-white font-bold mb-2 uppercase">FX Forward: {rfq.ccy1}/{rfq.ccy2} {rfq.tenor}</h3>
        <p>Spot Rate: <span className="text-blue-400">{truth.spot?.toFixed(4)}</span></p>
      </div>

      <div className="bg-black border border-[#222] p-4 space-y-3">
        <label className="block text-[10px] text-gray-500 uppercase font-bold">Step 1: Calculate IRP Forward Rate</label>
        <input 
          type="text" value={inputs.quote || ''} onChange={e => setInputs({...inputs, quote: e.target.value})}
          className="w-full bg-[#050505] border border-green-900 text-green-500 p-3 text-2xl font-bold outline-none" placeholder="0.0000"
        />
        {hintsEnabled && <p className="text-[9px] text-blue-900 italic">F = S * (1 + rd*T) / (1 + rf*T)</p>}
      </div>
    </div>
  );

  const maxSteps = rfq.type === TradeType.IRS ? 4 : 1;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <div className="bg-[#0c0c0c] border-2 border-[#444] w-full max-w-lg shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="h-8 bg-[#000080] flex items-center justify-between px-3 border-b border-blue-400">
          <span className="text-[10px] font-bold text-white tracking-widest uppercase">Pricing Worksheet - Task_{rfq.id}</span>
          <button onClick={onCancel} className="text-white hover:text-red-500">&times;</button>
        </div>

        <div className="p-6">
          {rfq.type === TradeType.IRS ? renderIRSWorksheet() : renderFXWorksheet()}

          {validationErrors.map((e, i) => (
            <div key={i} className="mt-4 p-2 bg-red-950/20 border border-red-900 text-red-500 text-[10px] uppercase font-bold">! {e}</div>
          ))}

          <div className="mt-8 flex justify-between">
            <button onClick={onCancel} className="px-4 py-2 border border-[#333] text-gray-600 uppercase text-[10px] font-bold">Discard</button>
            {step < maxSteps ? (
              <button onClick={next} className="px-8 py-2 bg-blue-900 text-white uppercase text-[10px] font-bold hover:bg-blue-700">Validate & Next</button>
            ) : (
              <button onClick={submit} className="px-8 py-2 bg-green-700 text-white uppercase text-[10px] font-bold hover:bg-green-600">Submit Quote</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingWorksheet;
