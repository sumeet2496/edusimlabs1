
import React, { useState } from 'react';
import { Shield, ArrowRight, Mail, Lock, CheckCircle2, Building, HelpCircle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onNavigateToContact: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onNavigateToContact }) => {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate enterprise auth delay
    setTimeout(() => {
      setIsVerifying(false);
      onAuthSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6 pt-32">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0B1F3A] text-white flex items-center justify-center rounded-[4px] shadow-xl mx-auto mb-6">
            <span className="font-bold text-2xl tracking-tighter">ESL</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0B1F3A] tracking-tight">
            Institutional Portal
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Access your organization's secure simulation node.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[4px] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0B1F3A] uppercase tracking-widest block">Work / Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-medium" 
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-[#0B1F3A] uppercase tracking-widest block">Security Credential</label>
                <button type="button" className="text-[9px] font-bold text-[#4DA3FF] uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] focus:bg-white transition-all font-medium" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-4 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#1F4E79] transition-all flex items-center justify-center space-x-3 group disabled:opacity-70 shadow-lg shadow-[#0B1F3A]/10"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium flex items-center justify-center space-x-1">
              <span>Need institutional access?</span>
              <button 
                onClick={onNavigateToContact}
                className="text-[#0B1F3A] font-bold hover:underline inline-flex items-center"
              >
                Request a Demo
              </button>
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <Shield className="w-5 h-5 text-slate-300 mx-auto mb-2" />
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">AES-256 Encrypted</div>
          </div>
          <div className="text-center">
            <CheckCircle2 className="w-5 h-5 text-slate-300 mx-auto mb-2" />
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SOC2 Verified</div>
          </div>
          <div className="text-center">
            <Building className="w-5 h-5 text-slate-300 mx-auto mb-2" />
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Institutional Node</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
