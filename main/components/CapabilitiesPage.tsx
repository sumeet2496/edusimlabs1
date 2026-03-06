
import React from 'react';
import { PLATFORM_CAPABILITIES } from '../constants';
import { ShieldCheck, Database, Zap, Settings, ArrowRight, Layers, BarChart3, Workflow } from 'lucide-react';

interface CapabilitiesPageProps {
  onRequestDemo: () => void;
}

const CapabilitiesPage: React.FC<CapabilitiesPageProps> = ({ onRequestDemo }) => {
  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <header className="max-w-5xl mb-32">
          <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-4">Product Ecosystem</h2>
          <h1 className="text-6xl lg:text-7xl font-bold text-[#0B1F3A] tracking-tight mb-10 leading-[1.05]">Platform Engineering for Institutional Readiness.</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-4xl">
            EduSimLabs is built upon a proprietary multi-variable financial engine. Our architecture bridges the gap between static content and professional execution, ensuring every simulation response is grounded in technical reality.
          </p>
          <div className="mt-12 flex">
             <button 
              onClick={onRequestDemo}
              className="bg-[#0B1F3A] text-white px-12 py-6 font-bold text-sm uppercase tracking-widest hover:bg-[#1F4E79] transition-all rounded-[2px] shadow-xl flex items-center space-x-4 group"
            >
              <span>Request Technical Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* Deep Dive Sections */}
        <div className="space-y-48 mb-48">
           <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div>
                <div className="w-14 h-14 bg-slate-50 text-[#1F4E79] flex items-center justify-center rounded-[2px] mb-10 border border-slate-100">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold text-[#0B1F3A] mb-8 tracking-tight">Real-Time Analytical Engines</h3>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                  Our simulations aren't pre-recorded paths. They are live mathematical environments. When a user adjusts a terminal growth rate in a DCF model or a spread in a fixed income scenario, the entire balance sheet ecosystem responds instantly.
                </p>
                <ul className="space-y-6">
                  {['Dynamic sensitivity tables', 'Instant leverage ratio recalculations', 'Live liquidity tracking'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-4 text-base font-bold text-[#0B1F3A] uppercase tracking-widest">
                      <div className="w-2 h-2 bg-[#4DA3FF] rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-12 rounded-[4px]">
                 <div className="aspect-[16/10] bg-white border border-slate-200 rounded-[2px] shadow-xl flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <div className="flex space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulator: Core-X88 Node-Sync</span>
                    </div>
                    <div className="flex-grow flex items-center justify-center p-16">
                       <div className="w-full space-y-6">
                          <div className="h-3 bg-[#4DA3FF]/20 rounded-full w-3/4" />
                          <div className="h-3 bg-slate-100 rounded-full w-full" />
                          <div className="h-3 bg-[#4DA3FF] rounded-full w-1/2" />
                          <div className="grid grid-cols-3 gap-6 mt-12">
                             <div className="h-24 bg-slate-50 border border-slate-100 rounded-[2px]" />
                             <div className="h-24 bg-slate-50 border border-slate-100 rounded-[2px]" />
                             <div className="h-24 bg-slate-50 border border-slate-100 rounded-[2px]" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="lg:order-2">
                <div className="w-14 h-14 bg-slate-50 text-[#1F4E79] flex items-center justify-center rounded-[2px] mb-10 border border-slate-100">
                  <Workflow className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold text-[#0B1F3A] mb-8 tracking-tight">Decision-Based Branching</h3>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                  EduSimLabs utilizes narrative-driven branching. A strategic decision made in Quarter 1 of a corporate simulation will fundamentally alter the macroeconomic variables and competitor responses in Quarter 4.
                </p>
                <div className="p-8 bg-[#0B1F3A] rounded-[2px] text-white shadow-2xl">
                   <div className="text-[11px] font-black text-[#4DA3FF] uppercase tracking-[0.2em] mb-3">Scenario Alpha Evolution</div>
                   <div className="text-lg font-medium opacity-90 italic leading-relaxed">"The aggressive expansion strategy in Year 1 has increased WACC by 120bps but secured market dominance in APAC regions."</div>
                </div>
              </div>
              <div className="lg:order-1 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-slate-50 border border-dashed border-slate-200 rounded-full flex items-center justify-center">
                    <Layers className="w-20 h-20 text-slate-200" />
                  </div>
                  <div className="absolute top-0 right-0 p-6 bg-white border border-slate-200 shadow-xl translate-x-1/2 -translate-y-1/2 rounded-[2px]">
                    <div className="text-[12px] font-bold text-[#0B1F3A] uppercase tracking-widest">Logic: Multivariable Engine</div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-48">
          {PLATFORM_CAPABILITIES.map((cap, i) => (
            <div key={i} className="p-16 border border-slate-100 bg-[#f8fafc] hover:bg-white hover:border-[#4DA3FF] hover:shadow-2xl transition-all duration-300 rounded-[4px]">
              <div className="text-[#1F4E79] mb-10">{cap.icon}</div>
              <h3 className="text-2xl font-bold text-[#0B1F3A] mb-5 tracking-tight">{cap.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">{cap.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-[#0B1F3A] text-white p-16 lg:p-32 rounded-[4px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1F4E79]/20 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-20 tracking-tight">Institutional-Grade Infrastructure</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-8">
                <ShieldCheck className="w-10 h-10 text-[#4DA3FF]" />
                <h4 className="font-bold text-xl uppercase tracking-widest text-[#4DA3FF]">Security</h4>
                <p className="text-slate-400 text-base leading-relaxed font-medium">Enterprise-standard SSO, multi-factor authentication, and SOC2 Type II compliant data storage protocols.</p>
              </div>
              <div className="space-y-8">
                <Database className="w-10 h-10 text-[#4DA3FF]" />
                <h4 className="font-bold text-xl uppercase tracking-widest text-[#4DA3FF]">Integrations</h4>
                <p className="text-slate-400 text-base leading-relaxed font-medium">Full compatibility with Canvas, Blackboard, and proprietary corporate Learning Management Systems (LMS).</p>
              </div>
              <div className="space-y-8">
                <Settings className="w-10 h-10 text-[#4DA3FF]" />
                <h4 className="font-bold text-xl uppercase tracking-widest text-[#4DA3FF]">Customization</h4>
                <p className="text-slate-400 text-base leading-relaxed font-medium">White-label options and custom scenario branching designed by our internal quantitative architects.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CapabilitiesPage;
