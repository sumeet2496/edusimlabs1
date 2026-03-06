
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, RFQ } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  activeRfqs: RFQ[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onSendQuote: (rfqId: string, quote: number) => void;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, activeRfqs, isMinimized, onToggleMinimize, onSendQuote, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);

  // DRAGGABLE STATE
  const [pos, setPos] = useState({ x: window.innerWidth - 500, y: window.innerHeight - 680 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    if (!selectedRfqId && activeRfqs.length > 0) {
      setSelectedRfqId(activeRfqs[0].id);
    } else if (activeRfqs.length === 0) {
      setSelectedRfqId(null);
    }
  }, [activeRfqs, selectedRfqId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('form')) return;
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const handleMouseUp = () => isDragging.current = false;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pos]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (selectedRfqId) {
       onSendQuote(selectedRfqId, 0); // Trigger worksheet
    } else {
       onSendMessage(inputValue);
    }
    setInputValue('');
  };

  const activeRfq = activeRfqs.find(r => r.id === selectedRfqId);

  return (
    <div 
      className={`fixed transition-all duration-300 z-[130] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-2 border-[#555] flex flex-col bg-black overflow-hidden rounded-sm ${isMinimized ? 'h-8 w-64' : 'w-[480px] h-[640px]'}`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div 
        onMouseDown={handleMouseDown} 
        className="h-8 bg-[#000080] px-3 flex items-center justify-between shrink-0 select-none cursor-move border-b border-blue-400"
      >
        <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">IB_MESSENGER</span>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onToggleMinimize} className="text-white hover:text-blue-300 text-sm font-bold w-4 h-4 flex items-center justify-center">{isMinimized ? '□' : '_'}</button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-full overflow-hidden bg-[#020202]">
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-[11px] flex flex-col space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col border-b border-[#111] pb-3 ${m.sender === 'YOU' ? 'items-end' : ''}`}>
                <div className="flex justify-between items-center w-full opacity-40 mb-1">
                  <span className={`font-bold tracking-tighter text-[9px] ${m.sender === 'YOU' ? 'text-green-500' : m.type === 'BOSS' ? 'text-red-500' : (m.type === 'SYSTEM' ? 'text-blue-500' : 'text-amber-500')}`}>
                    {m.sender}
                  </span>
                  <span className="text-[8px]">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`${m.sender === 'YOU' ? 'text-green-400 border-r-2 border-green-500 pr-3' : 'text-gray-300 border-l-2 border-[#333] pl-3'} p-1 leading-relaxed`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {activeRfq && (
            <div className="bg-[#0a0a0a] border-y border-[#333] p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                <span>CLIENT MEMO: {activeRfq.client}</span>
              </div>
              <div className="bg-[#050505] p-2 border border-amber-900/30 text-[10px] text-blue-100/70 leading-relaxed italic rounded-sm shadow-inner">
                {activeRfq.scenario}
              </div>
              <button 
                onClick={() => onSendQuote(activeRfq.id, 0)}
                className="w-full bg-blue-900 text-white font-bold py-2 text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all border border-blue-500/50"
              >
                Launch Pricing Worksheet &lt;GO&gt;
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="p-4 border-t border-[#333] bg-[#0c0c0c] flex items-center space-x-2">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="TYPE COMMAND OR MESSAGE..."
              className="flex-1 bg-black border border-[#333] text-[11px] text-[#00ff00] px-3 py-2 outline-none focus:border-blue-500 font-mono"
            />
            <button type="submit" className="bg-[#000080] text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">SEND</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
