
import React from 'react';
import { ClientScenario } from '../types';

interface Props {
  scenario: ClientScenario;
  active: boolean;
}

const ClientWindow: React.FC<Props> = ({ scenario, active }) => {
  if (!active) {
    return (
      <div className="h-full flex items-center justify-center italic opacity-30">
        No active client connection.
      </div>
    );
  }

  // Fix: Deriving pairBase as 'currency' property is not part of the ClientScenario type
  const pairBase = scenario.pair.split('/')[0];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-4">
        <span className="text-xs text-green-700 block uppercase font-bold">Business Unit</span>
        <span className="text-lg text-white font-bold">{scenario.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-2 border border-green-900 bg-green-950 bg-opacity-20">
          <span className="text-[10px] opacity-50 block uppercase">Exposure Type</span>
          <span className="text-sm font-bold tracking-wider">{scenario.type}</span>
        </div>
        <div className="p-2 border border-green-900 bg-green-950 bg-opacity-20">
          <span className="text-[10px] opacity-50 block uppercase">Notional Amount</span>
          <span className="text-sm font-bold tracking-wider">{scenario.amount.toLocaleString()} {pairBase}</span>
        </div>
        <div className="p-2 border border-green-900 bg-green-950 bg-opacity-20">
          <span className="text-[10px] opacity-50 block uppercase">Settlement Date</span>
          <span className="text-sm font-bold tracking-wider">{scenario.tenor} Forward</span>
        </div>
        <div className="p-2 border border-green-900 bg-green-950 bg-opacity-20">
          <span className="text-[10px] opacity-50 block uppercase">Priority</span>
          <span className="text-sm font-bold tracking-wider text-yellow-500">STANDARD</span>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded text-sm italic border-l-2 border-green-500 text-green-200">
        " {scenario.description} "
      </div>
    </div>
  );
};

export default ClientWindow;
