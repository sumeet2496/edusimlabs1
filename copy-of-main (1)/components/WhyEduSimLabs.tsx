
import React from 'react';
import { CheckCircle2, Cpu, Brain, Zap } from 'lucide-react';

const WhyEduSimLabs: React.FC = () => {
  const reasons = [
    {
      title: "Case-Based Learning",
      desc: "Go beyond abstract formulas with structured, narrative-driven institutional scenarios.",
      icon: <Brain className="w-7 h-7" />
    },
    {
      title: "Real-World Financial Logic",
      desc: "Proprietary engines that replicate the mathematical complexity of professional desks.",
      icon: <Cpu className="w-7 h-7" />
    },
    {
      title: "Decision-Driven Simulations",
      desc: "Every variable affects the outcome. Practice strategic pivots in dynamic market sandboxes.",
      icon: <Zap className="w-7 h-7" />
    },
    {
      title: "Professional Pedagogy",
      desc: "Designed by finance practitioners and cognitive scientists for maximum skill transfer.",
      icon: <CheckCircle2 className="w-7 h-7" />
    }
  ];

  return (
    <section id="methodology" className="py-32 bg-[#0B1F3A] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-[0.4em] mb-6">Why EduSimLabs</h2>
            <h3 className="text-5xl font-bold mb-8 leading-tight tracking-tight">Technical Proficiency Through <br />Immersive Execution.</h3>
            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-10">
              Unlike traditional video courses, EduSimLabs forces active decision-making. 
              We don't just show you how to build a model—we make you manage the assets.
            </p>
            <div className="p-10 bg-[#1F4E79]/30 border border-[#1F4E79] rounded-[4px] inline-block">
              <div className="text-5xl font-bold mb-2">94%</div>
              <div className="text-xs font-bold text-[#4DA3FF] uppercase tracking-widest">User Competency Improvement</div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-8">
              {reasons.map((r, i) => (
                <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[4px] hover:bg-white/10 transition-all group">
                  <div className="text-[#4DA3FF] mb-8 group-hover:scale-110 transition-transform">
                    {r.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{r.title}</h4>
                  <p className="text-slate-400 text-base leading-relaxed font-medium">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEduSimLabs;
