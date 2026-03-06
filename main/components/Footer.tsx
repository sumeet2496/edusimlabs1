
import React from 'react';

interface FooterProps {
  onNavigate: (href: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-32 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-12 gap-16 mb-32">
          <div className="md:col-span-5">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 mb-10"
            >
              <div className="w-10 h-10 bg-[#0B1F3A] flex items-center justify-center rounded-[2px]">
                <span className="text-white font-bold text-xl tracking-tighter">ESL</span>
              </div>
              <span className="text-3xl font-bold text-[#0B1F3A] tracking-tighter">EduSimLabs</span>
            </button>
            <p className="text-slate-500 font-medium text-base leading-relaxed mb-10 max-w-md">
              EduSimLabs provides institutional-grade interactive simulation technology for professional financial education and technical skills assessment.
            </p>
            <div className="flex space-x-5">
              <div className="w-11 h-11 border border-slate-100 flex items-center justify-center rounded-[2px] hover:border-[#4DA3FF] transition-colors cursor-pointer">
                <span className="text-[11px] font-black text-[#0B1F3A]">IN</span>
              </div>
              <div className="w-11 h-11 border border-slate-100 flex items-center justify-center rounded-[2px] hover:border-[#4DA3FF] transition-colors cursor-pointer">
                <span className="text-[11px] font-black text-[#0B1F3A]">TW</span>
              </div>
              <div className="w-11 h-11 border border-slate-100 flex items-center justify-center rounded-[2px] hover:border-[#4DA3FF] transition-colors cursor-pointer">
                <span className="text-[11px] font-black text-[#0B1F3A]">BB</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h5 className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-[0.2em] mb-10">Solutions</h5>
            <ul className="space-y-5 text-[14px] text-slate-500 font-bold uppercase tracking-wider">
              <li><button onClick={() => onNavigate('lab-catalog')} className="hover:text-[#4DA3FF] transition-colors">Lab Catalog</button></li>
              <li><button onClick={() => onNavigate('university-tier')} className="hover:text-[#4DA3FF] transition-colors">University Tier</button></li>
              <li><button onClick={() => onNavigate('bank-training')} className="hover:text-[#4DA3FF] transition-colors">Bank Training</button></li>
              <li><button onClick={() => onNavigate('certifications')} className="hover:text-[#4DA3FF] transition-colors">Certifications</button></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-[0.2em] mb-10">Intelligence</h5>
            <ul className="space-y-5 text-[14px] text-slate-500 font-bold uppercase tracking-wider">
              <li><button onClick={() => onNavigate('whitepapers')} className="hover:text-[#4DA3FF] transition-colors">Whitepapers</button></li>
              <li><button onClick={() => onNavigate('advisory-board')} className="hover:text-[#4DA3FF] transition-colors">Advisory Board</button></li>
              <li><button onClick={() => onNavigate('case-studies')} className="hover:text-[#4DA3FF] transition-colors">Case Studies</button></li>
              <li><button onClick={() => onNavigate('research-unit')} className="hover:text-[#4DA3FF] transition-colors">Research Unit</button></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h5 className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-[0.2em] mb-10">Support</h5>
            <ul className="space-y-5 text-[14px] text-slate-500 font-bold uppercase tracking-wider">
              <li><button onClick={() => onNavigate('documentation')} className="hover:text-[#4DA3FF] transition-colors">Documentation</button></li>
              <li><button onClick={() => onNavigate('api-integration')} className="hover:text-[#4DA3FF] transition-colors">API Integration</button></li>
              <li><button onClick={() => onNavigate('security-audit')} className="hover:text-[#4DA3FF] transition-colors">Security Audit</button></li>
              <li><button onClick={() => onNavigate('legal-terms')} className="hover:text-[#4DA3FF] transition-colors">Legal Terms</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">
          <p>© {new Date().getFullYear()} EDUSIMLABS GLOBAL HOLDINGS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-10 mt-8 md:mt-0">
            <span className="cursor-pointer hover:text-[#0B1F3A]">SITEMAP</span>
            <span className="cursor-pointer hover:text-[#0B1F3A]">DATA PRIVACY</span>
            <span className="cursor-pointer hover:text-[#0B1F3A]">SUSTAINABILITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
