
import React, { useState, useRef, useEffect } from 'react';
import { ChatHistoryItem, ClientScenario } from '../types';

interface Props {
  history: ChatHistoryItem[];
  onSend: (text: string) => void;
  scenario: ClientScenario;
  onClose?: () => void;
}

const DraggableChat: React.FC<Props> = ({ history, onSend, scenario, onClose }) => {
  const [input, setInput] = useState('');
  const [pos, setPos] = useState({ x: window.innerWidth - 360, y: window.innerHeight - 480 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const handleResize = () => {
      setPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 340),
        y: Math.min(prev.y, window.innerHeight - 420)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - 320));
      const newY = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - 400));
      setPos({ x: newX, y: newY });
    };

    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div 
      style={{ left: pos.x, top: pos.y }}
      className={`fixed z-[2000] w-[320px] h-[420px] bg-[#0c0c0c]/90 backdrop-blur-xl border-2 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-150 ${
        isDragging ? 'border-[#ff9900] scale-[1.02] shadow-[0_0_40px_rgba(255,153,0,0.2)]' : 'border-[#333] scale-100'
      }`}
    >
      <div 
        onMouseDown={onMouseDown}
        className="bg-[#1a1a1a] p-2.5 flex justify-between items-center border-b border-[#333] cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isDragging ? 'bg-[#ff9900] animate-ping' : 'bg-[#ff9900]'} shadow-[0_0_8px_#ff9900]`}></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#ff9900] uppercase font-black tracking-tight leading-none">IB TERMINAL CHAT</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">{scenario.name}</span>
          </div>
        </div>
        <div className="flex gap-2 items-center no-drag">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
            title="Minimize Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 scrollbar-hide">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="text-[9px] uppercase font-black tracking-[0.3em]">Encrypted Channel Established</span>
          </div>
        ) : (
          history.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <span className={`text-[7px] mb-1 font-black tracking-[0.15em] uppercase opacity-70 ${msg.role === 'user' ? 'text-blue-400' : 'text-[#ff9900]'}`}>
                {msg.role === 'user' ? 'Institutional Desk' : scenario.name}
              </span>
              <div className={`p-3 max-w-[92%] text-[11px] border leading-relaxed rounded-sm transition-all hover:brightness-125 ${
                msg.role === 'user' 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-50 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'bg-[#151515] border-[#222] text-gray-200 shadow-xl'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#222] bg-[#0a0a0a] no-drag">
        <div className="relative group">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-[11px] bg-black border border-[#333] text-white p-2.5 pr-12 outline-none focus:border-[#ff9900] transition-all placeholder:text-gray-700 font-mono shadow-inner group-hover:border-[#444]" 
            placeholder="Type your response..." 
          />
          <button 
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-[#ff9900] p-1.5 hover:text-white hover:bg-[#ff9900]/10 rounded-sm transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraggableChat;
