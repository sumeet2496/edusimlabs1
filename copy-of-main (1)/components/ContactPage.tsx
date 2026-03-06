
import React, { useState } from 'react';
import { Send, CheckCircle, Globe, ShieldCheck, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-48 pb-32 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-5xl font-bold text-[#0B1F3A] mb-6 tracking-tight">Request Received</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
            Our institutional partnership team has been notified. A quantitative architect will reach out to schedule your technical briefing within 24 hours.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[12px] font-black text-[#0B1F3A] uppercase tracking-[0.2em] border-b-2 border-[#4DA3FF] pb-1 hover:text-[#4DA3FF] transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-32">
          <div>
            <h1 className="text-6xl lg:text-7xl font-bold text-[#0B1F3A] tracking-tight mb-10 leading-[1.05]">Request an Institutional Demo</h1>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed mb-16">
              Connect with our advisory team to discuss integration workflows, custom scenario design, and pilot programs for your organization.
            </p>

            <div className="space-y-12">
              <div className="flex items-start space-x-8">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] rounded-[2px] shadow-sm">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#0B1F3A] mb-2 tracking-tight">Global Deployment</h4>
                  <p className="text-lg text-slate-500 font-medium">Ready for multi-region academic and corporate environments.</p>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] rounded-[2px] shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#0B1F3A] mb-2 tracking-tight">Secure Infrastructure</h4>
                  <p className="text-lg text-slate-500 font-medium">SOC2 Type II certified with institutional SSO support.</p>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] rounded-[2px] shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#0B1F3A] mb-2 tracking-tight">Partnership Inquiries</h4>
                  <p className="text-lg text-slate-500 font-medium">partnerships@edusimlabs.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-12 lg:p-20 border border-slate-100 rounded-[4px] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">First Name</label>
                  <input required type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">Last Name</label>
                  <input required type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm font-medium" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">Institutional Email</label>
                <input required type="email" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">Organization Name</label>
                <input required type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">Primary Objective</label>
                <select className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm font-bold uppercase tracking-widest cursor-pointer">
                  <option>University Lab Deployment</option>
                  <option>Corporate Analyst Onboarding</option>
                  <option>Custom Scenario Design</option>
                  <option>Professional Certification</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest">Message (Optional)</label>
                <textarea rows={5} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[2px] text-sm focus:outline-none focus:border-[#4DA3FF] shadow-sm resize-none font-medium"></textarea>
              </div>
              <button type="submit" className="w-full py-6 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] hover:bg-[#1F4E79] transition-all flex items-center justify-center space-x-4 group shadow-xl">
                <span>Submit Request</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
