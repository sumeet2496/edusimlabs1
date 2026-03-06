
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ChevronRight, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (href: string) => void;
  currentPage: string;
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B1F3A]/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 group"
        >
          {/* Logo Box - White */}
          <div className="w-9 h-9 bg-white flex items-center justify-center rounded-[2px] shadow-sm group-hover:bg-[#4DA3FF] transition-colors">
            <span className="text-[#0B1F3A] font-bold text-lg tracking-tighter">ESL</span>
          </div>
          {/* Brand Name - White */}
          <span className="text-xl font-bold tracking-tight text-white">EduSimLabs</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.href)}
              className={`text-[13px] font-semibold transition-colors uppercase tracking-[0.1em] ${currentPage === item.href ? 'text-[#4DA3FF]' : 'text-slate-300 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => onNavigate('portal')}
                className="text-[13px] font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-[0.1em]"
              >
                Portal Login
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="bg-[#4DA3FF] text-[#0B1F3A] px-6 py-3 rounded-[2px] text-[13px] font-bold flex items-center space-x-2 hover:bg-white transition-all shadow-sm"
              >
                <span>REQUEST DEMO</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
              <div className="w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full border border-white/20">
                <User className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0B1F3A] shadow-xl border-t border-white/10 py-8 px-8">
          <div className="flex flex-col space-y-5">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.label} 
                onClick={() => { onNavigate(item.href); setMobileMenuOpen(false); }}
                className={`text-left text-lg font-bold uppercase tracking-tight ${currentPage === item.href ? 'text-[#4DA3FF]' : 'text-white'}`}
              >
                {item.label}
              </button>
            ))}
            <hr className="border-white/10" />
            <button 
              onClick={() => { onNavigate('portal'); setMobileMenuOpen(false); }}
              className="w-full py-4 text-white font-bold uppercase text-sm text-left"
            >
              Portal Login
            </button>
            <button 
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="w-full py-4 bg-[#4DA3FF] text-[#0B1F3A] font-bold rounded-[2px] uppercase text-sm tracking-widest text-center"
            >
              Request Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
