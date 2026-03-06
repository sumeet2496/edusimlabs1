
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Corrected import: SimulationCategory is defined in types.ts, while getIcon is exported from constants.tsx
import { getIcon } from '../constants';
import { SimulationCategory } from '../types';
import { ArrowLeft, Play, Lock, Info, ChevronRight } from 'lucide-react';

interface ModuleDetailPageProps {
  category: SimulationCategory;
  onBack: () => void;
}

const ModuleDetailPage: React.FC<ModuleDetailPageProps> = ({ category, onBack }) => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12 hover:text-[#0B1F3A] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Repository</span>
        </button>

        {/* Module Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#0B1F3A] text-white flex items-center justify-center rounded-[2px] shadow-lg">
                {React.cloneElement(getIcon(category.icon) as React.ReactElement, { className: "w-6 h-6" })}
              </div>
              <h1 className="text-4xl font-bold text-[#0B1F3A] tracking-tight">{category.title}</h1>
            </div>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {category.description} This module pathway contains {category.simulations.length} specialized technical environments.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2px] flex flex-col items-center justify-center text-center md:w-48">
            <div className="text-2xl font-bold text-[#0B1F3A]">{category.simulations.length}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Labs</div>
          </div>
        </header>

        {/* Simulation Stack - Rectangular boxes stacked one after another */}
        <div className="space-y-6">
          <div className="text-[10px] font-black text-[#0B1F3A] uppercase tracking-[0.3em] mb-8">Simulation Queue</div>

          {category.simulations.map((sim, index) => (
            <div
              key={sim.id}
              className="group flex flex-col md:flex-row items-center bg-[#fcfdfe] border border-slate-100 hover:border-[#4DA3FF] hover:bg-white transition-all duration-300 rounded-[2px] overflow-hidden"
            >
              {/* index badge */}
              <div className="hidden md:flex items-center justify-center w-20 self-stretch bg-slate-50/50 text-[11px] font-black text-slate-300 group-hover:text-[#4DA3FF] transition-colors border-r border-slate-100">
                {(index + 1).toString().padStart(2, '0')}
              </div>

              {/* main content */}
              <div className="flex-grow p-8">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#1F4E79] transition-colors">{sim.title}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-2xl">
                  {sim.description}
                </p>
              </div>

              {/* action button */}
              <div className="w-full md:w-auto p-6 md:p-8 flex items-center justify-end md:justify-center border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/20">
                <button
                  onClick={() => {
                    if (sim.internalRoute) {
                      navigate(sim.internalRoute);
                    } else {
                      alert(`Launching ${sim.title} secure environment...`);
                    }
                  }}
                  className="flex items-center space-x-3 bg-white border border-slate-200 px-6 py-3 rounded-[2px] text-[10px] font-black text-[#0B1F3A] uppercase tracking-widest hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] transition-all shadow-sm group/btn"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch Lab</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 p-8 border border-dashed border-slate-200 rounded-[2px] flex items-start space-x-6">
          <Info className="w-6 h-6 text-[#4DA3FF] flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-widest mb-2">Technical Note</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              All simulations in the {category.title} module require a stable internet connection for real-time math engine syncing.
              Results are stored via institutional API and accessible in the Admin Dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
