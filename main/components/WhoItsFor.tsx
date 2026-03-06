
import React from 'react';
import { AUDIENCE_SEGMENTS } from '../constants';

const WhoItsFor: React.FC = () => {
  return (
    <section id="enterprise" className="py-32 bg-[#f8fafc]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="mb-24 text-center">
          <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-4">Who it's for</h2>
          <h3 className="text-5xl font-bold text-[#0B1F3A] tracking-tight">Empowering Every Tier of the <br />Financial Hierarchy.</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AUDIENCE_SEGMENTS.map((seg, i) => (
            <div key={i} className="bg-white p-12 rounded-[4px] border border-slate-100 shadow-sm hover:border-[#4DA3FF] transition-all group">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] mb-10 group-hover:bg-[#0B1F3A] group-hover:text-white transition-all rounded-[2px]">
                {seg.icon}
              </div>
              <h4 className="text-2xl font-bold text-[#0B1F3A] mb-4">{seg.label}</h4>
              <p className="text-slate-500 text-base font-medium leading-relaxed">
                {seg.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
