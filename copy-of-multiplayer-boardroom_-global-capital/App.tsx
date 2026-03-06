
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Phase, SimState, Portfolio, FinancialRecord, LeaderboardEntry, Country } from './types';
import { COUNTRIES, TOTAL_CAPITAL, HORIZON, START_YEAR, LOCKED_PERIOD } from './constants';
import { CFOAvatar } from './components/CFOAvatar';
import { getCFOFeedback, getYearlyUpdate } from './services/geminiService';

const WACC = 0.10; 
const MAX_DEBT_USD = 5_000_000;
const DEBT_PENALTY_MULTIPLIER = 5; 

// Deterministic Random Generator for Fair Competition
class SeededRandom {
  private seed: number;
  constructor(seed: string) {
    this.seed = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

interface PeerState {
  name: string;
  npv: number;
  year: number;
  country: string;
  lastUpdate: number;
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(Phase.INTRO);
  const [returnPhase, setReturnPhase] = useState<Phase>(Phase.INTRO);
  const [matchId, setMatchId] = useState("BOARD-2026");
  const [ceoName, setCeoName] = useState("");
  const [year, setYear] = useState(0);
  const [calendarYear, setCalendarYear] = useState(START_YEAR);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [cfoMessage, setCfoMessage] = useState<string>("Boardroom protocol initialized. Awaiting executive signature.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [simState, setSimState] = useState<SimState | null>(null);
  
  const [pendingResults, setPendingResults] = useState<any>(null);
  const [repatriateAmountLocal, setRepatriateAmountLocal] = useState(0);
  const [debtAdjustmentUSD, setDebtAdjustmentUSD] = useState(0); 
  const [initialBorrowingUSD, setInitialBorrowingUSD] = useState(0); 
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [peerStates, setPeerStates] = useState<Record<string, PeerState>>({});

  const rng = useMemo(() => new SeededRandom(matchId), [matchId]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const refreshLeaderboard = useCallback(() => {
    const saved = localStorage.getItem('boardroom_hall_of_fame');
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  useEffect(() => {
    refreshLeaderboard();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'boardroom_hall_of_fame') refreshLeaderboard();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshLeaderboard]);

  useEffect(() => {
    if (!matchId || phase === Phase.INTRO) return;
    const channel = new BroadcastChannel(`boardroom_${matchId}`);
    channelRef.current = channel;

    const broadcastMyState = (currentNPV: number = 0, currentYear: number = 0) => {
      if (channel.name) {
        channel.postMessage({ 
          type: 'UPDATE', 
          name: ceoName || "Unknown Executive", 
          npv: currentNPV, 
          year: currentYear, 
          country: selectedCountryId || 'Initializing' 
        });
      }
    };

    channel.onmessage = (event) => {
      if (!event.data) return;
      const { type, name, npv, year: pYear, country } = event.data;
      if (type === 'UPDATE') {
        setPeerStates(prev => ({
          ...prev,
          [name]: { name, npv: npv || 0, year: pYear || 0, country: country || 'Unassigned', lastUpdate: Date.now() }
        }));
      } else if (type === 'PING') {
        const history = simState?.history[selectedCountryId || ''] || [];
        const currentNpv = history.length > 0 ? history[history.length - 1].npvUSD : 0;
        broadcastMyState(currentNpv, year);
      } else if (type === 'SCORE_SAVED') {
        refreshLeaderboard();
      }
    };

    channel.postMessage({ type: 'PING', name: ceoName });
    const interval = setInterval(() => {
      setPeerStates(prev => {
        const next = { ...prev };
        const now = Date.now();
        Object.keys(next).forEach(k => {
          if (now - next[k].lastUpdate > 10000) delete next[k];
        });
        return next;
      });
      const history = simState?.history[selectedCountryId || ''] || [];
      const currentNpv = history.length > 0 ? history[history.length - 1].npvUSD : 0;
      broadcastMyState(currentNpv, year);
    }, 3000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [matchId, ceoName, phase, selectedCountryId, simState, year]);

  const openLeaderboard = () => {
    setReturnPhase(phase);
    setPhase(Phase.LEADERBOARD);
  };

  const copySeedToClipboard = () => {
    navigator.clipboard.writeText(matchId);
    alert("Match Seed copied.");
  };

  const saveScore = (finalNpv: number) => {
    if (!ceoName || !selectedCountryId) return;
    const entry: LeaderboardEntry = {
      id: Math.random().toString(36).substr(2, 9),
      matchId, ceoName, country: selectedCountryId, npv: finalNpv, timestamp: Date.now()
    };
    const saved = localStorage.getItem('boardroom_hall_of_fame');
    const existing: LeaderboardEntry[] = saved ? JSON.parse(saved) : [];
    const updated = [...existing, entry].sort((a, b) => b.npv - a.npv).slice(0, 50);
    setLeaderboard(updated);
    localStorage.setItem('boardroom_hall_of_fame', JSON.stringify(updated));
    if (channelRef.current) channelRef.current.postMessage({ type: 'SCORE_SAVED' });
  };

  const activeProject = useMemo(() => COUNTRIES.find(c => selectedCountryId === c.id), [selectedCountryId]);

  const calculateNPV = (history: FinancialRecord[], currentValUSD: number) => {
    let npv = -TOTAL_CAPITAL; 
    history.forEach((rec) => {
      if (rec.year > 0) npv += (rec.repatriatedUSD || 0) / Math.pow(1 + WACC, rec.year);
    });
    const lastRec = history[history.length - 1];
    if (lastRec && lastRec.year > 0) npv += currentValUSD / Math.pow(1 + WACC, lastRec.year);
    return npv;
  };

  const startSimulation = async () => {
    if (!selectedCountryId || !activeProject) return;
    setIsProcessing(true);
    const initialPortfolio: Portfolio = {};
    const borrowingLocal = Math.min(initialBorrowingUSD, MAX_DEBT_USD) * activeProject.macro.spotFX;
    COUNTRIES.forEach(c => {
      initialPortfolio[c.id] = {
        localCash: borrowingLocal, 
        workingCapitalReserve: 0,
        investedCapital: c.id === selectedCountryId ? TOTAL_CAPITAL * c.macro.spotFX : 0,
        debtBalance: c.id === selectedCountryId ? borrowingLocal : 0,
        repatriatedUSD: 0, cumulativeTaxPaid: 0, currentFXRate: c.macro.spotFX, isExited: false
      };
    });
    const initialRecord: FinancialRecord = {
      year: 0, calendarYear: START_YEAR, revenue: 0, variableCosts: 0, ebitda: 0, ebit: 0, interestExpense: 0, interestIncome: 0, tax: 0, netIncome: 0,
      localCash: initialPortfolio[selectedCountryId].localCash, investedCapital: initialPortfolio[selectedCountryId].investedCapital,
      workingCapitalReserve: 0, debtBalance: initialPortfolio[selectedCountryId].debtBalance, fxRate: initialPortfolio[selectedCountryId].currentFXRate,
      repatriatedUSD: 0, npvUSD: -TOTAL_CAPITAL 
    };
    setSimState({
      matchId, year: 0, calendarYear: START_YEAR, totalRepatriatedUSD: 0, portfolio: initialPortfolio,
      allocation: { [selectedCountryId]: TOTAL_CAPITAL }, history: { [selectedCountryId]: [initialRecord] }
    });
    const feedback = await getCFOFeedback({ [selectedCountryId]: TOTAL_CAPITAL });
    setCfoMessage(feedback);
    setPhase(Phase.YEARLY_DECISION);
    setIsProcessing(false);
  };

  const runYearSimulation = useCallback(async () => {
    if (!simState || year >= HORIZON || !activeProject) return;
    setIsProcessing(true);
    const nextYear = year + 1;
    const c = activeProject;
    const f = simState.portfolio[c.id];
    const revenue = c.ops.baseYearRevenueLC * Math.pow(1 + c.ops.annualGrowthRate, nextYear);
    const varCosts = revenue * c.ops.variableCostRate * Math.pow(1 + c.ops.variableCostGrowth, nextYear);
    const interestExpense = f.debtBalance * c.localBorrowingRate;
    const interestIncome = f.localCash * c.ops.reinvestmentInterestRate;
    const ebitda = revenue - varCosts - c.ops.fixedCostsLC;
    const ebit = ebitda - c.ops.depreciationLC;
    const tax = Math.max(0, (ebit - interestExpense + interestIncome) * c.policy.localCorporateTax);
    const netIncome = (ebit - interestExpense + interestIncome) - tax;
    const fcfLocal = netIncome + c.ops.depreciationLC - (revenue * c.ops.maintenanceCapexRate);
    const drift = c.macro.expectedDrift;
    const vol = c.macro.volatility;
    const shock = (rng.next() * 2 - 1) * vol; 
    const nextFXRate = f.currentFXRate * (1 + drift + shock);
    setPendingResults({
      nextYear, nextCalYear: calendarYear + 1, revenue, ebitda, netIncome, fcfLocal, fxRate: nextFXRate,
      tax, interestExpense, interestIncome, varCosts, ebit, fixedCosts: c.ops.fixedCostsLC,
      depreciation: c.ops.depreciationLC, maintenanceCapex: revenue * c.ops.maintenanceCapexRate
    });
    setPhase(Phase.YEARLY_ALLOCATION);
    setCfoMessage(`FY ${calendarYear + 1} finalized. Leverage capped at $5M. Audit ready.`);
    setIsProcessing(false);
  }, [simState, year, calendarYear, activeProject, matchId, rng]);

  const commitYear = async () => {
    if (!simState || !activeProject || !pendingResults) return;
    setIsProcessing(true);
    const newPortfolio = JSON.parse(JSON.stringify(simState.portfolio));
    const f = newPortfolio[activeProject.id];
    const country = activeProject;
    const taxOnRepat = repatriateAmountLocal * country.policy.repatriationTax;
    const repatUSD = (repatriateAmountLocal - taxOnRepat) / (pendingResults.fxRate || 1);
    
    // Enforce Debt Limit strictly
    const potentialNewDebtUSD = (f.debtBalance / (pendingResults.fxRate || 1)) + debtAdjustmentUSD;
    const clampedDebtAdjustmentUSD = Math.min(debtAdjustmentUSD, MAX_DEBT_USD - (f.debtBalance / (pendingResults.fxRate || 1)));
    
    f.debtBalance = Math.max(0, f.debtBalance + (clampedDebtAdjustmentUSD * (pendingResults.fxRate || 1)));
    f.localCash += (clampedDebtAdjustmentUSD * (pendingResults.fxRate || 1)) + (pendingResults.netIncome + pendingResults.depreciation - pendingResults.maintenanceCapex - repatriateAmountLocal);
    f.investedCapital += pendingResults.maintenanceCapex;
    f.currentFXRate = pendingResults.fxRate;
    f.repatriatedUSD += repatUSD;
    
    const currentValUSD = ((f.localCash + (f.investedCapital * 0.75)) / f.currentFXRate) - (f.debtBalance / f.currentFXRate * DEBT_PENALTY_MULTIPLIER);
    const record: FinancialRecord = {
      ...pendingResults, year: pendingResults.nextYear, calendarYear: pendingResults.nextCalYear,
      localCash: f.localCash, investedCapital: f.investedCapital, workingCapitalReserve: 0,
      debtBalance: f.debtBalance, fxRate: f.currentFXRate, repatriatedUSD: repatUSD, npvUSD: 0
    };
    const newHistory = { ...simState.history, [activeProject.id]: [...simState.history[activeProject.id], record] };
    const npv = calculateNPV(newHistory[activeProject.id], currentValUSD);
    newHistory[activeProject.id][newHistory[activeProject.id].length-1].npvUSD = npv;
    setSimState(prev => prev ? { ...prev, totalRepatriatedUSD: prev.totalRepatriatedUSD + repatUSD, portfolio: newPortfolio, history: newHistory, year: pendingResults.nextYear, calendarYear: pendingResults.nextCalYear } : null);
    setYear(pendingResults.nextYear);
    setCalendarYear(pendingResults.nextCalYear);
    setPendingResults(null);
    setRepatriateAmountLocal(0);
    setDebtAdjustmentUSD(0);
    if (pendingResults.nextYear === HORIZON) {
      saveScore(npv);
      setPhase(Phase.FINAL_RESULTS);
    } else {
      const update = await getYearlyUpdate(pendingResults.nextYear, newPortfolio);
      setCfoMessage(update);
      setPhase(Phase.YEARLY_DECISION);
    }
    setIsProcessing(false);
  };

  const handleExit = () => {
    if (!simState || !activeProject) return;
    const f = simState.portfolio[activeProject.id];
    const valUSD = ((f.localCash + (f.investedCapital * 0.75)) / f.currentFXRate) - (f.debtBalance / f.currentFXRate * DEBT_PENALTY_MULTIPLIER);
    const npv = calculateNPV(simState.history[activeProject.id], valUSD);
    saveScore(npv);
    setPhase(Phase.FINAL_RESULTS);
  };

  const renderLobbyPeers = () => (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {(Object.values(peerStates) as PeerState[]).filter(p => p.name !== ceoName).map(p => (
        <div key={p.name} className="px-3 py-1 bg-slate-950 border border-amber-500/30 text-[9px] font-black text-amber-500 uppercase tracking-widest animate-in fade-in flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full" />
          {p.name}
        </div>
      ))}
      {Object.values(peerStates).length <= 1 && (
        <div className="text-[9px] text-slate-600 uppercase tracking-widest font-black italic">Waiting for peers in seed {matchId}...</div>
      )}
    </div>
  );

  const renderLobby = () => (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-12 shadow-2xl space-y-8 animate-in zoom-in rounded-none">
        <div className="text-center space-y-2">
          <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[1em]">Match Authentication</h3>
          <h2 className="text-4xl font-normal serif tracking-tighter text-white uppercase">Executive ID</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">CEO Handle</label>
            <input type="text" value={ceoName} onChange={e => setCeoName(e.target.value.toUpperCase())} placeholder="E.G. GORDON_G" className="w-full bg-slate-950 border border-slate-800 p-4 text-xl font-mono text-amber-500 focus:outline-none focus:border-amber-500 rounded-none"/>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Match Seed</label>
            <div className="relative">
              <input type="text" value={matchId} onChange={e => setMatchId(e.target.value.toUpperCase())} className="w-full bg-slate-950 border border-slate-800 p-4 text-xl font-mono text-slate-400 focus:outline-none focus:border-slate-500 rounded-none pr-12"/>
              <button onClick={copySeedToClipboard} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-amber-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
            </div>
          </div>
        </div>
        {renderLobbyPeers()}
        <button disabled={!ceoName || ceoName.length < 3} onClick={() => setPhase(Phase.CFO_BRIEF)} className={`w-full py-6 font-black uppercase tracking-[0.6em] text-xs transition-all shadow-xl rounded-none ${!ceoName || ceoName.length < 3 ? 'bg-slate-800 text-slate-600' : 'bg-amber-600 hover:bg-amber-500 text-slate-950'}`}>Initialize Deployment</button>
      </div>
    </div>
  );

  const renderLeaderboard = () => {
    const history = simState?.history[selectedCountryId || ''] || [];
    const myCurrentNpv = history.length > 0 ? history[history.length - 1].npvUSD : 0;
    const activePeersList: any[] = (Object.values(peerStates) as PeerState[]).filter(p => p.name !== ceoName).map(p => ({
      id: `live-${p.name}`, matchId, ceoName: p.name, country: p.country, npv: p.npv, timestamp: p.lastUpdate, isLive: true
    }));
    const myLiveEntry: any = ceoName ? { id: 'my-live', matchId, ceoName, country: selectedCountryId || 'Selecting...', npv: myCurrentNpv, timestamp: Date.now(), isLive: true } : null;
    const mergedBoard: any[] = [...leaderboard];
    [...activePeersList, myLiveEntry].filter(Boolean).forEach(live => {
      const exists = mergedBoard.find(h => h.ceoName === live.ceoName && h.matchId === live.matchId && Math.abs((h.npv || 0) - (live.npv || 0)) < 0.01);
      if (!exists) mergedBoard.push(live);
    });
    const sortedBoard = mergedBoard.sort((a, b) => (b.npv || 0) - (a.npv || 0));
    return (
      <div className="fixed inset-0 z-[800] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in zoom-in duration-500">
        <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 p-12 space-y-8 rounded-none shadow-2xl">
          <div className="text-center space-y-2"><h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[1em]">Performance Index</h3><h2 className="text-6xl font-normal serif tracking-tighter text-white uppercase">Global Ledger</h2></div>
          <div className="overflow-auto max-h-[500px] custom-scroll border border-slate-800 bg-slate-950/30">
            <table className="w-full text-left">
              <thead className="bg-slate-950 sticky top-0 z-20">
                <tr className="text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800"><th className="px-6 py-4">Rank</th><th className="px-6 py-4">Executive</th><th className="px-6 py-4">Match</th><th className="px-6 py-4 text-right">NPV Alpha</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sortedBoard.length === 0 && <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic uppercase tracking-widest text-xs">No records found.</td></tr>}
                {sortedBoard.map((e, i) => (
                  <tr key={e.id} className={`group transition-all ${e.isLive ? 'bg-amber-500/5' : ''} ${e.ceoName === ceoName ? 'border-l-2 border-amber-500' : ''}`}>
                    <td className="px-6 py-5 font-mono text-slate-500">#{i + 1}</td>
                    <td className="px-6 py-5"><div className="flex items-center gap-3"><div className="text-white font-normal serif text-xl uppercase tracking-tight">{e.ceoName}</div>{e.isLive && <span className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/30 text-[7px] text-green-400 font-black uppercase tracking-widest animate-pulse">Live</span>}</div><div className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">{e.country}</div></td>
                    <td className="px-6 py-5 font-mono text-slate-400 text-xs">{e.matchId}</td>
                    <td className="px-6 py-5 text-right font-mono text-2xl text-green-400 font-bold tracking-tighter">${((e.npv || 0) / 1_000_000).toFixed(2)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setPhase(returnPhase)} className="w-full py-5 bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] hover:text-white transition-all rounded-none">Resume Protocol</button>
        </div>
      </div>
    );
  };

  const renderAllocationWorkbench = () => {
    if (!pendingResults || !activeProject) return null;
    const taxRate = activeProject.policy.repatriationTax;
    const fcf = pendingResults.fcfLocal || 0;
    const fx = pendingResults.fxRate || 1;
    const netUSD = (repatriateAmountLocal * (1 - taxRate)) / fx;
    const currentDebtUSD = (simState?.portfolio[activeProject.id]?.debtBalance || 0) / fx;
    return (
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[400] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
        <div className="max-w-3xl w-full bg-slate-900 border border-amber-500/30 p-8 shadow-2xl space-y-8 relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <div className="text-center space-y-2"><h2 className="text-3xl font-normal serif tracking-tighter uppercase">FY {pendingResults.nextCalYear} Reconciliation</h2><p className="text-slate-400 italic text-sm">Deterministic Seed {matchId} active.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-6">
              <div className="flex justify-between border-b border-slate-800 pb-3"><span className="text-slate-500 text-[9px] font-black uppercase">Op. Surplus</span><span className="text-lg font-mono text-white">{(fcf ?? 0).toLocaleString()}</span></div>
              <div className="space-y-4">
                <label className="text-[9px] text-amber-500 font-black uppercase tracking-widest">HQ Transfer (Amount)</label>
                <input type="text" value={(repatriateAmountLocal ?? 0).toLocaleString()} onChange={e => setRepatriateAmountLocal(Math.min(parseInt(e.target.value.replace(/,/g, '')) || 0, Math.max(0, fcf)))} className="w-full bg-slate-900 border border-slate-700 p-4 text-xl font-mono text-amber-500 focus:outline-none focus:border-amber-500 rounded-none"/>
                <div className="text-center p-3 bg-slate-900 border border-slate-800"><span className="text-[8px] text-slate-600 block mb-1">Net Receipt</span><span className="text-lg text-green-400 font-mono">${(netUSD/1000000).toFixed(3)}M</span></div>
              </div>
            </div>
            <div className="bg-slate-950 p-6 border border-slate-800 space-y-6">
              <div className="flex justify-between border-b border-slate-800 pb-3"><span className="text-slate-500 text-[9px] font-black uppercase">Leverage Status</span><span className="text-lg font-mono text-red-400">${(currentDebtUSD/1000000).toFixed(2)}M</span></div>
              <div className="space-y-4">
                <label className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Debt Adjustment (USD)</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">Repay</span>
                  <input type="range" min={-currentDebtUSD} max={MAX_DEBT_USD - currentDebtUSD} step={100000} value={debtAdjustmentUSD} onChange={e => setDebtAdjustmentUSD(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-800 appearance-none accent-blue-500 cursor-pointer" />
                  <span className="text-xs text-slate-500">Borrow</span>
                </div>
                <div className="text-center text-xl font-mono text-blue-400">${(debtAdjustmentUSD/1000000).toFixed(2)}M</div>
                <div className="text-[8px] text-center text-slate-500 font-black uppercase">Cap: $5.00M Max Leverage</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4"><button onClick={() => setPhase(Phase.YEARLY_DECISION)} className="flex-1 py-5 border border-slate-700 text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] rounded-none">Abort</button><button onClick={commitYear} className="flex-[2] py-5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-[0.4em] text-[10px] rounded-none">Confirm & Finalize</button></div>
        </div>
      </div>
    );
  };

  const renderComparisonMatrix = () => (
    <div className="h-screen w-full flex flex-col bg-[#020617] animate-in fade-in duration-700">
      <div className="flex-shrink-0 flex justify-between items-center px-6 py-3 border-b border-slate-800 bg-slate-950">
        <h3 className="text-amber-500 text-[8px] font-black uppercase tracking-[0.8em]">Executive Strategy Matrix</h3>
        <button onClick={() => setPhase(Phase.LOBBY)} className="text-slate-500 hover:text-white text-[8px] font-black uppercase tracking-widest">Return to Authorization</button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scroll">
        <table className="w-full border-collapse min-w-[1400px] bg-slate-900 border border-slate-800 shadow-2xl rounded-none">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-6 px-8 text-left text-slate-500 text-[9px] font-black uppercase tracking-widest w-72 bg-slate-950/30 border-r border-slate-800/50">Target Metric</th>
              {COUNTRIES.map(c => (
                <th key={c.id} className="py-6 px-6 text-center border-l border-slate-800/50">
                  <span className="text-4xl block mb-2">{c.projectIcon}</span>
                  <span className="text-lg font-normal serif text-white block uppercase tracking-tight">{c.name}</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block mt-1">{c.classification} Market</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <tr className="bg-slate-950/40"><td colSpan={COUNTRIES.length + 1} className="py-2 px-8 text-[8px] font-black text-amber-500/50 uppercase tracking-[0.4em] text-center border-y border-slate-800">Section I: Operating Core</td></tr>
            
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Base Year Revenue</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-slate-100 text-xs">{(c.ops.baseYearRevenueLC || 0).toLocaleString()} <span className="text-[8px] text-slate-500 font-sans ml-1">{c.currency}</span></td>)}
            </tr>
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Revenue Growth</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-green-400 text-sm">{((c.ops.annualGrowthRate || 0) * 100).toFixed(0)}%</td>)}
            </tr>
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Var. Cost Base</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-red-400/80 text-xs">{((c.ops.variableCostRate || 0) * 100).toFixed(0)}%</td>)}
            </tr>

            <tr className="bg-slate-950/40"><td colSpan={COUNTRIES.length + 1} className="py-2 px-8 text-[8px] font-black text-amber-500/50 uppercase tracking-[0.4em] text-center border-y border-slate-800">Section II: Financial Policy</td></tr>

            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Local Int. Rate (Debt)</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-red-400 text-xs">{((c.localBorrowingRate || 0) * 100).toFixed(1)}%</td>)}
            </tr>
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Cash Interest (Yield)</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-blue-400 text-xs">{((c.ops.reinvestmentInterestRate || 0) * 100).toFixed(1)}%</td>)}
            </tr>
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Corporate Tax</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-slate-300 text-xs">{((c.policy.localCorporateTax || 0) * 100).toFixed(0)}%</td>)}
            </tr>
            <tr>
              <td className="py-3 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50">Repatriation Tax</td>
              {COUNTRIES.map(c => <td key={c.id} className="py-3 px-6 text-center border-l border-slate-800/50 font-mono text-amber-500 text-xs">{((c.policy.repatriationTax || 0) * 100).toFixed(0)}%</td>)}
            </tr>

            <tr className="bg-slate-950/40"><td colSpan={COUNTRIES.length + 1} className="py-2 px-8 text-[8px] font-black text-amber-500/50 uppercase tracking-[0.4em] text-center border-y border-slate-800">Section III: 5-Year FX Roadmap (Trend)</td></tr>

            <tr>
              <td className="py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-950/10 border-r border-slate-800/50 align-top">
                Projected FX Spot
                <p className="text-[7px] text-slate-600 mt-2 font-normal lowercase tracking-normal italic">Expected drift relative to USD</p>
              </td>
              {COUNTRIES.map(c => (
                <td key={c.id} className="py-5 px-6 text-center border-l border-slate-800/50 align-top">
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex justify-between px-4 text-slate-800 border-b border-slate-800/30 pb-1 mb-1 font-black uppercase"><span>Spot</span><span>{(c.macro.spotFX || 0).toFixed(2)}</span></div>
                    {[1, 2, 3, 4, 5].map(y => {
                      const rate = (c.macro.spotFX || 0) * Math.pow(1 + (c.macro.expectedDrift || 0), y);
                      return (
                        <div key={y} className="flex justify-between px-4 py-0.5 border-b border-slate-800/10">
                          <span className="text-slate-900 font-bold">Y{y}</span>
                          <span className="text-slate-800">{rate.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="bg-slate-950/40">
              <td className="py-10 px-8 bg-slate-950/30 border-r border-slate-800/50"></td>
              {COUNTRIES.map(c => (
                <td key={c.id} className="py-10 px-6 text-center border-l border-slate-800/50">
                  <button onClick={() => { setSelectedCountryId(c.id); setPhase(Phase.INVESTMENT_CONFIG); }} className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-[0.5em] text-[10px] transition-all rounded-none shadow-2xl">Authorize Market</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  if (phase === Phase.LEADERBOARD) return renderLeaderboard();
  if (phase === Phase.LOBBY) return renderLobby();
  if (phase === Phase.INTRO) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 p-16 shadow-2xl space-y-10 animate-in fade-in zoom-in duration-700 text-center relative overflow-hidden rounded-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="space-y-4"><h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[1em]">Operational Mandate</h3><h1 className="text-7xl font-normal serif tracking-tighter leading-none uppercase">Maximize NPV</h1></div>
          <div className="space-y-8 text-slate-400 text-xl leading-relaxed font-normal max-w-2xl mx-auto"><p>Deploy <span className="text-white font-black">$100,000,000 USD</span> in a deterministic global market.</p><p>Compete against other executives using the same <span className="text-white border-b border-amber-500/50">Match Seed</span>.</p></div>
          <div className="flex flex-col gap-4"><button onClick={() => setPhase(Phase.LOBBY)} className="w-full py-8 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-[0.8em] text-xs transition-all shadow-xl rounded-none">Enter Simulation</button><button onClick={() => { setReturnPhase(Phase.INTRO); setPhase(Phase.LEADERBOARD); }} className="w-full py-4 bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] hover:text-white transition-all rounded-none">Global Rankings</button></div>
        </div>
      </div>
    );
  }

  if (phase === Phase.FINAL_RESULTS && simState && activeProject) {
    const history = simState.history[activeProject.id] || [];
    const finalNpv = history.length > 0 ? (history[history.length-1].npvUSD || 0) : 0;
    return (
      <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4"><h3 className="text-amber-500 text-xs font-black uppercase tracking-[1em]">Campaign Concluded</h3><h1 className="text-7xl font-normal serif tracking-tighter leading-none text-white uppercase">Corporate Alpha</h1></div>
          <div className="bg-slate-900 border border-slate-800 p-16 shadow-2xl inline-block mx-auto relative overflow-hidden rounded-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]" />
            <div className="text-[11px] text-slate-500 uppercase font-black tracking-[0.8em] mb-8">Terminal NPV (Seed: {matchId})</div>
            <div className="text-9xl font-mono text-green-400 font-normal tracking-tighter leading-none flex items-baseline justify-center"><span className="text-4xl mr-4 opacity-50">$</span>{(finalNpv / 1000000).toFixed(2)}<span className="text-4xl ml-3 opacity-50">M</span></div>
          </div>
          <div className="flex gap-4 justify-center"><button onClick={openLeaderboard} className="px-16 py-8 bg-slate-900 border border-slate-800 text-amber-500 font-black uppercase tracking-[0.4em] text-xs hover:border-amber-500 transition-all rounded-none shadow-xl">Hall of Fame</button><button onClick={() => window.location.reload()} className="px-24 py-8 bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-xs hover:bg-amber-500 transition-all rounded-none shadow-2xl">Reset Simulation</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden selection:bg-amber-500/30">
      {(phase !== Phase.INTRO && phase !== Phase.LOBBY && phase !== Phase.LEADERBOARD) && (
        <div className="fixed top-6 right-6 z-[600] flex flex-col items-end gap-2">
          <button onClick={openLeaderboard} className="px-4 py-2 border border-amber-900/30 text-amber-500 text-[8px] font-black uppercase tracking-widest hover:border-amber-500 bg-slate-950/80 backdrop-blur-md transition-all rounded-none shadow-2xl">Hall of Fame</button>
          <div className="text-[7px] text-slate-600 font-black uppercase tracking-tighter bg-slate-900 px-2 py-0.5 border border-slate-800 flex items-center gap-1.5"><div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />{Object.keys(peerStates).length + 1} Active Executives</div>
        </div>
      )}

      {phase === Phase.CFO_BRIEF && (
        <CFOAvatar 
          isFullScreen 
          message={`CEO ${ceoName}, the $100M deployment to Market Seed ${matchId} is ready. Review the consolidated roadmap before authorization.`} 
          onAction={() => setPhase(Phase.PRESENTATION)} actionLabel="Review Market"
        />
      )}

      {phase === Phase.PRESENTATION && renderComparisonMatrix()}

      {(phase === Phase.INVESTMENT_CONFIG || phase === Phase.YEARLY_ALLOCATION || phase === Phase.YEARLY_DECISION) && (
        <>
          <header className="w-full flex justify-between items-end p-6 border-b border-slate-800 bg-slate-950 h-[110px] relative z-10">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-1"><div className="w-2 h-2 bg-amber-500 animate-pulse rounded-none" /><span className="text-[10px] font-black uppercase tracking-[0.5em]">{activeProject?.name || 'Selection'} Portfolio</span></div>
              <h1 className="text-4xl font-normal serif tracking-tighter uppercase">Maximize NPV <span className="text-slate-500 font-sans text-xs tracking-widest ml-4 font-black">SEED: {matchId}</span></h1>
            </div>
            <div className="flex gap-8 text-right items-end mr-32"> 
              <div className="group"><div className="text-slate-500 text-[8px] uppercase font-black tracking-widest mb-1">HQ Bal</div><div className="text-2xl font-mono text-green-400">${((simState?.totalRepatriatedUSD || 0) / 1000000).toFixed(2)}M</div></div>
              <div className="h-10 w-[1px] bg-slate-800" />
              <div className="group"><div className="text-slate-500 text-[8px] uppercase font-black tracking-widest mb-1">Fiscal Cycle</div><div className="text-4xl font-normal text-white">{calendarYear}</div></div>
            </div>
          </header>

          <main className="flex-1 w-full p-6 flex flex-col gap-6 relative z-10 overflow-hidden h-[calc(100vh-110px)]">
            <CFOAvatar message={cfoMessage} subtext={isProcessing ? "Auditing Boardroom Delta..." : undefined} />

            {phase === Phase.INVESTMENT_CONFIG && activeProject && (
              <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-12 shadow-2xl space-y-8 animate-in zoom-in duration-500 rounded-none text-center">
                <div className="space-y-4"><h3 className="text-amber-500 text-xs font-black uppercase tracking-[1em]">Capital Hook</h3><h2 className="text-4xl font-normal serif tracking-tighter uppercase">Initial Borrowing</h2></div>
                <div className="space-y-6 bg-slate-950 p-8 border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Working Capital Buffer</span><span className="text-amber-500 text-2xl font-mono">${(initialBorrowingUSD/1000000).toFixed(2)}M</span></div>
                  <input type="range" min="0" max={MAX_DEBT_USD} step="500000" value={initialBorrowingUSD} onChange={e => setInitialBorrowingUSD(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 appearance-none accent-amber-500 cursor-pointer" />
                  <div className="text-[8px] text-slate-500 font-black uppercase">Max Allowable Leverage: $5,000,000 USD</div>
                </div>
                <div className="flex gap-4"><button onClick={() => setPhase(Phase.PRESENTATION)} className="flex-1 py-6 border border-slate-800 text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Abort</button><button onClick={startSimulation} className="flex-[2] py-6 bg-amber-600 text-slate-950 font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl">Confirm Deployment</button></div>
              </div>
            )}

            {simState && phase !== Phase.INVESTMENT_CONFIG && (
              <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                <div className="col-span-9 bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col overflow-hidden">
                  <div className="flex gap-1 mb-4 border border-slate-800 p-2 bg-slate-950/50 justify-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[1em] text-slate-500">Executive Management Ledger (FY 0 - FY {HORIZON})</h3>
                  </div>
                  <div className="flex-1 overflow-auto custom-scroll px-2">
                    <table className="w-full text-[10px] font-mono text-slate-300 border-collapse">
                      <thead>
                        <tr className="text-[7px] uppercase text-slate-600 border-b border-slate-800">
                          <th className="text-left py-3 w-64">Metric ({activeProject?.currency || 'USD'})</th>
                          {(simState.history[activeProject?.id || ''] || []).map(h => <th key={h.year} className="text-right py-3 pr-4">FY {h.calendarYear}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {/* Detailed Income Statement Section */}
                        <tr className="bg-slate-950/30"><td colSpan={HORIZON+2} className="py-1 px-2 text-[6px] font-black text-amber-500/40 uppercase tracking-widest">Section I: Operating results (detailed income)</td></tr>
                        <tr><td className="py-2 text-white font-black">Gross Revenue</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4">{(h.revenue ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-slate-500">Variable Costs</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-red-900/40">({(h.variableCosts ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-slate-500">Fixed Operating Costs</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-red-900/40">({(h.fixedCosts ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                        <tr className="bg-slate-900/40"><td className="py-2 pl-3 uppercase text-slate-300">EBITDA</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4">{(h.ebitda ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-slate-500 italic">Depreciation & Amort.</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-slate-600">({(h.depreciation ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-slate-300">EBIT (Op. Profit)</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4">{(h.ebit ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-blue-900/60">Interest Income</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-blue-900/60">{(h.interestIncome ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-red-900/60">Interest Expense</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-red-900/60">({(h.interestExpense ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                        <tr><td className="py-1.5 pl-3 text-slate-500">Provision for Taxes</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-red-900/30">({(h.tax ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                        <tr className="text-amber-500 border-t border-amber-900/20 bg-amber-500/5"><td className="py-2 uppercase font-black">Net Income (Bottom Line)</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 font-bold">{(h.netIncome ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>

                        {/* Cashflow & Valuation Section */}
                        <tr className="bg-slate-950/30 border-t-2 border-slate-800"><td colSpan={HORIZON+2} className="py-1 px-2 text-[6px] font-black text-green-500/40 uppercase tracking-widest">Section II: Remittance & Strategic value (USD)</td></tr>
                        <tr className="bg-green-600/5"><td className="py-3 uppercase text-green-500 font-bold tracking-widest">HQ Transfer (Receipt)</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-green-400 font-black text-lg">${((h.repatriatedUSD ?? 0)/1000000).toFixed(2)}M</td>)}</tr>
                        <tr><td className="py-2 pl-3 text-slate-600 text-[8px]">Realized FX Multiplier</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-slate-600">{(h.fxRate ?? 0).toFixed(4)}</td>)}</tr>
                        <tr className="bg-amber-600/10 border-t border-amber-600/20"><td className="py-4 uppercase text-amber-500 font-black text-xs">Campaign NPV (Consolidated)</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 font-black text-xl text-amber-500">${((h.npvUSD ?? 0)/1000000).toFixed(2)}M</td>)}</tr>

                        {/* Liquidity Section */}
                        <tr className="bg-slate-950/30 border-t-2 border-slate-800"><td colSpan={HORIZON+2} className="py-1 px-2 text-[6px] font-black text-blue-500/40 uppercase tracking-widest">Section III: Regional liquidity</td></tr>
                        <tr><td className="py-2 text-slate-400 pl-3">Operating Cash On Hand</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4">{(h.localCash ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})}</td>)}</tr>
                        <tr><td className="py-2 text-red-900/60 pl-3">Leveraged Debt ($5M Cap)</td>{(simState.history[activeProject?.id || ''] || []).map(h => <td key={h.year} className="text-right pr-4 text-red-900/60">({(h.debtBalance ?? 0).toLocaleString(undefined,{maximumFractionDigits:0})})</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-span-3 bg-slate-900/90 border border-slate-800 p-6 flex flex-col space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Executive Command</h3>
                  <div className="flex-1 space-y-4">
                    <div className="bg-slate-950 p-6 border border-slate-800">
                      <div className="text-[9px] text-slate-600 font-black uppercase mb-1">Portfolio Alpha (NPV)</div>
                      <div className={`text-4xl font-mono font-black tracking-tighter ${((simState.history[activeProject?.id||''] || [])[year]?.npvUSD ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>${(((simState.history[activeProject?.id||''] || [])[year]?.npvUSD ?? 0)/1000000).toFixed(2)}M</div>
                      <div className="mt-2 text-[7px] text-slate-500 uppercase font-black">Benchmark: +$0.00M</div>
                    </div>
                    {phase === Phase.YEARLY_DECISION && (
                      <div className="space-y-4">
                        <button onClick={runYearSimulation} className="w-full py-8 bg-amber-600 text-slate-950 font-black uppercase tracking-[0.5em] text-[11px] hover:bg-amber-500 transition-all rounded-none shadow-xl">Close Fiscal Year</button>
                        <button disabled={year < LOCKED_PERIOD} onClick={handleExit} className={`w-full py-4 font-black uppercase text-[10px] border rounded-none ${year < LOCKED_PERIOD ? 'border-slate-800 text-slate-700 bg-slate-900/50 cursor-not-allowed' : 'border-red-900/40 text-red-500 bg-red-950/10 hover:bg-red-950/30'}`}>Liquidate & Exit</button>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto border-t border-slate-800 pt-4">
                     <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Leverage Status</div>
                     <div className="w-full h-1 bg-slate-800 mb-1">
                        <div className="h-full bg-blue-500" style={{width: `${Math.min(100, ((simState.portfolio[activeProject?.id||''].debtBalance / activeProject?.macro.spotFX) / MAX_DEBT_USD) * 100)}%`}} />
                     </div>
                     <div className="flex justify-between text-[7px] text-slate-500 font-mono">
                        <span>$0</span>
                        <span>$5M CAP</span>
                     </div>
                  </div>
                </div>
              </div>
            )}
            {phase === Phase.YEARLY_ALLOCATION && renderAllocationWorkbench()}
          </main>
        </>
      )}

      {isProcessing && <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[1000] flex flex-col items-center justify-center space-y-6 animate-in fade-in"><div className="w-24 h-24 border-[4px] border-slate-800 border-t-amber-500 animate-spin rounded-full"/><p className="text-slate-100 font-black uppercase tracking-[1em] text-sm animate-pulse italic">Auditing Boardroom Delta</p></div>}
    </div>
  );
};

export default App;
