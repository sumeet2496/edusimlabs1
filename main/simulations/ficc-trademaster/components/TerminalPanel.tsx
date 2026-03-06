
import React from 'react';

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, children, className = '', onClose }) => {
  return (
    <div className={`flex flex-col border border-[#333] bg-[#0c0c0c] overflow-hidden rounded-sm h-full ${className}`}>
      <div className="h-5 bg-[#000080] px-2 flex items-center justify-between shrink-0 select-none">
        <span className="text-[9px] font-bold text-white tracking-widest uppercase flex items-center">
          {title}
        </span>
        {onClose && (
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="text-white hover:text-red-500 text-xs transition-colors p-1"
          >
            &times;
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default TerminalPanel;
