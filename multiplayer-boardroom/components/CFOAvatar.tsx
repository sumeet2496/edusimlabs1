
import React from 'react';

interface CFOAvatarProps {
  message: string;
  subtext?: string;
  isFullScreen?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export const CFOAvatar: React.FC<CFOAvatarProps> = ({ message, subtext, isFullScreen, onAction, actionLabel }) => {
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="max-w-2xl w-full flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-40 h-40 md:w-52 md:h-52 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.05)] bg-slate-900 rounded-none">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                alt="CFO Presentation" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 px-4 py-0.5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 rounded-none">
              EXECUTIVE SESSION
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.8em]">Operational Briefing</h3>
            <p className="text-xl md:text-2xl leading-tight serif italic text-slate-100 max-w-xl mx-auto font-normal">
              "{message}"
            </p>
            {subtext && <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-normal italic">{subtext}</p>}
            
            {onAction && (
              <button 
                onClick={onAction}
                className="mt-6 px-12 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-xl hover:scale-105 rounded-none"
              >
                {actionLabel || "Proceed"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 bg-slate-900/90 backdrop-blur-md p-4 border border-slate-800 shadow-xl rounded-none">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border border-slate-700 relative z-10 bg-slate-800 rounded-none">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
              alt="CFO" 
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 w-2 h-2 border border-slate-900 z-20 animate-pulse" />
        </div>

        <div className="flex-1 text-center md:text-left pt-0.5">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="h-[1px] w-4 bg-amber-500/50" />
            <h3 className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em]">CFO Mandate</h3>
          </div>
          <p className="text-slate-100 text-base md:text-lg leading-snug serif italic font-normal max-w-2xl">
            "{message}"
          </p>
          {subtext && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-slate-800/50 border border-slate-700 rounded-none">
              <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">
                {subtext}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
