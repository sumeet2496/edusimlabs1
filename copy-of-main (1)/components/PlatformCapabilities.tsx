
import React from 'react';
import { PLATFORM_CAPABILITIES } from '../constants';
import { ChevronRight } from 'lucide-react';

const PlatformCapabilities: React.FC = () => {
  return (
    <section id="capabilities" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-4">Platform Capabilities</h2>
            <h3 className="text-5xl font-bold text-[#0B1F3A] mb-8 tracking-tight leading-tight">
              An Integrated Engine for Professional Readiness.
            </h3>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
              EduSimLabs isn't just a content library; it's a sophisticated technical sandbox designed to withstand the rigors of institutional training and academic evaluation.
            </p>
            <div className="flex">
              <button className="flex items-center space-x-2 text-[12px] font-black text-[#0B1F3A] uppercase tracking-[0.2em] group border-b-2 border-[#4DA3FF] pb-1">
                <span>View System Architecture</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[4px] overflow-hidden shadow-sm">
              {PLATFORM_CAPABILITIES.map((cap, i) => (
                <div key={i} className="bg-white p-12 hover:bg-[#fcfdfe] transition-colors group">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] mb-8 group-hover:bg-[#0B1F3A] group-hover:text-white transition-all rounded-[2px]">
                    {cap.icon}
                  </div>
                  <h4 className="text-xl font-bold text-[#0B1F3A] mb-4">{cap.title}</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">
                    {cap.desc}
                  </p>
                </div>
              ))}
              {/* Extra Slot for Dashboard Preview */}
              <div className="bg-[#f8fafc] p-12 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-1 bg-[#4DA3FF] mb-8" />
                <h4 className="text-base font-bold text-[#0B1F3A] uppercase tracking-widest mb-3">Admin Panel</h4>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">
                  Enterprise-Grade Analytics Integrated
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-[#f8fafc] -z-10 translate-x-1/2 -skew-x-12" />
    </section>
  );
};

export default PlatformCapabilities;
