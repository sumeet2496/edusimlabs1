
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MarketEngine } from './services/marketEngine';
import { AppState, Trade, CurrencyPair, ChatHistoryItem, Tenor, MainTab, AccountEntry, ClientType } from './types';
import { SCENARIOS } from './constants';
import Watchlist from './components/Watchlist';
import ForwardCurve from './components/ForwardCurve';
import DraggableChat from './components/DraggableChat';
import OrderPanel from './components/OrderPanel';
import Portfolio from './components/Portfolio';
import ClientBank from './components/ClientBank';
import LedgerView from './components/LedgerView';
import TradeReport from './components/TradeReport';

const engine = new MarketEngine();

const tenorToMonths = (t: Tenor): number => {
  if (t === 'SPOT') return 0;
  const mMatch = t.match(/(\d+)M/);
  if (mMatch) return parseInt(mMatch[1]);
  const yMatch = t.match(/(\d+)Y/);
  if (yMatch) return parseInt(yMatch[1]) * 12;
  return 0;
};

export const getContractLabel = (monthsSimulated: number, tenorOffset: number) => {
  const baseDate = new Date(2026, 0, 1); 
  baseDate.setMonth(baseDate.getMonth() + monthsSimulated + tenorOffset);
  const label = baseDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).toUpperCase();
  return tenorOffset === 0 ? `SPOT (${label})` : label;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentScenarioIndex: -1,
    market: engine.tick(),
    activeTab: 'QUOTES',
    isChatOpen: true, 
    chatHistory: [],
    simulatedMonths: 0,
    selectedPair: 'USD/INR',
    isConfirmed: true,
    realizedPnl: 0,
    totalCommissions: 0,
    clientAccount: [], 
    businessFlowsPending: [],
    completedScenarioIds: [],
    settledScenarioIds: [],
    isQuoteValidated: false
  });

  const [tradeBook, setTradeBook] = useState<Trade[]>([]);
  const [showLeapAnimation, setShowLeapAnimation] = useState(false);
  const [orderDraft, setOrderDraft] = useState<Partial<Trade> | null>(null);
  const [reportScenarioId, setReportScenarioId] = useState<number | null>(null);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  const initialized = useRef(false);

  const isCurrentScenarioBooked = useMemo(() => {
    const scenario = SCENARIOS[state.currentScenarioIndex];
    if (!scenario) return false;
    return tradeBook.some(t => t.scenarioId === scenario.id && t.status === 'OPEN');
  }, [state.currentScenarioIndex, tradeBook]);

  const checkNextStep = useCallback((currentIndex: number, currentMonths: number, updatedTradeBook: Trade[], updatedAccount: AccountEntry[], completedIds: number[]) => {
    const openTrades = updatedTradeBook.filter(t => t.status === 'OPEN');
    const ccyHoldings = updatedAccount.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
      return acc;
    }, {});
    const hasUnliquidatedHoldings = Object.entries(ccyHoldings).some(([ccy, amt]) => ccy !== 'INR' && Math.abs(amt) > 0.01);

    if (openTrades.length > 0 || hasUnliquidatedHoldings || completedIds.length > 0) return;

    const nextIdx = currentIndex + 1;
    const nextScenario = SCENARIOS[nextIdx];
    
    if (nextScenario && currentMonths >= nextScenario.startMonth) {
      setState(prev => ({
        ...prev,
        currentScenarioIndex: nextIdx,
        selectedPair: nextScenario.pair,
        isQuoteValidated: false,
        isChatOpen: true, 
        activeTab: 'QUOTES',
        chatHistory: [...prev.chatHistory, {
          role: 'model',
          text: `[INCOMING CORPORATE MESSAGE]
------------------------------------------
FROM: ${nextScenario.name.toUpperCase()}
"Hello, we have a ${nextScenario.exposure} of ${nextScenario.amount.toLocaleString()} ${nextScenario.pair.split('/')[0]} due for ${getContractLabel(nextScenario.startMonth, tenorToMonths(nextScenario.tenor)).replace('SPOT (', '').replace(')', '')}. Please provide your firm quote and the required margin amount for this mandate."`
        }]
      }));
    } else if (currentIndex >= 0 && currentIndex === SCENARIOS.length - 1) {
      // All scenarios completed
      setState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, {
          role: 'model',
          text: `[SYSTEM] CONGRATULATIONS. All corporate mandates for the fiscal year have been successfully managed and settled. Your final performance report is ready.`
        }]
      }));
    }
  }, []);

  const handleTradeBooked = (newTrade: Trade) => {
    const scenario = SCENARIOS[state.currentScenarioIndex];
    const curve = state.market.fullCurves[newTrade.pair];
    const targetTenorIdx = tenorToMonths(newTrade.tenor);
    const marketQuote = curve?.[targetTenorIdx] || curve?.[0];
    const validationRate = newTrade.side === 'SELL' ? marketQuote.bid : marketQuote.ask;

    if (Math.abs(newTrade.rate - validationRate) > 0.0050) {
      setComplianceError(`NOT ACCEPTED: RATE ${newTrade.rate.toFixed(4)} IS OFF-MARKET.`);
      setTimeout(() => setComplianceError(null), 3000);
      return;
    }

    const currentCCY = newTrade.pair.split('/')[0];
    let hedgeToClose = newTrade.closingHedgeId 
      ? tradeBook.find(t => t.id === newTrade.closingHedgeId && t.status === 'OPEN')
      : null;

    if (!hedgeToClose && newTrade.tenor === 'SPOT') {
       hedgeToClose = tradeBook.find(t => 
         t.status === 'OPEN' && 
         t.pair === newTrade.pair && 
         t.amount === newTrade.amount && 
         t.side !== newTrade.side &&
         t.maturityMonth <= state.simulatedMonths
       ) || null;
    }

    const holdings = state.clientAccount.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
      return acc;
    }, {});
    const currentHoldingAmt = holdings[currentCCY] || 0;
    
    const isPhysicalSettlement = newTrade.tenor === 'SPOT' && (
      (currentHoldingAmt > 0 && newTrade.side === 'SELL' && Math.abs(currentHoldingAmt - newTrade.amount) < 0.01) ||
      (currentHoldingAmt < 0 && newTrade.side === 'BUY' && Math.abs(Math.abs(currentHoldingAmt) - newTrade.amount) < 0.01)
    );

    let realizedInr = 0;
    const basis = newTrade.pair === 'JPY/INR' ? 100 : 1;
    const quantity = newTrade.amount / basis;

    const targetStatus = (hedgeToClose || isPhysicalSettlement) ? 'CLOSED' : 'OPEN';
    const targetScenarioId = newTrade.scenarioId || hedgeToClose?.scenarioId || scenario?.id;

    const updatedBook = hedgeToClose 
      ? tradeBook.map(t => t.id === hedgeToClose.id ? { ...t, status: 'CLOSED' as const } : t).concat([{ ...newTrade, status: 'CLOSED' as const, scenarioId: targetScenarioId }])
      : tradeBook.concat([{ ...newTrade, status: targetStatus as any, scenarioId: targetScenarioId }]);

    setTradeBook(updatedBook);
    
    setState(prev => {
      const newEntries: AccountEntry[] = [];
      
      // --- MARGIN UTILIZATION: DEDUCT FROM BANK ---
      // We do this INSIDE setState to ensure we have the absolute latest clientAccount entries
      if (targetScenarioId && newTrade.tenor !== 'SPOT') {
         const marginDeposit = prev.clientAccount.find(e => 
           e.scenarioId === targetScenarioId && 
           e.type === 'MARGIN_PAYMENT' && 
           e.amountInr > 0 &&
           e.description.includes('Deposit')
         );
         
         if (marginDeposit) {
            newEntries.push({
              id: `UTIL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              scenarioId: targetScenarioId,
              timestamp: new Date(),
              description: `${newTrade.side === 'SELL' ? 'Short' : 'Long'} Future Contract Margin Utilised`,
              amountCcy: 0,
              ccy: 'INR',
              rate: newTrade.rate,
              amountInr: -marginDeposit.amountInr, 
              type: 'MARGIN_PAYMENT'
            });
         }
      }

      if (hedgeToClose) {
        realizedInr = hedgeToClose.side === 'BUY' 
          ? (newTrade.rate - hedgeToClose.rate) * quantity 
          : (hedgeToClose.rate - newTrade.rate) * quantity;

        newEntries.push({
          id: `STLM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          scenarioId: hedgeToClose.scenarioId,
          timestamp: new Date(),
          description: `Hedge Settlement: ${newTrade.pair} Spot Fixing`,
          amountCcy: 0,
          ccy: 'INR',
          rate: newTrade.rate,
          amountInr: realizedInr,
          type: 'HEDGE_SETTLEMENT'
        });
      }

      if (isPhysicalSettlement) {
        const arrivalEntry = prev.clientAccount.find(e => e.ccy === currentCCY && e.type === 'BUSINESS_FLOW' && Math.abs(e.amountCcy) > 0);
        newEntries.push({
          id: `PSLM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          scenarioId: arrivalEntry?.scenarioId || targetScenarioId,
          timestamp: new Date(),
          description: currentHoldingAmt > 0 ? `Physical Liquidation: ${newTrade.pair}` : `Payable Settlement: ${newTrade.pair}`,
          amountCcy: newTrade.side === 'BUY' ? newTrade.amount : -newTrade.amount,
          ccy: currentCCY,
          rate: newTrade.rate,
          amountInr: quantity * newTrade.rate * (newTrade.side === 'BUY' ? -1 : 1),
          type: 'BUSINESS_FLOW'
        });
      } else if (newTrade.tenor === 'SPOT' && !hedgeToClose) {
        newEntries.push({
          id: `SPOT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          scenarioId: targetScenarioId,
          timestamp: new Date(),
          description: `Spot Trade: ${newTrade.pair} ${newTrade.side}`,
          amountCcy: newTrade.side === 'BUY' ? newTrade.amount : -newTrade.amount,
          ccy: currentCCY,
          rate: newTrade.rate,
          amountInr: quantity * newTrade.rate * (newTrade.side === 'BUY' ? -1 : 1),
          type: 'BUSINESS_FLOW'
        });
      }

      const updatedAccount = [...prev.clientAccount, ...newEntries];
      const finalHoldings = updatedAccount.reduce<Record<string, number>>((acc, curr) => {
        acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
        return acc;
      }, {});
      
      const currentCcyHolding = finalHoldings[currentCCY] || 0;
      const ccyZero = Math.abs(currentCcyHolding) < 0.01;
      const hedgeDone = !updatedBook.some(t => t.scenarioId === targetScenarioId && t.status === 'OPEN');
      const isComplete = ccyZero && hedgeDone && targetScenarioId !== undefined;

      return {
        ...prev,
        realizedPnl: prev.realizedPnl + realizedInr,
        clientAccount: updatedAccount,
        completedScenarioIds: isComplete ? [...prev.completedScenarioIds, targetScenarioId!] : prev.completedScenarioIds,
        chatHistory: [...prev.chatHistory, { role: 'model', text: `[SYSTEM] Execution Confirmed. Margin has been utilized and deducted from the bank balance.` }]
      };
    });
    setOrderDraft(null);
  };

  const handleSendReport = (scenarioId: number) => {
    setState(prev => {
      const nextCompletedIds = prev.completedScenarioIds.filter(id => id !== scenarioId);
      const nextSettledIds = prev.settledScenarioIds.includes(scenarioId) 
        ? prev.settledScenarioIds 
        : [...prev.settledScenarioIds, scenarioId];
      const nextAccount = prev.clientAccount.filter(entry => entry.scenarioId !== scenarioId);
      
      const newState = {
        ...prev,
        clientAccount: nextAccount,
        completedScenarioIds: nextCompletedIds,
        settledScenarioIds: nextSettledIds
      };

      // Check if we can trigger the next scenario immediately
      const nextIdx = prev.currentScenarioIndex + 1;
      const nextScenario = SCENARIOS[nextIdx];
      const openTrades = tradeBook.filter(t => t.status === 'OPEN');
      const ccyHoldings = nextAccount.reduce((acc: Record<string, number>, curr) => {
        acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
        return acc;
      }, {});
      const hasUnliquidatedHoldings = Object.entries(ccyHoldings).some(([ccy, amt]) => ccy !== 'INR' && Math.abs(amt as number) > 0.01);

      if (nextScenario && 
          prev.simulatedMonths >= nextScenario.startMonth && 
          openTrades.length === 0 && 
          !hasUnliquidatedHoldings && 
          nextCompletedIds.length === 0) {
        
        return {
          ...newState,
          currentScenarioIndex: nextIdx,
          selectedPair: nextScenario.pair,
          isQuoteValidated: false,
          isChatOpen: true, 
          activeTab: 'QUOTES',
          chatHistory: [...prev.chatHistory, {
            role: 'model',
            text: `[INCOMING CORPORATE MESSAGE]
------------------------------------------
FROM: ${nextScenario.name.toUpperCase()}
"Hello, we have a ${nextScenario.exposure} of ${nextScenario.amount.toLocaleString()} ${nextScenario.pair.split('/')[0]} due for ${getContractLabel(nextScenario.startMonth, tenorToMonths(nextScenario.tenor)).replace('SPOT (', '').replace(')', '')}. Please provide your firm quote and the required margin amount for this mandate."`
          }]
        };
      }

      return newState;
    });
    setReportScenarioId(null);
  };

  const handleLeap = () => {
    setShowLeapAnimation(true);
    setTimeout(() => {
      engine.jump(1);
      const newSimulatedMonths = state.simulatedMonths + 1;
      const tickData = engine.tick();

      setState(prev => {
        const newCCYEntries: AccountEntry[] = [];
        
        // Check all scenarios for currency arrivals (receivables/payables maturing)
        SCENARIOS.forEach((scenario, idx) => {
          // Only allow arrivals for scenarios that have been presented or are current
          if (idx > prev.currentScenarioIndex && prev.currentScenarioIndex !== -1) return;

          const maturityDate = scenario.startMonth + tenorToMonths(scenario.tenor);
          const alreadyArrivedInAccount = prev.clientAccount.some(e => e.scenarioId === scenario.id && e.type === 'BUSINESS_FLOW');
          const alreadySettled = prev.settledScenarioIds.includes(scenario.id);
          
          if (maturityDate <= newSimulatedMonths && !alreadyArrivedInAccount && !alreadySettled) {
            const isPayable = scenario.type === ClientType.IMPORTER;
            newCCYEntries.push({
              id: `ARRV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              scenarioId: scenario.id,
              timestamp: new Date(),
              description: isPayable ? `Matured Payable: ${scenario.name}` : `Matured Arrival: ${scenario.name}`,
              amountCcy: isPayable ? -scenario.amount : scenario.amount,
              ccy: scenario.pair.split('/')[0],
              rate: 0,
              amountInr: 0,
              type: 'BUSINESS_FLOW'
            });
          }
        });

        const updatedAccount = [...prev.clientAccount, ...newCCYEntries];
        const newState = {
          ...prev,
          simulatedMonths: newSimulatedMonths,
          market: tickData,
          clientAccount: updatedAccount,
          chatHistory: [...prev.chatHistory, { 
            role: 'model', 
            text: `[SYSTEM] Time advanced to ${getContractLabel(newSimulatedMonths, 0).replace('SPOT (', '').replace(')', '')}. Check Bank for new currency arrivals.`
          }]
        };

        // Check if we should trigger the next scenario now that time has advanced
        const nextIdx = prev.currentScenarioIndex + 1;
        const nextScenario = SCENARIOS[nextIdx];
        const openTrades = tradeBook.filter(t => t.status === 'OPEN');
        const ccyHoldings = updatedAccount.reduce((acc: Record<string, number>, curr) => {
          acc[curr.ccy] = (acc[curr.ccy] || 0) + curr.amountCcy;
          return acc;
        }, {});
        const hasUnliquidatedHoldings = Object.entries(ccyHoldings).some(([ccy, amt]) => ccy !== 'INR' && Math.abs(amt as number) > 0.01);

        if (nextScenario && 
            newSimulatedMonths >= nextScenario.startMonth && 
            openTrades.length === 0 && 
            !hasUnliquidatedHoldings && 
            prev.completedScenarioIds.length === 0) {
          
          return {
            ...newState,
            currentScenarioIndex: nextIdx,
            selectedPair: nextScenario.pair,
            isQuoteValidated: false,
            isChatOpen: true, 
            activeTab: 'QUOTES',
            chatHistory: [...newState.chatHistory, {
              role: 'model',
              text: `[INCOMING CORPORATE MESSAGE]
------------------------------------------
FROM: ${nextScenario.name.toUpperCase()}
"Hello, we have a ${nextScenario.exposure} of ${nextScenario.amount.toLocaleString()} ${nextScenario.pair.split('/')[0]} due for ${getContractLabel(nextScenario.startMonth, tenorToMonths(nextScenario.tenor)).replace('SPOT (', '').replace(')', '')}. Please provide your firm quote and the required margin amount for this mandate."`
            }]
          };
        }

        return newState;
      });
      setShowLeapAnimation(false);
    }, 1200);
  };

  const handleSendMessage = (text: string) => {
    const scenario = SCENARIOS[state.currentScenarioIndex];
    if (!scenario) return;

    const cleanText = text.toLowerCase().replace(/,/g, '');
    const numbers = cleanText.match(/\d+(\.\d+)?/g);
    
    if (!numbers || numbers.length < 2) {
        setState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, 
                { role: 'user', text }, 
                { role: 'model', text: `REJECTED: Need quote rate and margin amount.` }
            ]
        }));
        return;
    }

    const curve = state.market.fullCurves[scenario.pair];
    const tenorIdx = tenorToMonths(scenario.tenor);
    const marketQuote = curve?.[tenorIdx] || curve?.[0];
    const correctRate = scenario.type === ClientType.EXPORTER ? marketQuote.bid : marketQuote.ask;
    const basis = scenario.pair === 'JPY/INR' ? 100 : 1;
    const expectedMargin = (scenario.amount / basis) * correctRate * 0.05;

    let inputRate = 0;
    let inputMargin = 0;
    const n1 = parseFloat(numbers[0]);
    const n2 = parseFloat(numbers[1]);

    if (Math.abs(n1 - correctRate) < Math.abs(n2 - correctRate)) {
        inputRate = n1;
        inputMargin = n2;
    } else {
        inputRate = n2;
        inputMargin = n1;
    }

    const isRateValid = Math.abs(inputRate - correctRate) < 0.0050;
    const isMarginValid = Math.abs(inputMargin - expectedMargin) < (expectedMargin * 0.01);

    if (isRateValid && isMarginValid) {
        const marginProvision: AccountEntry = {
            id: `DEPOS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            scenarioId: scenario.id,
            timestamp: new Date(),
            description: `Margin Deposit: ${scenario.name} (Provisioning)`,
            amountCcy: 0,
            ccy: 'INR',
            rate: inputRate,
            amountInr: inputMargin, 
            type: 'MARGIN_PAYMENT'
        };

        setState(prev => ({ 
            ...prev, 
            isQuoteValidated: true,
            clientAccount: [...prev.clientAccount, marginProvision],
            chatHistory: [...prev.chatHistory, 
                { role: 'user', text }, 
                { role: 'model', text: `ACCEPTED. Deposit of ${inputMargin.toLocaleString(undefined, {maximumFractionDigits: 0})} INR credited to bank account. Proceed to EXECUTE to utilise it.` }
            ] 
        }));
    } else {
        setState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, 
                { role: 'user', text }, 
                { role: 'model', text: `REJECTED: Pricing off-market.` }
            ]
        }));
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      checkNextStep(-1, 0, [], [], []);
      initialized.current = true;
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white font-mono overflow-hidden">
      <div className="h-12 bg-[#111] border-b border-[#333] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
             <span className="text-[#ff9900] font-black text-sm italic">BANK TERMINAL</span>
             <span className="text-[7px] text-gray-600 font-bold uppercase tracking-[0.3em]">Institutional Simulator</span>
          </div>
          <div className="flex flex-col ml-4">
              <span className="text-gray-500 text-[8px] font-black uppercase">Market Date</span>
              <span className="text-[#00ff00] font-black text-xs leading-none">{getContractLabel(state.simulatedMonths, 0).replace('SPOT (', '').replace(')', '')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }))} 
            className={`px-4 py-1.5 border ${state.isChatOpen ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-transparent text-[#ff9900] border-[#333] hover:border-[#ff9900]'} text-[10px] font-black uppercase transition-all flex items-center gap-2`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${state.currentScenarioIndex >= 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            Communications
          </button>
          <button onClick={handleLeap} className="px-6 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Advance Month</button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        <div className="w-72 border border-[#222] bg-[#050505] shrink-0 overflow-hidden">
          <Watchlist market={state.market} selected={state.selectedPair} onSelect={(p) => setState(prev => ({ ...prev, selectedPair: p as CurrencyPair }))} />
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex bg-[#0a0a0a] border border-[#222] p-1 rounded-sm gap-1 shrink-0">
            {(['QUOTES', 'PORTFOLIO', 'BANK', 'LEDGER'] as MainTab[]).map(tab => (
              <button key={tab} onClick={() => setState(prev => ({ ...prev, activeTab: tab }))} className={`flex-1 py-2 text-[10px] font-black rounded-sm uppercase ${state.activeTab === tab ? 'bg-[#ff9900] text-black' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden border border-[#222] bg-[#050505] rounded-sm">
            {state.activeTab === 'QUOTES' && (
              <ForwardCurve market={state.market} selected={state.selectedPair} onSelect={(p) => setState(prev => ({ ...prev, selectedPair: p }))} onQuoteClick={(p, t, s, r) => setOrderDraft({ pair: p, tenor: t, side: s, rate: r })} simulatedMonths={state.simulatedMonths} />
            )}
            {state.activeTab === 'PORTFOLIO' && (
              <Portfolio 
                trades={tradeBook.filter(t => t.status === 'OPEN')} 
                market={state.market} 
                onSquareOff={(t) => {
                  const curve = state.market.fullCurves[t.pair];
                  const targetSide = t.side === 'SELL' ? 'BUY' : 'SELL';
                  setOrderDraft({ 
                    pair: t.pair, 
                    tenor: 'SPOT', 
                    side: targetSide, 
                    amount: t.amount,
                    closingHedgeId: t.id, 
                    rate: targetSide === 'SELL' ? curve[0].bid : curve[0].ask 
                  });
                  setState(prev => ({ ...prev, activeTab: 'QUOTES' }));
                }} 
                onPrepareReport={(id) => setReportScenarioId(id)} 
                simulatedMonths={state.simulatedMonths} 
                clientAccount={state.clientAccount}
                completedScenarioIds={state.completedScenarioIds} 
              />
            )}
            {state.activeTab === 'BANK' && (
              <ClientBank 
                entries={state.clientAccount} 
                onTradeAction={(pair, amount, side) => {
                   const curve = state.market.fullCurves[pair];
                   setOrderDraft({
                     pair,
                     amount,
                     side,
                     tenor: 'SPOT',
                     rate: side === 'SELL' ? curve[0].bid : curve[0].ask
                   });
                   setState(prev => ({ ...prev, activeTab: 'QUOTES' }));
                }}
              />
            )}
            {state.activeTab === 'LEDGER' && <LedgerView entries={state.clientAccount} trades={tradeBook} />}
          </div>
        </div>
        <div className="w-80 border border-[#222] bg-[#050505] shrink-0">
          <OrderPanel 
            scenario={SCENARIOS[state.currentScenarioIndex]} 
            market={state.market} 
            onBook={(d) => handleTradeBooked({ ...d, scenarioId: SCENARIOS[state.currentScenarioIndex]?.id, maturityMonth: state.simulatedMonths + tenorToMonths(d.tenor) })} 
            draft={orderDraft} 
            simulatedMonths={state.simulatedMonths} 
            isAlreadyBooked={isCurrentScenarioBooked}
            isQuoteValidated={state.isQuoteValidated}
          />
        </div>
      </div>

      {state.isChatOpen && (
        <DraggableChat 
          history={state.chatHistory} 
          onSend={handleSendMessage} 
          scenario={SCENARIOS[state.currentScenarioIndex] || SCENARIOS[0]} 
          onClose={() => setState(prev => ({ ...prev, isChatOpen: false }))}
        />
      )}
      
      {reportScenarioId && <TradeReport scenario={SCENARIOS.find(s => s.id === reportScenarioId)!} entries={state.clientAccount.filter(e => e.scenarioId === reportScenarioId)} onSend={() => handleSendReport(reportScenarioId)} onClose={() => setReportScenarioId(null)} />}
      
      {complianceError && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
           <div className="bg-red-600 p-12 border-4 border-red-400 text-center">
              <h2 className="text-white text-4xl font-black uppercase mb-4">NOT ACCEPTED</h2>
              <p className="text-white text-lg font-black italic">{complianceError}</p>
           </div>
        </div>
      )}

      {showLeapAnimation && (
        <div className="fixed inset-0 z-[4000] bg-black flex items-center justify-center">
           <div className="text-white text-7xl font-black italic animate-pulse">SETTLING...</div>
        </div>
      )}

      {state.currentScenarioIndex === SCENARIOS.length - 1 && state.completedScenarioIds.length === 0 && tradeBook.filter(t => t.status === 'OPEN').length === 0 && state.clientAccount.filter(e => e.ccy !== 'INR' && Math.abs(e.amountCcy) > 0.01).length === 0 && (
        <div className="fixed inset-0 z-[5000] bg-black/90 flex items-center justify-center p-10 backdrop-blur-md">
           <div className="max-w-2xl w-full bg-[#111] border-4 border-[#ff9900] p-12 text-center shadow-[0_0_50px_rgba(255,153,0,0.3)]">
              <h2 className="text-[#ff9900] text-6xl font-black uppercase mb-2 italic tracking-tighter">Simulation Complete</h2>
              <div className="h-1 w-full bg-[#ff9900] mb-8"></div>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                 <div className="bg-black p-6 border border-[#222]">
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-2">Realized P&L</span>
                    <span className={`text-4xl font-black ${state.realizedPnl >= 0 ? 'text-[#00ff00]' : 'text-red-500'}`}>
                       ₹{state.realizedPnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                 </div>
                 <div className="bg-black p-6 border border-[#222]">
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-2">Mandates Settled</span>
                    <span className="text-4xl font-black text-white">5 / 5</span>
                 </div>
              </div>

              <p className="text-gray-400 text-sm font-bold leading-relaxed mb-10 uppercase italic">
                You have successfully navigated the fiscal year, managing complex FX exposures across multiple currency pairs. Your treasury management skills have ensured corporate stability and profit realization.
              </p>

              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-4 bg-[#ff9900] text-black font-black text-lg uppercase hover:bg-white transition-all shadow-xl"
              >
                Restart Terminal
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
