
import React from 'react';
import { Country } from '../types';

interface CountryCardProps {
  country: Country;
  allocation: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, allocation, isSelected, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800 bg-slate-900/30 hover:border-slate-600'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold text-slate-100">{country.name}</h4>
          <span className="text-xs text-slate-500 uppercase tracking-tighter">{country.businessType}</span>
        </div>
        <div className="text-right">
          <div className="text-amber-500 font-bold text-lg">
            ${(allocation / 1_000_000).toFixed(1)}M
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-slate-500">Growth:</div>
        <div className="text-slate-200 text-right">{country.growthProfile}</div>
        <div className="text-slate-500">FX Stability:</div>
        <div className="text-slate-200 text-right">{country.fxStability}</div>
        <div className="text-slate-500">Friction:</div>
        <div className="text-slate-200 text-right">{country.repatriationFriction}</div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Details Available</span>
        {isSelected && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
      </div>
    </div>
  );
};
