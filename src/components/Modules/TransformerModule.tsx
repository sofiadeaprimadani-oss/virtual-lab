import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';

interface TransformerModuleProps {
  isEnergized: boolean;
}

export const TransformerModule: React.FC<TransformerModuleProps> = ({ isEnergized }) => {
  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-3 text-neutral-900 shadow-sm">
      <ScrewHead className="absolute top-1 left-1" size={10} />
      <ScrewHead className="absolute top-1 right-1" size={10} />
      <ScrewHead className="absolute bottom-1 left-1" size={10} />
      <ScrewHead className="absolute bottom-1 right-1" size={10} />

      {/* Module Title */}
      <div className="text-center">
        <h2 className="text-[11px] font-black tracking-wider uppercase text-neutral-900">
          TRANSFORMER
        </h2>
      </div>

      {/* Primary Input Terminals (0, 220) */}
      <div className="flex justify-between px-6 pt-1">
        <BananaTerminal id="trafo_pri_0" label="0" labelPosition="top" />
        <BananaTerminal id="trafo_pri_220" label="220" labelPosition="top" />
      </div>

      {/* Center-Tapped Transformer Schematic Diagram */}
      <div className="relative my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 160 60"
          className="h-14 w-36 text-neutral-800 select-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {/* Primary Windings */}
          <path d="M 30 5 L 30 15" />
          <path d="M 130 5 L 130 15" />
          <path d="M 30 15 C 30 8, 55 8, 55 15 C 55 8, 80 8, 80 15 C 80 8, 105 8, 105 15 C 105 8, 130 8, 130 15" />

          {/* Magnetic Core (Dual parallel lines) */}
          <line
            x1="25"
            y1="26"
            x2="135"
            y2="26"
            stroke={isEnergized ? '#ea580c' : '#525252'}
            strokeWidth="2"
          />
          <line
            x1="25"
            y1="30"
            x2="135"
            y2="30"
            stroke={isEnergized ? '#ea580c' : '#525252'}
            strokeWidth="2"
          />

          {/* Secondary Windings */}
          <path d="M 30 42 C 30 48, 55 48, 55 42 C 55 48, 80 48, 80 42 C 80 48, 105 48, 105 42 C 105 48, 130 48, 130 42" />

          {/* Center Tap Lead */}
          <path d="M 80 42 L 80 55" strokeWidth="2.5" />
        </svg>

        {isEnergized && (
          <div className="pointer-events-none absolute inset-x-8 top-5 h-4 rounded-full bg-amber-400/20 blur-sm animate-pulse" />
        )}
      </div>

      {/* Secondary Terminals Row 1: 12, CT, 12 */}
      <div className="flex items-center justify-around px-2">
        <BananaTerminal id="trafo_sec_12_l" label="12" labelPosition="bottom" />
        <BananaTerminal id="trafo_ct" label="CT" labelPosition="bottom" />
        <BananaTerminal id="trafo_sec_12_r" label="12" labelPosition="bottom" />
      </div>

      {/* Secondary Terminals Row 2: 18, 15, 15, 18 */}
      <div className="mt-1 flex items-center justify-between px-1">
        <BananaTerminal id="trafo_sec_18_l" label="18" labelPosition="bottom" />
        <BananaTerminal id="trafo_sec_15_l" label="15" labelPosition="bottom" />
        <BananaTerminal id="trafo_sec_15_r" label="15" labelPosition="bottom" />
        <BananaTerminal id="trafo_sec_18_r" label="18" labelPosition="bottom" />
      </div>
    </div>
  );
};
