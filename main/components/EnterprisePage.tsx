
import React from 'react';
import { Building2, Landmark, GraduationCap, ArrowUpRight } from 'lucide-react';

const EnterprisePage: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <header className="max-w-4xl mb-32">
          <h1 className="text-6xl lg:text-7xl font-bold text-[#0B1F3A] tracking-tight mb-10 leading-[1.05]">Strategic Partnerships</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-4xl">
            From the world's most prestigious business schools to global bulge bracket banks, EduSimLabs is the trusted standard for technical excellence and professional verification.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10 mb-48">
          <div className="p-16 border-2 border-slate-100 hover:border-[#0B1F3A] transition-colors rounded-[4px] flex flex-col h-full group">
            <GraduationCap className="w-16 h-16 text-[#1F4E79] mb-10 group-hover:text-[#4DA3FF] transition-colors" />
            <h3 className="text-3xl font-bold text-[#0B1F3A] mb-6 tracking-tight">Academic Tier</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium mb-12 flex-grow">
              Equip your MBA and Undergraduate Finance programs with clinical-grade laboratories. Seamlessly transition students from theoretical concepts to desk-ready skills.
            </p>
            <button className="flex items-center justify-between text-[12px] font-black uppercase tracking-widest text-[#0B1F3A] group/btn">
              <span>View Case Studies</span>
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="p-16 border-2 border-slate-100 hover:border-[#0B1F3A] transition-colors rounded-[4px] flex flex-col h-full bg-[#fcfdfe] group">
            <Building2 className="w-16 h-16 text-[#1F4E79] mb-10 group-hover:text-[#4DA3FF] transition-colors" />
            <h3 className="text-3xl font-bold text-[#0B1F3A] mb-6 tracking-tight">Corporate Tier</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium mb-12 flex-grow">
              Onboard incoming analyst classes with a standardized technical benchmark. Accelerate the transition from theoretical education to high-fidelity desk execution.
            </p>
            <button className="flex items-center justify-between text-[12px] font-black uppercase tracking-widest text-[#0B1F3A] group/btn">
              <span>Explore Bank Models</span>
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="p-16 border-2 border-slate-100 hover:border-[#0B1F3A] transition-colors rounded-[4px] flex flex-col h-full group">
            <Landmark className="w-16 h-16 text-[#1F4E79] mb-10 group-hover:text-[#4DA3FF] transition-colors" />
            <h3 className="text-3xl font-bold text-[#0B1F3A] mb-6 tracking-tight">Government & FI</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium mb-12 flex-grow">
              Utilize high-fidelity stress testing environments for regulatory training, central bank modeling, and cross-border financial surveillance simulations.
            </p>
            <button className="flex items-center justify-between text-[12px] font-black uppercase tracking-widest text-[#0B1F3A] group/btn">
              <span>Request Briefing</span>
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        <section className="bg-slate-50 border border-slate-100 p-16 lg:p-32 rounded-[4px] text-center">
          <h2 className="text-5xl font-bold text-[#0B1F3A] mb-10 tracking-tight">Deploy Institutional Training Today.</h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">Connect with our partnership team for a deep-dive into our implementation methodology, customized scenario design, and volume licensing structures.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <button className="bg-[#0B1F3A] text-white px-14 py-6 font-bold text-sm uppercase tracking-widest hover:bg-[#1F4E79] transition-all rounded-[2px] shadow-xl">Schedule Demo</button>
            <button className="bg-white border-2 border-slate-200 text-[#0B1F3A] px-14 py-6 font-bold text-sm uppercase tracking-widest hover:border-[#4DA3FF] transition-all rounded-[2px]">Technical Specs</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnterprisePage;
