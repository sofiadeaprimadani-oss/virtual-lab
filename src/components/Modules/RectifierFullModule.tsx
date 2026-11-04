import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';

interface RectifierFullModuleProps {
  isRectifying: boolean;
}

export const RectifierFullModule: React.FC<RectifierFullModuleProps> = ({ isRectifying }) => {
  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-3 text-neutral-900 shadow-sm">
      <ScrewHead className="absolute top-1 left-1" size={10} />
      <ScrewHead className="absolute top-1 right-1" size={10} />
      <ScrewHead className="absolute bottom-1 left-1" size={10} />
      <ScrewHead className="absolute bottom-1 right-1" size={10} />

      {/* Module Title */}
      <div className="text-center">
        <h2 className="text-[11px] font-black tracking-wider uppercase text-neutral-900">
          RECTIFIER FULL WAVE
        </h2>
      </div>

      {/* Grid of Sections: Diode Bridge, Capacitors, Inductors, Resistors */}
      <div className="mt-1 flex items-center justify-between space-x-3 px-2">
        {/* 1. Dioda Bridge */}
        <div className="flex flex-col items-center">
          {/* Top AC Terminal */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-neutral-700">~</span>
            <BananaTerminal id="bridge_ac_top" />
          </div>

          {/* Diode Bridge Diamond with Left (-) and Right (+) Terminals */}
          <div className="relative my-0.5 flex h-18 w-26 items-center justify-between px-1">
            {/* Left Terminal (-) */}
            <div className="flex items-center space-x-0.5">
              <span className="text-[9px] font-bold text-neutral-800">-</span>
              <BananaTerminal id="bridge_minus" />
            </div>

            {/* Diamond schematic center */}
            <div className="relative h-14 w-14">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full text-neutral-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <polygon points="50,10 90,50 50,90 10,50" strokeWidth="1.5" stroke="#404040" />
                <polygon points="62,28 72,38 72,28" fill="#525252" />
                <line x1="72" y1="26" x2="72" y2="40" strokeWidth="2" />
                <polygon points="62,72 72,62 72,72" fill="#525252" />
                <line x1="72" y1="60" x2="72" y2="74" strokeWidth="2" />
                <polygon points="38,28 28,38 28,28" fill="#525252" />
                <line x1="28" y1="26" x2="28" y2="40" strokeWidth="2" />
                <polygon points="38,72 28,62 28,72" fill="#525252" />
                <line x1="28" y1="60" x2="28" y2="74" strokeWidth="2" />
              </svg>

              {isRectifying && (
                <div className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/20 blur-md animate-pulse" />
              )}
            </div>

            {/* Right Terminal (+) */}
            <div className="flex items-center space-x-0.5">
              <BananaTerminal id="bridge_plus" />
              <span className="text-[9px] font-bold text-neutral-800">+</span>
            </div>
          </div>

          {/* Bottom AC Terminal */}
          <div className="flex flex-col items-center">
            <BananaTerminal id="bridge_ac_bot" />
            <span className="text-[8px] font-bold text-neutral-700">~</span>
          </div>

          <span className="mt-0.5 text-[8px] font-black uppercase text-neutral-800">DIODA BRIDGE</span>
        </div>

        {/* 2. Capacitors Filter (1000 uF, 2200 uF) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-3">
            {/* 1000 uF */}
            <div className="flex flex-col items-center space-y-1">
              <BananaTerminal id="rect_full_c1000_pos" label="+" labelPosition="top" />
              <svg viewBox="0 0 20 28" className="h-7 w-5 text-neutral-800" stroke="currentColor" fill="none">
                <line x1="10" y1="0" x2="10" y2="10" strokeWidth="1.5" />
                <line x1="2" y1="10" x2="18" y2="10" strokeWidth="2" />
                <path d="M 2 18 C 5 14, 15 14, 18 18" strokeWidth="2" />
                <line x1="10" y1="17" x2="10" y2="28" strokeWidth="1.5" />
              </svg>
              <BananaTerminal id="rect_full_c1000_neg" label="-" labelPosition="bottom" />
              <span className="text-[7px] font-bold text-neutral-700">1000 uF</span>
            </div>

            {/* 2200 uF */}
            <div className="flex flex-col items-center space-y-1">
              <BananaTerminal id="rect_full_c2200_pos" label="+" labelPosition="top" />
              <svg viewBox="0 0 20 28" className="h-7 w-5 text-neutral-800" stroke="currentColor" fill="none">
                <line x1="10" y1="0" x2="10" y2="10" strokeWidth="1.5" />
                <line x1="2" y1="10" x2="18" y2="10" strokeWidth="2" />
                <path d="M 2 18 C 5 14, 15 14, 18 18" strokeWidth="2" />
                <line x1="10" y1="17" x2="10" y2="28" strokeWidth="1.5" />
              </svg>
              <BananaTerminal id="rect_full_c2200_neg" label="-" labelPosition="bottom" />
              <span className="text-[7px] font-bold text-neutral-700">2200 uF</span>
            </div>
          </div>
        </div>

        {/* 3. Inductor Chokes (0.04 mH, 0.2 mH) */}
        <div className="flex flex-col items-center space-y-3">
          {/* 0.04 mH */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              <BananaTerminal id="rect_full_l004_1" />
              <svg viewBox="0 0 36 14" className="h-3.5 w-10 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M 0 9 L 6 9 C 9 0, 13 0, 16 9 C 19 0, 23 0, 26 9 C 29 0, 33 0, 36 9" />
              </svg>
              <BananaTerminal id="rect_full_l004_2" />
            </div>
            <span className="text-[7px] font-bold text-neutral-700 mt-0.5">0.04 mH</span>
          </div>

          {/* 0.2 mH */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              <BananaTerminal id="rect_full_l02_1" />
              <svg viewBox="0 0 36 14" className="h-3.5 w-10 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M 0 9 L 6 9 C 9 0, 13 0, 16 9 C 19 0, 23 0, 26 9 C 29 0, 33 0, 36 9" />
              </svg>
              <BananaTerminal id="rect_full_l02_2" />
            </div>
            <span className="text-[7px] font-bold text-neutral-700 mt-0.5">0.2 mH</span>
          </div>
        </div>

        {/* 4. Resistors (330 Ω, 1 kΩ) */}
        <div className="flex items-center space-x-3">
          {/* 330 Ω */}
          <div className="flex flex-col items-center space-y-1">
            <BananaTerminal id="rect_full_r330_top" />
            <svg viewBox="0 0 14 36" className="h-8 w-3 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M 7 0 L 7 6 L 1 10 L 13 16 L 1 22 L 13 28 L 7 32 L 7 36" />
            </svg>
            <BananaTerminal id="rect_full_r330_bot" />
            <span className="text-[7px] font-bold text-neutral-700">330 Ω</span>
          </div>

          {/* 1 kΩ */}
          <div className="flex flex-col items-center space-y-1">
            <BananaTerminal id="rect_full_r1k_top" />
            <svg viewBox="0 0 14 36" className="h-8 w-3 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M 7 0 L 7 6 L 1 10 L 13 16 L 1 22 L 13 28 L 7 32 L 7 36" />
            </svg>
            <BananaTerminal id="rect_full_r1k_bot" />
            <span className="text-[7px] font-bold text-neutral-700">1 kΩ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
