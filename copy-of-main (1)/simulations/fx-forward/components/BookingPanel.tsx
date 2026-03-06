
import React, { useState } from 'react';
import { Trade, CurrencyPair, Tenor } from '../types';

interface Props {
  confirmedQuote: Trade;
  onBook: (bookedTrade: Trade) => void;
  onCancel: () => void;
}

const BookingPanel: React.FC<Props> = ({ confirmedQuote, onBook, onCancel }) => {
  const [rate, setRate] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryRate = parseFloat(rate);
    
    // Validate entry rate matches the client-confirmed rate
    if (Math.abs(entryRate - confirmedQuote.rate) < 0.0001) {
      onBook({
        ...confirmedQuote,
        rate: entryRate,
        status: 'ACCEPTED',
        timestamp: new Date()
      });
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[#0a0a0a] border-2 border-blue-600/50 p-6 rounded-sm shadow-[0_0_50px_rgba(37,99,235,0.2)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1 border-b border-blue-900/30 pb-3">
        <h3 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em]">Institutional Ledger Entry</h3>
        <p className="text-[9px] text-gray-500 uppercase font-black">Counterparty: {confirmedQuote.pair} | {confirmedQuote.tenor}</p>
      </div>

      <div className="bg-black/50 border border-[#222] p-4 space-y-3 rounded-sm">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-gray-500">CLIENT SIDE</span>
          <span className={confirmedQuote.side === 'BUY' ? 'text-blue-400' : 'text-red-400'}>
            {confirmedQuote.side === 'BUY' ? 'BUYING (IMPORTER)' : 'SELLING (EXPORTER)'}
          </span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-gray-500">NOTIONAL</span>
          <span className="text-white font-black">{confirmedQuote.amount.toLocaleString()} {confirmedQuote.pair.split('/')[0]}</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-gray-500">VALUE DATE</span>
          <span className="text-white font-black">{confirmedQuote.tenor} Forward</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div className="space-y-2">
          <label className="text-[9px] text-[#ff9900] font-black uppercase tracking-widest">Confirmed Trade Rate</label>
          <input 
            type="number" 
            step="0.0001"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.0000"
            autoFocus
            className={`w-full bg-black border-2 ${error ? 'border-red-600' : 'border-[#333]'} focus:border-blue-500 text-2xl font-black text-white p-3 outline-none transition-all placeholder:text-gray-900 tracking-tighter rounded-sm`}
          />
          {error && <p className="text-red-500 text-[8px] font-black uppercase animate-pulse">Error: Rate does not match confirmed quote.</p>}
        </div>

        <div className="flex flex-col gap-2">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-white text-black font-black py-4 text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 rounded-sm"
          >
            COMMIT TO PORTFOLIO
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-gray-600 hover:text-white py-2 text-[9px] uppercase font-black transition-colors"
          >
            Abort Booking
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-[8px] text-gray-700 leading-relaxed font-bold uppercase italic">
          Recording an inaccurate rate will cause a reconciliation failure in the bank's back office.
        </p>
      </div>
    </div>
  );
};

export default BookingPanel;
