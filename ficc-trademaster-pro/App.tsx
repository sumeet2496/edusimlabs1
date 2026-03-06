
import React, { useState, useEffect, useRef } from 'react';
import { MarketEngine } from './services/MarketEngine';
import { PricingEngine } from './services/PricingEngine';
import { ClientEngine } from './services/ClientEngine';
import { DecisionEngine } from './services/DecisionEngine';
import { RiskEngine } from './services/RiskEngine';
import { PnLEngine } from './services/PnLEngine';
import { KPIEngine } from './services/KPIEngine';
import { 
  SimulationState, MarketData, Trade, Currency, RFQ, RiskMetrics, KPIs, TerminalView, TradeType, ChatMessage, DifficultyLevel
} from './types';

import TerminalPanel from './components/TerminalPanel';
import MarketGrid from './components/MarketGrid';
import Blotter from './components/Blotter';
import RiskDashboard from './components/RiskDashboard';
import PendingTradesPanel from './components/PendingTradesPanel';
import KPIBoard from './components/KPIBoard';
import ChatWindow from './components/ChatWindow';
import PricingWorksheet from './components/PricingWorksheet';

const INITIAL_KPIS: KPIs = {
  pnl: 0, realizedPnl: 0, unrealizedPnl: 0, carry: 0, commissionEarned: 0,
  clientTrust: 80, bossSatisfaction: 75, marketReputation: 85, riskCompliance: 100,
  operationalAccuracy: 100, strategicJudgment: 70, compositeScore: 78
};

const App: React.FC = () => {
  const [showPendingTrades, setShowPendingTrades] = useState(false);
  const [activeWorksheetRfq, setActiveWorksheetRfq] = useState<RFQ | null>(null);
  const firstTickProcessed = useRef(false);

  const [state, setState] = useState<SimulationState>({
    market: MarketEngine.getInitialMarket(),
    trades: [],
    pendingTrades: [],
    rfqs: [],
    risk: { totalDV01: 0, dv01ByCcy: { [Currency.USD]: 0, [Currency.EUR]: 0, [Currency.INR]: 0, [Currency.JPY]: 0 }, totalDelta: { [Currency.USD]: 0, [Currency.EUR]: 0, [Currency.INR]: 0, [Currency.JPY]: 0 }, basisExposure: 0, var95: 0, limitBreaches: [] },
    kpis: INITIAL_KPIS,
    events: ['TERMINAL_ONLINE: NYC_FICC_HUB', 'PRICING_ENGINE: READY'],
    chatHistory: [
      { id: '1', sender: 'SYSTEM', text: 'Secure Bloomberg connection active.', timestamp: Date.now(), type: 'SYSTEM' },
      { id: '2', sender: 'BOSS', text: 'Trader, commission and accurate pricing are your KPIs today. No slippage allowed.', timestamp: Date.now(), type: 'BOSS' }
    ],
    currentView: 'MKT',
    difficulty: DifficultyLevel.BASIC,
    hintsEnabled: true,
    isChatMinimized: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        const nextMarket = MarketEngine.evolve(prev.market);
        const updatedTrades = prev.trades.map(t => PnLEngine.updateTradePnl(t, nextMarket));
        const nextRisk = RiskEngine.calculateMetrics(updatedTrades, nextMarket);

        let nextRfqs = [...prev.rfqs];
        let nextEvents = [...prev.events];
        let nextChat = [...prev.chatHistory];

        const shouldForce = !firstTickProcessed.current;
        const newRfq = ClientEngine.generateRequest(nextMarket, shouldForce);
        
        if (shouldForce) firstTickProcessed.current = true;

        if (newRfq && nextRfqs.length < 8) {
          nextRfqs.push(newRfq);
          nextEvents.unshift(`>> RFQ_IN: ${newRfq.client} [${newRfq.type}]`);
          nextChat.push({
            id: Math.random().toString(),
            sender: newRfq.client,
            text: newRfq.message,
            timestamp: Date.now(),
            type: 'CLIENT'
          });
        }

        nextRfqs = nextRfqs.map(r => ({ ...r, expiry: r.expiry - 1 }));
        const expired = nextRfqs.filter(r => r.expiry <= 0);
        if (expired.length > 0) {
          nextRfqs = nextRfqs.filter(r => r.expiry > 0);
        }

        const nextKPIs = KPIEngine.calculateComposite(prev.kpis, updatedTrades, nextRisk);

        return {
          ...prev,
          market: nextMarket,
          trades: updatedTrades,
          rfqs: nextRfqs,
          risk: nextRisk,
          kpis: nextKPIs,
          events: nextEvents.slice(0, 50),
          chatHistory: nextChat.slice(-50)
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuoteRFQ = (rfqId: string, rate: number) => {
    setState(prev => {
      const targetRfq = prev.rfqs.find(r => r.id === rfqId);
      if (!targetRfq) return prev;
      
      const decision = DecisionEngine.evaluateQuote(targetRfq, rate, prev.market);
      let nextPending = [...prev.pendingTrades];
      let nextChat = [...prev.chatHistory];
      let nextKPIs = { ...prev.kpis };

      if (decision.executed) {
          nextPending.push({ ...targetRfq, status: 'ACCEPTED', userQuote: rate, commission: decision.commission });
          nextChat.push({
            id: Math.random().toString(),
            sender: targetRfq.client,
            text: `CONFIRMED. Trading at ${(rate*100).toFixed(4)}%. Awaiting booking.`,
            timestamp: Date.now(),
            type: 'CLIENT'
          });
          nextKPIs.clientTrust = Math.min(100, nextKPIs.clientTrust + 5);
      } else {
          nextChat.push({
            id: Math.random().toString(),
            sender: targetRfq.client,
            text: `PASS. ${decision.message.split(': ')[1] || "The math is incorrect."}`,
            timestamp: Date.now(),
            type: 'CLIENT'
          });
          nextKPIs.clientTrust = Math.max(0, nextKPIs.clientTrust - 5);
          nextKPIs.pnl -= 2000;
      }

      return {
        ...prev,
        rfqs: prev.rfqs.filter(r => r.id !== rfqId),
        pendingTrades: nextPending,
        chatHistory: nextChat.slice(-50),
        kpis: nextKPIs
      };
    });
    setActiveWorksheetRfq(null);
  };

  const handleBookTrade = (rfq: RFQ) => {
    const rate = rfq.userQuote!;
    const decision = DecisionEngine.evaluateQuote(rfq, rate, state.market);
    const newTrade: Trade = {
      id: `TRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: rfq.type,
      currency1: rfq.ccy1,
      currency2: rfq.ccy2,
      notional: rfq.notional,
      fixedRate: rate,
      entryRate: rate,
      maturityDate: '2029-05-20',
      entryDate: new Date().toISOString().split('T')[0],
      mtm: decision.pnlImpact,
      realizedPnl: 0, carryPnl: 0,
      commission: rfq.commission || 0,
      dv01: PricingEngine.calculateDV01({ notional: rfq.notional } as any) * (rfq.side === 'SELL' ? 1 : -1),
      delta: 0, counterparty: rfq.client, clientType: rfq.clientType
    };

    setState(prev => ({
      ...prev,
      trades: [newTrade, ...prev.trades],
      pendingTrades: prev.pendingTrades.filter(r => r.id !== rfq.id),
      events: [`BKG_SUCCESS: ${newTrade.id} @ ${(rate*100).toFixed(4)}%`, ...prev.events],
      kpis: {
        ...prev.kpis,
        commissionEarned: prev.kpis.commissionEarned + newTrade.commission
      }
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-[#ccc] terminal-font overflow-hidden select-none">
      <header className="h-12 bg-[#151515] border-b border-[#333] flex items-stretch shrink-0">
        <div className="flex items-center px-4 space-x-6 border-r border-[#333]">
           <span className="text-amber-500 font-bold text-lg tracking-tighter uppercase italic">FICC_TRADER</span>
        </div>
        
        <nav className="flex-1 flex items-stretch">
          {[
            { id: 'MKT', label: '1) Monitors' },
            { id: 'TBT', label: '2) Blotter' },
            { id: 'RISK', label: '3) Analytics' },
            { id: 'PNL', label: '4) Desk P&L' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setState(prev => ({ ...prev, currentView: tab.id as TerminalView }))}
              className={`px-6 flex items-center text-[10px] font-bold uppercase tracking-widest transition-all border-r border-[#222] ${
                state.currentView === tab.id ? 'bg-[#000080] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center px-4 space-x-4 border-l border-[#333] text-[10px] font-bold">
           <div className="flex items-center space-x-2 mr-4">
             <span className="text-gray-600">DIFFICULTY:</span>
             <select 
               value={state.difficulty} 
               onChange={e => setState(p => ({ ...p, difficulty: parseInt(e.target.value) }))}
               className="bg-black text-blue-400 border border-[#333] p-1 outline-none font-mono"
             >
               <option value={DifficultyLevel.BASIC}>BASIC</option>
               <option value={DifficultyLevel.INTERMEDIATE}>INTER</option>
               <option value={DifficultyLevel.ADVANCED}>ADV</option>
             </select>
           </div>
           <button onClick={() => setShowPendingTrades(true)} className="bg-green-950 px-3 py-1 border border-green-500 text-green-100 rounded-sm hover:bg-green-700 animate-pulse uppercase tracking-tighter">Queue [{state.pendingTrades.length}]</button>
        </div>
      </header>

      <div className="h-7 bg-[#000080] flex items-center border-b border-blue-400 overflow-hidden text-[10px] font-bold text-white uppercase tracking-widest shrink-0">
         <div className="flex whitespace-nowrap animate-marquee space-x-32 w-max">
            {state.events.map((e, i) => (
              <span key={i} className="flex items-center">
                <span className="w-1.5 h-1.5 mr-4 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
                {e}
              </span>
            ))}
         </div>
      </div>

      <main className="flex-1 flex overflow-hidden p-1 gap-1 relative">
        <aside className="w-72 flex flex-col gap-1 shrink-0">
           <KPIBoard kpis={state.kpis} />

           <TerminalPanel title="INTERBANK_RFQ_FLOW" className="flex-1 overflow-y-auto border-none">
              <div className="p-1 space-y-1">
                 {state.rfqs.map(r => (
                   <div 
                     key={r.id} 
                     onClick={() => setActiveWorksheetRfq(r)} 
                     className="p-3 border-l-4 border-blue-600 bg-[#0c0c0c] cursor-pointer hover:bg-[#151515] hover:border-blue-400 group transition-all"
                   >
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-white font-bold group-hover:text-blue-300 tracking-tight">{r.client}</span>
                        <span className="text-[8px] text-gray-600 font-mono tracking-tighter">{r.expiry}s</span>
                     </div>
                     <div className="text-[9px] text-gray-500 uppercase font-mono tracking-tighter truncate leading-tight">
                       {r.message}
                     </div>
                     <div className="mt-2 text-[8px] bg-blue-900/20 text-blue-400 px-1 py-0.5 border border-blue-900 inline-block uppercase font-bold group-hover:bg-blue-800 group-hover:text-white transition-colors">
                        Launch Worksheet
                     </div>
                   </div>
                 ))}
                 {state.rfqs.length === 0 && (
                   <div className="p-12 text-center text-gray-800 text-[10px] italic uppercase tracking-widest py-16 opacity-30">Waiting for liquidity requests...</div>
                 )}
              </div>
           </TerminalPanel>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#050505] gap-1 relative">
           {showPendingTrades && (
             <PendingTradesPanel 
                pending={state.pendingTrades} 
                onExecute={handleBookTrade} 
                onClose={() => setShowPendingTrades(false)} 
             />
           )}

           <div className="flex-1 flex flex-col gap-1 overflow-hidden">
             {state.currentView === 'MKT' && <MarketGrid market={state.market} />}
             {state.currentView === 'RISK' && <RiskDashboard risk={state.risk} trades={state.trades} />}
             {state.currentView === 'PNL' && (
               <TerminalPanel title="DESK EARNINGS SUMMARY" className="h-full flex items-center justify-center">
                 <div className="text-8xl font-bold font-mono tracking-tighter flex flex-col items-center">
                    <span className="text-gray-700 text-xs uppercase mb-8 tracking-[1em]">Consolidated P&L</span>
                    <span className={state.kpis.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {state.kpis.pnl >= 0 ? '+' : '-'}${(Math.abs(state.kpis.pnl)/1000).toFixed(1)}K
                    </span>
                    <div className="mt-8 text-xl text-blue-400 uppercase tracking-widest font-bold">
                       Commission: ${(state.kpis.commissionEarned/1000).toFixed(2)}K
                    </div>
                 </div>
               </TerminalPanel>
             )}
             {state.currentView === 'TBT' && <Blotter trades={state.trades} />}
             {state.currentView !== 'TBT' && <div className="h-56 border-t border-[#333]"><Blotter trades={state.trades.slice(0, 5)} title="RECENT TICKETS" /></div>}
           </div>
        </div>

        <ChatWindow 
          messages={state.chatHistory} 
          activeRfqs={state.rfqs}
          isMinimized={state.isChatMinimized}
          onToggleMinimize={() => setState(p => ({ ...p, isChatMinimized: !p.isChatMinimized }))}
          onSendQuote={(id) => {
             const r = state.rfqs.find(x => x.id === id);
             if (r) setActiveWorksheetRfq(r);
          }}
          onSendMessage={(t) => setState(p => ({ ...p, chatHistory: [...p.chatHistory, { id: Date.now().toString(), sender: 'YOU', text: t, timestamp: Date.now(), type: 'SYSTEM' }] }))}
        />
      </main>

      {activeWorksheetRfq && (
        <PricingWorksheet 
          rfq={activeWorksheetRfq}
          market={state.market}
          difficulty={state.difficulty}
          hintsEnabled={state.hintsEnabled}
          onSubmit={(rate) => handleQuoteRFQ(activeWorksheetRfq.id, rate)}
          onCancel={() => setActiveWorksheetRfq(null)}
        />
      )}

      <footer className="h-5 bg-[#111] border-t border-[#333] flex items-center justify-between px-4 text-[8px] font-bold text-gray-700 uppercase">
         <div className="flex items-center space-x-10">
            <span className="flex items-center space-x-2"><span className="w-1.5 h-1.5 bg-green-900 rounded-full"></span><span>NYC_DESK_MASTER</span></span>
            <span className="tracking-tighter opacity-50">TRADEMASTER_V7.2_STABLE</span>
         </div>
         <div className="flex space-x-4">
            <span className="text-amber-900">SYSTEMS_GREEN</span>
            <span className="text-gray-800">{new Date().toLocaleTimeString()} GMT-5</span>
         </div>
      </footer>
    </div>
  );
};

export default App;
