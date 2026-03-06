
import React from 'react';
import { SIMULATION_CATEGORIES, getIcon } from '../constants';
import { Plus, ArrowRight } from 'lucide-react';

interface SimulationGridProps {
  onExplore: () => void;
}

const SimulationGrid: React.FC<SimulationGridProps> = ({ onExplore }) => {
  return (
    <section id="simulations" className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="mb-24 text-center max-w-4xl mx-auto">
          <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-4">What We Offer</h2>
          <h3 className="text-5xl font-bold text-[#0B1F3A] tracking-tight">Institutional Training Verticals</h3>
          <p className="mt-6 text-xl text-slate-500 font-medium leading-relaxed">
            Ten core analytical domains architected to simulate the multi-variable complexity of professional market environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {SIMULATION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="group bg-[#f8fafc] border border-slate-100 p-8 hover:bg-white hover:border-[#4DA3FF] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full rounded-[4px]">
              <div className="mb-8 flex items-center justify-between">
                <div className="text-[#0B1F3A] group-hover:text-[#4DA3FF] transition-colors duration-300">
                  {getIcon(cat.icon)}
                </div>
                <Plus className="w-4 h-4 text-slate-300 group-hover:text-[#4DA3FF] transition-colors" />
              </div>
              
              <h4 className="text-lg font-bold text-[#0B1F3A] mb-3">{cat.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">{cat.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-200/50">
                <button 
                  onClick={onExplore}
                  className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-[#4DA3FF] transition-colors"
                >
                  <span>View Repository</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimulationGrid;
