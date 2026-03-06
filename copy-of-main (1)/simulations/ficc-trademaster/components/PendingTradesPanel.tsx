
import React from 'react';
import { RFQ } from '../types';
import DraggablePanel from './DraggablePanel';

interface PendingTradesPanelProps {
  pending: RFQ[];
  onExecute: (rfq: RFQ) => void;
  onClose: () => void;
}

const PendingTradesPanel: React.FC<PendingTradesPanelProps> = ({ pending, onExecute, onClose }) => {
  return (
    <DraggablePanel title="PENDING EXECUTION QUEUE" onClose={onClose} width="600px">
      <div className="font-mono text-[11px] max-h-[400px] overflow-y-auto">
        {pending.length === 0 ? (
          <div className="p-10 text-center text-gray-700 uppercase italic">
            Queue empty. Awaiting client confirmations.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 text-gray-600 font-bold border-b border-[#222] pb-1 px-2 uppercase text-[9px]">
              <span>Client</span>
              <span>Inst</span>
              <span>Side</span>
              <span>Amt</span>
              <span>Rate</span>
              <span>Action</span>
            </div>
            {pending.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-2 items-center p-2 bg-[#0c0c0c] border border-[#222] hover:border-green-500/50 group transition-all">
                <span className="text-white truncate">{item.client}</span>
                <span className="text-blue-500">{item.type}</span>
                <span className={item.side === 'BUY' ? 'text-blue-400' : 'text-red-400'}>{item.side}</span>
                <span className="text-gray-400">{(item.notional / 1000000).toFixed(0)}M</span>
                <span className="text-amber-500">{(item.userQuote! * 100).toFixed(4)}%</span>
                <button 
                  onClick={() => onExecute(item)}
                  className="bg-green-900 text-white font-bold py-1 px-2 rounded-sm hover:bg-green-600 uppercase text-[9px] transition-colors"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default PendingTradesPanel;
