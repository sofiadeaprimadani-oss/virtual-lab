import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';

interface PowerSupplyDcModuleProps {
  isOn: boolean;
  onToggle: () => void;
}

export const PowerSupplyDcModule: React.FC<PowerSupplyDcModuleProps> = ({ isOn, onToggle }) => {
  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-2.5 text-neutral-900 shadow-sm h-full">
      <ScrewHead className="absolute top-1 left-1" size={9} />
      <ScrewHead className="absolute top-1 right-1" size={9} />
      <ScrewHead className="absolute bottom-1 left-1" size={9} />
      <ScrewHead className="absolute bottom-1 right-1" size={9} />

      <div className="text-center">
        <h2 className="text-[10px] font-black tracking-wider uppercase text-neutral-900">
          POWER SUPPLY DC 12V
        </h2>
      </div>

      {/* Industrial Rocker Switch & Terminals */}
      <div className="my-1.5 flex items-center justify-between px-1">
        {/* Rocker Switch */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            role="switch"
            aria-checked={isOn}
            aria-label="Saklar Daya Catu Daya DC 12V"
            onClick={onToggle}
            className="group relative flex h-14 w-10 cursor-pointer flex-col items-center justify-between rounded-sm border-2 border-neutral-950 bg-neutral-900 p-1 shadow-[0_2px_4px_rgba(0,0,0,0.6)] active:scale-95 transition-transform"
          >
            <div
              className={`flex w-full flex-1 flex-col items-center justify-between rounded-xs border border-red-900/60 p-0.5 transition-all ${
                isOn
                  ? 'bg-gradient-to-b from-red-600 via-red-500 to-red-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_10px_rgba(239,68,68,0.8)]'
                  : 'bg-gradient-to-b from-red-950 via-neutral-900 to-red-950 shadow-inner'
              }`}
            >
              <span className={`text-[7px] font-black ${isOn ? 'text-white' : 'text-neutral-500'}`}>
                I
              </span>
              <div
                className={`h-2 w-2 rounded-full border border-neutral-900 transition-colors ${
                  isOn ? 'bg-amber-300 shadow-[0_0_6px_#fde047]' : 'bg-red-950'
                }`}
              />
              <span className={`text-[7px] font-black ${isOn ? 'text-neutral-400' : 'text-neutral-300'}`}>
                O
              </span>
            </div>
          </button>
          <span className="mt-0.5 text-[8px] font-bold text-neutral-700">
            {isOn ? '12V ON' : 'OFF'}
          </span>
        </div>

        {/* Output Terminals: (+) Red and (-) Black */}
        <div className="flex flex-col items-center space-y-2">
          <BananaTerminal id="ps_dc12_pos" label="+" labelPosition="left" />
          <BananaTerminal id="ps_dc12_neg" label="-" labelPosition="left" />
        </div>
      </div>

      <div className="text-right text-[7px] font-bold text-neutral-500">
        12V Regulated
      </div>
    </div>
  );
};
