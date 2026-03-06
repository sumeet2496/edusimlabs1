
import React from 'react';
import { SAMPLE_SIMULATIONS } from '../constants';
import { ChevronRight } from 'lucide-react';

const SampleSimulations: React.FC = () => {
  return (
    <section id="samples" className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-4">Sample Labs</h2>
            <h3 className="text-5xl font-bold text-[#0B1F3A] tracking-tight">Explore Our Active Environments</h3>
          </div>
          <button className="flex items-center space-x-2 text-[12px] font-black text-[#0B1F3A] uppercase tracking-[0.2em] group">
            <span>View All Simulations</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SAMPLE_SIMULATIONS.map((sim, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[4px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={sim.image} 
                  alt={sim.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/30 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <h4 className="text-2xl font-bold text-white mb-3">{sim.title}</h4>
                <p className="text-slate-300 text-base font-medium mb-8 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-300">
                  {sim.description}
                </p>
                <div className="flex items-center space-x-3 text-[#4DA3FF] text-[11px] font-black uppercase tracking-widest">
                  <span>Start Module</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SampleSimulations;
