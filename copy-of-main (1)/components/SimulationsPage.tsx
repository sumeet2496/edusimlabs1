
import React, { useState } from 'react';
import { SIMULATION_CATEGORIES, getIcon } from '../constants';
import { ArrowRight, Lock, Search, Filter, Info, MessageSquare } from 'lucide-react';

interface SimulationsPageProps {
  onExploreModule: (moduleId: string) => void;
}

const SimulationsPage: React.FC<SimulationsPageProps> = ({ onExploreModule }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = SIMULATION_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-40 pb-32 bg-[#fcfdfe] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-[#0B1F3A] tracking-tight mb-5">Simulation Repository</h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Access 50+ institutional-grade modules engineered for professional financial education.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find a module..."
                  className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] transition-all w-72 shadow-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-4 bg-white border border-slate-200 rounded-[2px] text-slate-500 hover:text-[#0B1F3A] transition-colors shadow-sm">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Repository Grid - Responsive Scaling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="group flex flex-col bg-white border border-slate-200 hover:border-[#4DA3FF] hover:shadow-2xl transition-all duration-300 rounded-[2px]">
              {/* Card Header Area */}
              <div className="p-8 border-b border-slate-50">
                <div className="w-10 h-10 bg-[#0B1F3A] text-white flex items-center justify-center rounded-[2px] mb-6 shadow-sm group-hover:bg-[#1F4E79] transition-colors">
                  {React.cloneElement(getIcon(cat.icon) as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#1F4E79] transition-colors tracking-tight">{cat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {/* Subtopics / Tags */}
              <div className="px-8 py-6 flex-grow">
                <div className="flex flex-wrap gap-2">
                  {cat.subtopics.slice(0, 3).map((sub, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-[2px] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {sub}
                    </span>
                  ))}
                  {cat.subtopics.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-300 self-center">+{cat.subtopics.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => onExploreModule(cat.id)}
                  className="inline-flex items-center space-x-3 text-[11px] font-black text-[#0B1F3A] uppercase tracking-[0.15em] hover:text-[#4DA3FF] transition-colors"
                >
                  <span>Explore Path</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="group/lock relative">
                  <Lock className="w-4 h-4 text-slate-300 hover:text-[#1F4E79] transition-colors cursor-help" />
                  <div className="absolute bottom-full right-0 mb-3 w-48 p-4 bg-[#0B1F3A] text-white text-[10px] font-bold uppercase tracking-widest leading-relaxed rounded-[2px] opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none shadow-2xl z-10">
                    Institutional verification required.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
              <Info className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">No modules found</h3>
            <p className="text-slate-500 text-lg mt-2 font-medium">Try adjusting your search terms or filter criteria.</p>
          </div>
        )}

        {/* Informational Callout */}
        <div className="mt-24 p-16 bg-[#0B1F3A] rounded-[4px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/4 h-full bg-[#4DA3FF]/10 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left">
              <div className="flex items-center space-x-4 mb-3">
                <MessageSquare className="w-8 h-8 text-[#4DA3FF]" />
                <h4 className="text-3xl font-bold text-white tracking-tight">Can't find a specific module?</h4>
              </div>
              <p className="text-slate-400 text-lg font-medium max-w-2xl">Our architecture team can build custom scenario branches and proprietary engines tailored to your institutional training objectives.</p>
            </div>
            <button 
              onClick={() => alert("Connecting to our Expert Advisory Board...")}
              className="whitespace-nowrap px-12 py-5 bg-[#4DA3FF] text-[#0B1F3A] font-bold text-[12px] uppercase tracking-widest rounded-[2px] hover:bg-white transition-all shadow-xl"
            >
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationsPage;
