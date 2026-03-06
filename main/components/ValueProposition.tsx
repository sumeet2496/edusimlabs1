
import React from 'react';
import { GraduationCap, Building2, Landmark, LineChart } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const targets = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Academic Excellence",
      desc: "Enable students to engage with real-market variables. Used by 8 of the Top 10 MBA programs for technical readiness training."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Analyst Onboarding",
      desc: "Standardize technical proficiency across global analyst classes. Reduce time-to-value for new associates by 40%."
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Portfolio Strategy",
      desc: "Stress test asset allocation models in a sandbox that mirrors institutional order-book dynamics and liquidity flows."
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Regulatory Compliance",
      desc: "Train risk managers on Basel III/IV constraints and capital adequacy ratios through immersive stress-test scenarios."
    }
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5">
            <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-6">Institutional Adoption</h2>
            <h3 className="text-5xl font-bold text-[#0B1F3A] mb-12 leading-tight tracking-tight">The Training Standard for <br />Global Capital Markets.</h3>
            
            <div className="space-y-12">
              {targets.map((t, i) => (
                <div key={i} className="flex space-x-8 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-white border border-slate-200 flex items-center justify-center text-[#1F4E79] group-hover:bg-[#0B1F3A] group-hover:text-white transition-all duration-300 rounded-[2px] shadow-sm">
                    {t.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#0B1F3A] mb-2 tracking-tight">{t.title}</h4>
                    <p className="text-slate-500 font-medium text-base leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-7 relative flex items-center">
            <div className="bg-[#0B1F3A] p-5 rounded-[4px] shadow-2xl overflow-hidden w-full">
              <div className="bg-slate-900 aspect-video rounded-[2px] relative overflow-hidden group">
                 <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Enterprise Dashboard" 
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-widest mb-2">Live Environment</div>
                      <div className="text-2xl font-bold text-white tracking-tight">Cross-Asset Portfolio Risk</div>
                    </div>
                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                      SECURED NODE: 884-X
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Callout */}
            <div className="absolute -top-12 -right-12 bg-white border border-slate-100 p-10 shadow-2xl hidden lg:block rounded-[2px] transform rotate-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Status: Optimal</span>
              </div>
              <div className="text-5xl font-bold text-[#0B1F3A] mb-2 tracking-tighter">Gold Standard</div>
              <div className="text-[11px] font-bold text-[#1F4E79] uppercase tracking-[0.25em]">Institutional Certification</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
