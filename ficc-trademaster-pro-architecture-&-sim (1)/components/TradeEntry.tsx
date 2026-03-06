
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Currency, TradeType, Tenor, MarketData } from '../types';
import TerminalPanel from './TerminalPanel';

interface TradeEntryProps {
  market: MarketData;
  onExecute: (trade: any) => void;
  onClose: () => void;
}

const TradeEntry: React.FC<TradeEntryProps> = ({ market, onExecute, onClose }) => {
  const [type, setType] = useState<TradeType>(TradeType.IRS);
  const [ccy, setCcy] = useState<Currency>(Currency.USD);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [notional, setNotional] = useState<number>(10000000);
  const [tenor, setTenor] = useState<Tenor>('5Y');
  const [rate, setRate] = useState<string>('');

  // Draggable logic
  const [pos, setPos] = useState({ x: 250, y: 150 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Market Reference logic
  const marketRefRate = useMemo(() => {
    if (type === TradeType.IRS || type === TradeType.BOND) {
      return (market.curves[ccy].rates[tenor] * 100).toFixed(4);
    }
    if (type === TradeType.FUTURE) {
      // Futures price = 100 - rate
      return (100 - (market.curves[ccy].rates[tenor] * 100)).toFixed(3);
    }
    if (type === TradeType.FX_FORWARD) {
      const pair = `${ccy}/USD`;
      const spot = market.fx[pair]?.bid || 1;
      const fwdPoints = market.fx[pair]?.forwardPoints[tenor] || 0;
      return (spot + fwdPoints / 10000).toFixed(4);
    }
    return "0.0000";
  }, [market, type, ccy, tenor]);

  // Update rate when market moves if field is empty or user wants "Snap"
  const snapToMarket = () => setRate(marketRefRate);

  useEffect(() => {
    // Standard notions per asset
    if (type === TradeType.BOND || type === TradeType.IRS) setNotional(10000000);
    if (type === TradeType.FUTURE) setNotional(1000000); // 1M per contract simplified
    if (type === TradeType.FX_FORWARD) setNotional(5000000);
    
    // Auto-snap rate on first select of asset
    setRate(marketRefRate);
  }, [type, ccy, tenor]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) return;
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const handleMouseUp = () => isDragging.current = false;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericRate = parseFloat(rate) / 100;
    if (isNaN(numericRate)) return;

    onExecute({
      type,
      currency1: ccy,
      side,
      notional,
      tenor,
      fixedRate: numericRate,
      counterparty: 'STREET_PROP',
      clientType: 'INTERDEALER'
    });
  };

  return (
    <div 
      className="fixed z-[110] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-[#555] bg-[#050505] w-[550px]"
      style={{ left: pos.x, top: pos.y }}
    >
      <div onMouseDown={handleMouseDown} className="cursor-move">
        <TerminalPanel title="DIRECT TRADING TERMINAL <GO>" onClose={onClose}>
          <div className="p-6 font-mono text-[11px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-gray-500 uppercase font-bold text-[9px] block mb-1.5 tracking-widest">Asset Category</span>
                    <select 
                      value={type} 
                      onChange={e => setType(e.target.value as TradeType)}
                      className="bg-black text-[#00ffff] border border-[#333] w-full p-2 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value={TradeType.IRS}>SWAP (IRS)</option>
                      <option value={TradeType.BOND}>TREASURY BOND</option>
                      <option value={TradeType.FUTURE}>STIR FUTURE</option>
                      <option value={TradeType.FX_FORWARD}>FX FORWARD</option>
                      <option value={TradeType.CCS}>CROSS-CCY SWAP</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-500 uppercase font-bold text-[9px] block mb-1.5 tracking-widest">Currency Unit</span>
                    <div className="grid grid-cols-4 gap-1">
                      {Object.values(Currency).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCcy(c)}
                          className={`py-2 text-[10px] border font-bold transition-all ${ccy === c ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-[#222] text-gray-600 hover:border-[#444]'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-gray-500 uppercase font-bold text-[9px] block mb-1.5 tracking-widest">Execution Side</span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setSide('BUY')}
                        className={`flex-1 py-2 border font-bold ${side === 'BUY' ? 'bg-blue-900 text-blue-100 border-blue-500' : 'border-[#222] text-gray-600'}`}
                      >
                        {type === TradeType.IRS ? 'RECEIVE' : (type === TradeType.BOND ? 'BUY' : 'LONG')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSide('SELL')}
                        className={`flex-1 py-2 border font-bold ${side === 'SELL' ? 'bg-red-900 text-red-100 border-red-500' : 'border-[#222] text-gray-600'}`}
                      >
                        {type === TradeType.IRS ? 'PAY' : (type === TradeType.BOND ? 'SELL' : 'SHORT')}
                      </button>
                    </div>
                  </label>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-500 uppercase font-bold text-[9px] block mb-1.5">Tenor</span>
                      <select 
                        value={tenor} 
                        onChange={e => setTenor(e.target.value as Tenor)}
                        className="bg-black text-white border border-[#333] w-full p-2 outline-none focus:border-blue-500"
                      >
                        {['1M', '3M', '6M', '1Y', '2Y', '5Y', '10Y', '30Y'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-500 uppercase font-bold text-[9px] block mb-1.5">Notional (M)</span>
                      <input 
                        type="number"
                        value={notional / 1000000}
                        onChange={e => setNotional(parseFloat(e.target.value) * 1000000)}
                        className="bg-black text-white border border-[#333] w-full p-2 outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>

                  <div className="block bg-[#0a0a0a] border border-[#222] p-4 relative group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-amber-500 uppercase font-bold text-[9px] tracking-[0.2em]">Execution Level</span>
                      <button 
                        type="button"
                        onClick={snapToMarket}
                        className="text-[8px] bg-blue-950 text-blue-400 px-1 hover:text-white transition-colors border border-blue-900"
                      >
                        SNAP MKT
                      </button>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <input 
                        type="text"
                        placeholder="0.0000"
                        value={rate}
                        onChange={e => setRate(e.target.value)}
                        className="bg-transparent text-[#00ff00] text-5xl font-bold outline-none w-full selection:bg-green-900"
                      />
                      <span className="text-xl text-green-900 font-bold">%</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-[#1a1a1a] pt-2">
                       <span className="text-[8px] text-gray-600 uppercase">Mkt Ref:</span>
                       <span className="text-[10px] text-blue-400 font-bold">{marketRefRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#222]">
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#000080] hover:bg-[#0000c0] text-white font-bold uppercase tracking-[0.5em] text-[12px] shadow-lg border border-white/10 active:translate-y-0.5 transition-all"
                >
                  Confirm Instant Execution
                </button>
              </div>
            </form>
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
};

export default TradeEntry;
