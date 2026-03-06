
import React, { useState } from 'react';
import { ClientScenario, AccountEntry, ClientType } from '../types';

interface Props {
  scenario: ClientScenario;
  entries: AccountEntry[];
  onSend: () => void;
  onClose: () => void;
}

const TradeReport: React.FC<Props> = ({ scenario, entries, onSend, onClose }) => {
  const [reportType, setReportType] = useState<'CLIENT' | 'INTERNAL'>('CLIENT');

  // Identify specific ledger entries for data extraction
  const marginDeposit = entries.find(e => e.type === 'MARGIN_PAYMENT' && e.amountInr > 0);
  const hedgeSettlement = entries.find(e => e.type === 'HEDGE_SETTLEMENT');

  // Constants & Extracted Values
  const clientHedgeRate = marginDeposit?.rate || 0;
  const maturitySpotRate = hedgeSettlement?.rate || 0;
  
  // Spread logic for commercial output
  // User requested actual spread between bid and ask, usually ~0.04 for USD/INR
  const ACTUAL_SPREAD = scenario.pair === 'JPY/INR' ? 0.0010 : 0.0400;
  
  const contractSize = scenario.amount;
  const basis = scenario.pair === 'JPY/INR' ? 100 : 1;
  const normalizedSize = contractSize / basis;
  const isExporter = scenario.type === ClientType.EXPORTER;

  // OUTPUT 1: CLIENT-FACING INVOICE (EXTERNAL)
  const deliveryRate = isExporter ? clientHedgeRate - ACTUAL_SPREAD : clientHedgeRate + ACTUAL_SPREAD;
  const convertedAmountInr = deliveryRate * normalizedSize;
  const initialMarginAmount = marginDeposit?.amountInr || 0;
  const totalAmountPayable = convertedAmountInr + initialMarginAmount;

  // OUTPUT 2: BANK INTERNAL TREASURY REPORT (INTERNAL ONLY)
  const amountSoldInr = clientHedgeRate * normalizedSize;
  const amountBoughtInr = maturitySpotRate * normalizedSize;
  
  // Realized P&L on Hedge (Internal Treasury Component)
  // (Booking Rate - Maturity Fix) for Exporter (Bank Buy)
  // (Maturity Fix - Booking Rate) for Importer (Bank Sell)
  const hedgePnlInr = isExporter 
    ? (clientHedgeRate - maturitySpotRate) * normalizedSize
    : (maturitySpotRate - clientHedgeRate) * normalizedSize;

  // Revenue Component
  const spreadEarnedInr = ACTUAL_SPREAD * normalizedSize;

  // Physical Settlement Reconciliation
  const physicalGrossConversion = maturitySpotRate * normalizedSize;
  
  // Reconciling Total Value to Client
  // Following user request: Conversion @ Market Fix + Hedge PNL - Spread
  const totalValueToClient = (physicalGrossConversion + hedgePnlInr) - spreadEarnedInr;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300 font-mono">
      <div className="max-w-4xl w-full bg-[#0a0a0a] border border-[#333] shadow-[0_0_100px_rgba(255,153,0,0.2)] flex flex-col overflow-hidden h-[85vh]">
        
        {/* Navigation Toggle */}
        <div className="bg-[#111] p-2 flex border-b border-[#222] shrink-0">
          <button 
            onClick={() => setReportType('CLIENT')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${reportType === 'CLIENT' ? 'bg-[#ff9900] text-black shadow-[0_0_15px_rgba(255,153,0,0.3)]' : 'text-gray-500 hover:text-white'}`}
          >
            Output 1: Client Invoice (External)
          </button>
          <button 
            onClick={() => setReportType('INTERNAL')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${reportType === 'INTERNAL' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-gray-500 hover:text-white'}`}
          >
            Output 2: Treasury Report (Internal)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          {reportType === 'CLIENT' ? (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="border-b-2 border-white pb-6 flex justify-between items-baseline">
                <h2 className="text-white text-4xl font-black uppercase tracking-tighter">Commercial Invoice</h2>
                <div className="text-right">
                  <p className="text-[#ff9900] text-[10px] font-black uppercase tracking-widest">Date: {new Date().toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-600 text-[8px] font-black uppercase">Ref: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-[11px]">
                <div className="space-y-1">
                  <span className="text-gray-600 uppercase font-black text-[9px]">Billed To</span>
                  <p className="text-white font-black text-lg">{scenario.name}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-gray-600 uppercase font-black text-[9px]">Contract Reference</span>
                  <p className="text-white font-black text-lg">FWD-{scenario.id}-{scenario.pair.replace('/','')}</p>
                </div>
              </div>

              <div className="border border-[#222] bg-black/40 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#111] text-[9px] text-gray-500 uppercase font-black border-b border-[#222]">
                    <tr>
                      <th className="p-4">Particulars</th>
                      <th className="p-4 text-center">Rate</th>
                      <th className="p-4 text-right">Amount (₹)</th>
                      <th className="p-4">Formula / Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] text-gray-300">
                    <tr className="border-b border-[#111] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">Hedge Rate</td>
                      <td className="p-4 text-center font-mono text-white font-black">{clientHedgeRate.toFixed(4)}</td>
                      <td className="p-4 text-right">--</td>
                      <td className="p-4 text-[9px] italic text-gray-600">Locked booking rate</td>
                    </tr>
                    <tr className="border-b border-[#111] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">Spread</td>
                      <td className="p-4 text-center font-mono text-red-400 font-bold">{ACTUAL_SPREAD.toFixed(4)}</td>
                      <td className="p-4 text-right">--</td>
                      <td className="p-4 text-[9px] italic text-gray-600">Actual Interbank Spread</td>
                    </tr>
                    <tr className="border-b border-[#222] bg-white/5 group">
                      <td className="p-4 font-black text-white">Delivery Rate</td>
                      <td className="p-4 text-center font-black text-[#ff9900] text-lg">{deliveryRate.toFixed(4)}</td>
                      <td className="p-4 text-right">--</td>
                      <td className="p-4 text-[9px] font-black text-[#ff9900] uppercase tracking-tighter">Hedge Rate − Spread</td>
                    </tr>
                    <tr className="border-b border-[#111] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">Contract Size</td>
                      <td className="p-4 text-center">--</td>
                      <td className="p-4 text-right font-black text-white">{contractSize.toLocaleString()} {scenario.pair.split('/')[0]}</td>
                      <td className="p-4 text-[9px] italic text-gray-600">Forward Mandate Volume</td>
                    </tr>
                    <tr className="border-b border-[#111] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">Converted Amount</td>
                      <td className="p-4 text-center">--</td>
                      <td className="p-4 text-right font-bold text-white">{convertedAmountInr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-4 text-[9px] italic text-gray-600">Delivery Rate × Contract Size</td>
                    </tr>
                    <tr className="border-b border-[#111] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-red-500">Margin Required</td>
                      <td className="p-4 text-center">--</td>
                      <td className="p-4 text-right font-bold text-red-500">{initialMarginAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-4 text-[9px] italic text-gray-600">Original Security Provision</td>
                    </tr>
                    <tr className="bg-white/10">
                      <td className="p-6 font-black text-white text-sm">Total Amount Payable</td>
                      <td className="p-6 text-center">--</td>
                      <td className="p-6 text-right font-black text-[#ff9900] text-2xl drop-shadow-lg">₹ {totalAmountPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-6 text-[9px] font-black text-white uppercase tracking-tighter">Converted Amt + Margin Req</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
              <div className="border-b-2 border-blue-600 pb-6 flex justify-between items-baseline">
                <div>
                  <h2 className="text-blue-500 text-4xl font-black uppercase tracking-tighter">Treasury Report</h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">INTERNAL AUDIT CLASSIFICATION: P3</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Treasury Desk: FX-1</p>
                </div>
              </div>

              <div className="flex flex-col gap-10">
                
                {/* 1. POSITION SUMMARY */}
                <section className="space-y-4">
                  <h3 className="text-[11px] text-blue-400 font-black uppercase tracking-widest border-b border-blue-900/40 pb-2">1. Hedge Position Summary</h3>
                  <div className="bg-[#111] p-6 rounded-sm space-y-4 border-l-2 border-blue-600 shadow-inner">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-600 font-black uppercase">Counterparty & Mandate</span>
                      <span className="text-white text-xs font-black">
                        {scenario.name} | {contractSize.toLocaleString()} {scenario.pair.split('/')[0]} {scenario.tenor} Forward
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-[#222] pt-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase">Bank Positioning</span>
                        <span className={`text-[10px] font-bold ${isExporter ? 'text-green-500' : 'text-blue-500'}`}>{isExporter ? 'BUY (From Client)' : 'SELL (To Client)'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase">Booking Rate (Strike)</span>
                        <span className="text-white text-[10px] font-black">{clientHedgeRate.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. HEDGE P&L */}
                <section className="space-y-4">
                  <h3 className="text-[11px] text-blue-400 font-black uppercase tracking-widest border-b border-blue-900/40 pb-2">2. Hedge P&L Calculation</h3>
                  <div className="bg-[#111] p-6 rounded-sm space-y-4 border-l-2 border-red-600/50 shadow-inner">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500 uppercase font-black">Hedge Entry (₹)</span>
                      <span className="text-white font-black">{amountSoldInr.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500 uppercase font-black">Market Fixing Exit (₹)</span>
                      <span className="text-white font-black">{amountBoughtInr.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="border-t border-[#333] pt-4 flex justify-between items-baseline">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Realized P&L on Hedge (₹)</span>
                      <span className={`text-xl font-black ${hedgePnlInr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {hedgePnlInr >= 0 ? '+' : ''}{hedgePnlInr.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </span>
                    </div>
                  </div>
                </section>

                {/* 3. SETTLEMENT RECONCILIATION */}
                <section className="space-y-4">
                  <h3 className="text-[11px] text-blue-400 font-black uppercase tracking-widest border-b border-blue-900/40 pb-2">3. Physical Settlement Reconciliation</h3>
                  <div className="bg-[#111] p-6 rounded-sm space-y-4 border-l-2 border-white/20 shadow-inner">
                    <div className="flex flex-col gap-1 border-b border-[#222] pb-4">
                      <span className="text-[8px] text-gray-600 font-black uppercase">Physical Conversion at Maturity Fix</span>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] text-gray-400">
                          {normalizedSize.toLocaleString()} {scenario.pair.split('/')[0]} @ {maturitySpotRate.toFixed(4)}
                        </span>
                        <span className="text-white font-black text-sm">₹ {physicalGrossConversion.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-end text-[11px]">
                            <span className="text-gray-500 uppercase font-black text-[9px]">Derivative Adjustment (Hedge P&L)</span>
                            <span className={`font-black ${hedgePnlInr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {hedgePnlInr >= 0 ? '+' : ''}{hedgePnlInr.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </span>
                        </div>
                        <div className="flex justify-between items-end text-[11px]">
                            <span className="text-gray-500 uppercase font-black text-[9px]">Commercial Spread Deduction</span>
                            <span className="text-red-400 font-black">
                                -{spreadEarnedInr.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-white/40 pt-4 flex justify-between items-baseline">
                      <span className="text-white font-black uppercase text-[10px]">Total Value to Client (Conversion Basis)</span>
                      <span className="text-white font-black text-lg">₹ {totalValueToClient.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>

                    <div className="flex justify-between items-baseline border-t border-[#222] pt-4">
                        <span className="text-gray-500 font-black uppercase text-[9px]">Total Margin Refund</span>
                        <span className="text-white font-black text-lg">₹ {initialMarginAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>

                    <div className="border-t-2 border-[#ff9900] pt-4 flex justify-between items-baseline">
                      <span className="text-[#ff9900] font-black uppercase text-[11px]">Total Amount Payable to Client</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[#ff9900] font-black text-2xl drop-shadow-md">₹ {totalAmountPayable.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        <span className="text-[7px] text-gray-500 uppercase font-black">Matches Output 1: Commercial Invoice</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. REVENUE ATTRIBUTION */}
                <section className="space-y-4">
                  <h3 className="text-[11px] text-blue-400 font-black uppercase tracking-widest border-b border-blue-900/40 pb-2">4. Bank Revenue Attribution</h3>
                  <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-sm space-y-4 shadow-2xl">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-blue-300 font-black uppercase tracking-tighter">Gross Commercial Spread (₹)</span>
                      <span className="text-white font-black">{spreadEarnedInr.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="border-t border-blue-500/50 pt-4 flex justify-between items-baseline">
                      <span className="text-blue-400 font-black uppercase text-[12px]">Total Bank Revenue</span>
                      <span className="text-white font-black text-2xl">₹ {spreadEarnedInr.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-[#050505] p-8 border-t border-[#222] flex justify-between items-center shrink-0">
          <button 
            onClick={onClose}
            className="text-gray-700 hover:text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 border border-[#222] transition-all hover:border-red-600"
          >
            Cancel Dispatch
          </button>
          <div className="flex gap-4">
             <button 
                onClick={onSend}
                className="bg-[#ff9900] hover:bg-white text-black font-black px-16 py-4 text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_10px_30px_rgba(255,153,0,0.2)] active:scale-95 rounded-sm"
              >
                PROCEED TO SETTLEMENT
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeReport;
