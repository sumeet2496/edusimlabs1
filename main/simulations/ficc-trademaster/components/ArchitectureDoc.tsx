
import React from 'react';

const ArchitectureDoc: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto prose prose-invert pb-24">
      <h1 className="text-4xl font-bold text-orange-500 mb-8 border-b border-orange-500 pb-4 tracking-tighter uppercase">Subsystem Blueprint: Risk, P&L & KPI Engines</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl text-white mb-4">1. P&L Engine Architecture</h2>
        <div className="bg-[#111] p-6 border border-[#333] font-mono text-[11px]">
          <h4 className="text-orange-400 mb-2">// TOTAL DESK P&L FORMULA</h4>
          <p className="text-gray-400">
            PnL_total = Σ (MTM_unrealized + PnL_realized + PnL_carry - Costs_funding)
          </p>
          <ul className="text-gray-500 space-y-1 mt-4">
            <li>• MTM_unrealized: Discounted cash flow (DCF) delta between entry and current rates.</li>
            <li>• PnL_carry: Daily accrual of (Fixed - Float) spread. Simulated at 1/360 per tick.</li>
            <li>• PnL_realized: P&L locked in via offset trades or mispricing slippage.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl text-white mb-4">2. Risk & Compliance Engine</h2>
        <p className="text-gray-400 text-sm mb-4">
          The <strong>Risk Engine</strong> monitors the global position book every 1000ms. It calculates 1st and 2nd order sensitivities to drive limit monitoring:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-4 border border-[#222]">
            <h4 className="text-white text-xs font-bold uppercase mb-2">DV01 Aggregation</h4>
            <p className="text-[10px] text-gray-500">
              Calculates sensitivity to a 1bp shift in the zero curve. Summed per currency to detect concentration risk.
            </p>
          </div>
          <div className="bg-black p-4 border border-[#222]">
            <h4 className="text-white text-xs font-bold uppercase mb-2">Parametric VaR</h4>
            <p className="text-[10px] text-gray-500">
              Value-at-Risk (95% CI) computed as: <br/>
              <code className="text-orange-500">VaR = |DV01_total| * 2.33 * σ_market</code>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl text-white mb-4">3. KPI Weighted Score Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#222] text-gray-400">
                <th className="p-2 text-left">CATEGORY</th>
                <th className="p-2 text-center">WEIGHT</th>
                <th className="p-2 text-left">PRIMARY DRIVER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              <tr><td className="p-2 text-white">Desk P&L</td><td className="p-2 text-center">40%</td><td className="p-2 text-gray-500">Net realized and unrealized earnings.</td></tr>
              <tr><td className="p-2 text-white">Client Trust</td><td className="p-2 text-center">20%</td><td className="p-2 text-gray-500">Quote accuracy and RFQ response time.</td></tr>
              <tr><td className="p-2 text-white">Boss Satisfaction</td><td className="p-2 text-center">20%</td><td className="p-2 text-gray-500">Instruction following and P&L stability.</td></tr>
              <tr><td className="p-2 text-white">Risk Compliance</td><td className="p-2 text-center">10%</td><td className="p-2 text-gray-500">Avoiding limit breaches (DV01/Delta).</td></tr>
              <tr><td className="p-2 text-white">Operational Acc.</td><td className="p-2 text-center">5%</td><td className="p-2 text-gray-500">Error-free trade execution.</td></tr>
              <tr><td className="p-2 text-white">Strategic Judgment</td><td className="p-2 text-center">5%</td><td className="p-2 text-gray-500">Preparation for and handling of macro shocks.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl text-white mb-4">4. Logic Loop Synchronisation</h2>
        <div className="border-l-2 border-orange-500 pl-6 py-2 space-y-6">
          <div>
            <h4 className="text-white text-xs font-bold uppercase">Tick (T=0ms)</h4>
            <p className="text-[11px] text-gray-500">Market Engine evolves curves. Event Engine checks for macro shocks.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase">Update (T=20ms)</h4>
            <p className="text-[11px] text-gray-500">P&L Engine recalculates MtM and Carry for all open trades against new curves.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase">Risk (T=50ms)</h4>
            <p className="text-[11px] text-gray-500">Risk Engine aggregates DV01 and VaR. Detects breaches for KPI penalty triggers.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase">KPI (T=100ms)</h4>
            <p className="text-[11px] text-gray-500">KPI Engine computes composite performance rating. State push to UI.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDoc;
