
import React from 'react';
import { ArrowRight, Download, FileText, ChevronRight, BookOpen, Activity, Lock } from 'lucide-react';

interface GenericContentPageProps {
  title: string;
  subtitle: string;
  category: string;
  sections: { title: string; content: string; icon?: React.ReactNode }[];
  cta?: { label: string; action: () => void };
}

const GenericContentPage: React.FC<GenericContentPageProps> = ({ title, subtitle, category, sections, cta }) => {
  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <header className="max-w-5xl mb-32">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-10 bg-[#4DA3FF]" />
            <span className="text-[11px] font-black text-[#4DA3FF] uppercase tracking-[0.4em]">{category}</span>
          </div>
          <h1 className="text-6xl font-bold text-[#0B1F3A] tracking-tight mb-10 leading-[1.1]">{title}</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-4xl">
            {subtitle}
          </p>
          {cta && (
            <div className="mt-12">
              <button 
                onClick={cta.action}
                className="bg-[#0B1F3A] text-white px-12 py-5 font-bold text-sm uppercase tracking-widest hover:bg-[#1F4E79] transition-all rounded-[2px] shadow-xl flex items-center space-x-4 group"
              >
                <span>{cta.label}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </header>

        <div className="grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-24">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center space-x-6 mb-8">
                  {section.icon || <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1F4E79] rounded-[2px] group-hover:bg-[#0B1F3A] group-hover:text-white transition-all"><BookOpen className="w-6 h-6" /></div>}
                  <h3 className="text-3xl font-bold text-[#0B1F3A] tracking-tight">{section.title}</h3>
                </div>
                <div className="text-xl text-slate-500 font-medium leading-relaxed prose prose-xl prose-slate max-w-none">
                  {section.content.split('\n').map((para, i) => (
                    <p key={i} className="mb-6">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#f8fafc] p-10 border border-slate-100 rounded-[2px]">
              <h4 className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-widest mb-8">Resource Materials</h4>
              <div className="space-y-5">
                {[
                  { name: "Executive Summary", format: "PDF", size: "1.2 MB" },
                  { name: "Technical Architecture", format: "PDF", size: "4.8 MB" },
                  { name: "Implementation Guide", format: "DOCX", size: "840 KB" }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[2px] group hover:border-[#4DA3FF] transition-colors cursor-pointer shadow-sm">
                    <div className="flex items-center space-x-4">
                      <Download className="w-5 h-5 text-[#4DA3FF]" />
                      <div>
                        <div className="text-sm font-bold text-[#0B1F3A]">{file.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{file.format} • {file.size}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-[#4DA3FF] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0B1F3A] p-10 rounded-[2px] text-white shadow-2xl">
              <Lock className="w-8 h-8 text-[#4DA3FF] mb-8" />
              <h4 className="text-2xl font-bold mb-5 tracking-tight">Institutional Verification</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Certain technical specifications and research data require an authenticated institutional account for access.
              </p>
              <button className="w-full py-4 bg-[#4DA3FF] text-[#0B1F3A] font-bold text-[11px] uppercase tracking-widest rounded-[2px] hover:bg-white transition-colors">
                Sign In to View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericContentPage;
