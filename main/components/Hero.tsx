
import React from 'react';
import { ShieldCheck, Cpu, Database, Globe } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onRequestDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onRequestDemo }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Financial District"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/75 to-[#0B1F3A]/30" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10 w-full">
        <div className="max-w-4xl space-y-12">
          <div className="h-4" /> {/* Adjusted spacer since label was removed */}
          
          <h1 className="text-6xl lg:text-[100px] font-bold text-white leading-[0.95] tracking-tight">
            Learn Finance <br />
            by <span className="text-[#4DA3FF]">Doing.</span>
          </h1>
          
          <p className="text-2xl lg:text-3xl text-slate-300 leading-relaxed font-medium max-w-2xl opacity-90">
            Interactive high-fidelity simulations for capital markets, valuation, and technical risk assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-8 pt-6">
            <button 
              onClick={onExplore}
              className="bg-[#4DA3FF] text-[#0B1F3A] px-14 py-6 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-[#4DA3FF]/20"
            >
              Explore Repository
            </button>
            <button 
              onClick={onRequestDemo}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-14 py-6 rounded-[2px] font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#0B1F3A] transition-all"
            >
              Request Briefing
            </button>
          </div>

          {/* Institutional Pillars Section */}
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10">
            <div className="group cursor-default">
              <div className="flex items-center space-x-3 text-white mb-3">
                <Cpu className="w-6 h-6 text-[#4DA3FF]" />
                <div className="text-lg font-bold tracking-tight">Proprietary Engine</div>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em]">Multi-Variable Analysis</div>
            </div>
            
            <div className="group cursor-default">
              <div className="flex items-center space-x-3 text-white mb-3">
                <ShieldCheck className="w-6 h-6 text-[#4DA3FF]" />
                <div className="text-lg font-bold tracking-tight">Institutional SSO</div>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em]">Enterprise Hardened</div>
            </div>

            <div className="hidden md:block group cursor-default">
              <div className="flex items-center space-x-3 text-white mb-3">
                <Database className="w-6 h-6 text-[#4DA3FF]" />
                <div className="text-lg font-bold tracking-tight">SOC2 Type II</div>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em]">Secure Ledger Tech</div>
            </div>

            <div className="hidden md:block group cursor-default">
              <div className="flex items-center space-x-3 text-white mb-3">
                <Globe className="w-6 h-6 text-[#4DA3FF]" />
                <div className="text-lg font-bold tracking-tight">Global Cluster</div>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em]">Global Latency Sync</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom overlay for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent opacity-10" />
    </section>
  );
};

export default Hero;
