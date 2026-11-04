import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';

interface RectifierHalfModuleProps {
  isRectifying: boolean;
}

export const RectifierHalfModule: React.FC<RectifierHalfModuleProps> = ({ isRectifying }) => {
  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-3 text-neutral-900 shadow-sm">
      <ScrewHead className="absolute top-1 left-1" size={10} />
      <ScrewHead className="absolute top-1 right-1" size={10} />
      <ScrewHead className="absolute bottom-1 left-1" size={10} />
      <ScrewHead className="absolute bottom-1 right-1" size={10} />

      {/* Module Title */}
      <div className="text-center">
        <h2 className="text-[11px] font-black tracking-wider uppercase text-neutral-900">
          RECTIFIER HALF WAVE
        </h2>
      </div>

      {/* Grid of Sections: Discrete Diodes 1N4007, Capacitors, Inductors, Resistors */}
      <div className="mt-1 flex items-center justify-between space-x-3 px-2">
        {/* 1. Discrete Diodes 1N4007 */}
        <div className="flex flex-col space-y-3">
          {/* Diode 1 */}
          <div className="flex items-center space-x-1">
            <BananaTerminal id="rect_half_d1_anode" />
            <svg viewBox="0 0 36 16" className="h-4 w-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="0" y1="8" x2="12" y2="8" />
              <polygon points="12,2 12,14 24,8" fill="#525252" />
              <line x1="24" y1="2" x2="24" y2="14" strokeWidth="2.2" />
              <line x1="24" y1="8" x2="36" y2="8" />
            </svg>
            <BananaTerminal id="rect_half_d1_cathode" />
            <span className="text-[7px] font-bold text-neutral-700">1N4007</span>
          </div>

          {/* Diode 2 */}
          <div className="flex items-center space-x-1">
            <BananaTerminal id="rect_half_d2_anode" />
            <svg viewBox="0 0 36 16" className="h-4 w-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="0" y1="8" x2="12" y2="8" />
              <polygon points="12,2 12,14 24,8" fill="#525252" />
              <line x1="24" y1="2" x2="24" y2="14" strokeWidth="2.2" />
              <line x1="24" y1="8" x2="36" y2="8" />
            </svg>
            <BananaTerminal id="rect_half_d2_cathode" />
            <span className="text-[7px] font-bold text-neutral-700">1N4007</span>
          </div>
        </div>

        {/* 2. Capacitors Filter (1000 uF, 2200 uF) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-3">
            {/* 1000 uF */}
            <div className="flex flex-col items-center space-y-1">
              <BananaTerminal id="rect_half_c1000_pos" label="+" labelPosition="top" />
              <svg viewBox="0 0 20 28" className="h-7 w-5 text-neutral-800" stroke="currentColor" fill="none">
                <line x1="10" y1="0" x2="10" y2="10" strokeWidth="1.5" />
                <line x1="2" y1="10" x2="18" y2="10" strokeWidth="2" />
                <path d="M 2 18 C 5 14, 15 14, 18 18" strokeWidth="2" />
                <line x1="10" y1="17" x2="10" y2="28" strokeWidth="1.5" />
              </svg>
              <BananaTerminal id="rect_half_c1000_neg" label="-" labelPosition="bottom" />
              <span className="text-[7px] font-bold text-neutral-700">1000 uF</span>
            </div>

            {/* 2200 uF */}
            <div className="flex flex-col items-center space-y-1">
              <BananaTerminal id="rect_half_c2200_pos" label="+" labelPosition="top" />
              <svg viewBox="0 0 20 28" className="h-7 w-5 text-neutral-800" stroke="currentColor" fill="none">
                <line x1="10" y1="0" x2="10" y2="10" strokeWidth="1.5" />
                <line x1="2" y1="10" x2="18" y2="10" strokeWidth="2" />
                <path d="M 2 18 C 5 14, 15 14, 18 18" strokeWidth="2" />
                <line x1="10" y1="17" x2="10" y2="28" strokeWidth="1.5" />
              </svg>
              <BananaTerminal id="rect_half_c2200_neg" label="-" labelPosition="bottom" />
              <span className="text-[7px] font-bold text-neutral-700">2200 uF</span>
            </div>
          </div>
        </div>

        {/* 3. Inductor Chokes (0.04 mH, 0.2 mH) */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              <BananaTerminal id="rect_half_l004_1" />
              <svg viewBox="0 0 36 14" className="h-3.5 w-10 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M 0 9 L 6 9 C 9 0, 13 0, 16 9 C 19 0, 23 0, 26 9 C 29 0, 33 0, 36 9" />
              </svg>
              <BananaTerminal id="rect_half_l004_2" />
            </div>
            <span className="text-[7px] font-bold text-neutral-700 mt-0.5">0.04 mH</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              <BananaTerminal id="rect_half_l02_1" />
              <svg viewBox="0 0 36 14" className="h-3.5 w-10 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M 0 9 L 6 9 C 9 0, 13 0, 16 9 C 19 0, 23 0, 26 9 C 29 0, 33 0, 36 9" />
              </svg>
              <BananaTerminal id="rect_half_l02_2" />
            </div>
            <span className="text-[7px] font-bold text-neutral-700 mt-0.5">0.2 mH</span>
          </div>
        </div>

        {/* 4. Resistors (330 Ω, 1 kΩ) */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <BananaTerminal id="rect_half_r330_top" />
            <svg viewBox="0 0 14 36" className="h-8 w-3 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M 7 0 L 7 6 L 1 10 L 13 16 L 1 22 L 13 28 L 7 32 L 7 36" />
            </svg>
            <BananaTerminal id="rect_half_r330_bot" />
            <span className="text-[7px] font-bold text-neutral-700">330 Ω</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <BananaTerminal id="rect_half_r1k_top" />
            <svg viewBox="0 0 14 36" className="h-8 w-3 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M 7 0 L 7 6 L 1 10 L 13 16 L 1 22 L 13 28 L 7 32 L 7 36" />
            </svg>
            <BananaTerminal id="rect_half_r1k_bot" />
            <span className="text-[7px] font-bold text-neutral-700">1 kΩ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
