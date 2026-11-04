import React from 'react';
import { BananaTerminal } from '../BananaTerminal';

interface InverterModuleProps {
  isRunning: boolean;
}

export const InverterModule: React.FC<InverterModuleProps> = ({ isRunning }) => {
  return (
    <div className="flex flex-col justify-between h-full space-y-2.5">
      {/* 1. UPPER INVERTER (NPN Push-Pull / Switching Stage) */}
      <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-2.5 text-neutral-900 shadow-sm flex-1">
        {/* Header Title */}
        <div className="text-center pb-1 border-b border-neutral-400/40">
          <h2 className="text-[11px] font-black tracking-widest uppercase text-neutral-900 font-sans">
            INVERTER
          </h2>
        </div>

        {/* NPN 1 (Top Transistor) */}
        <div className="relative my-1 flex flex-col items-center">
          {/* Top Row: Terminal B & NPN Label */}
          <div className="relative w-full flex items-center justify-center">
            <BananaTerminal id="inv_npn1_b" label="B" labelPosition="top" />
            <span className="absolute right-0 top-0 rounded border border-neutral-700 bg-white/80 px-1.5 py-0.5 text-[8px] font-black tracking-wider text-neutral-800 shadow-xs">
              NPN
            </span>
          </div>

          {/* Middle Row: E Terminal - SVG Transistor Schematic - C Terminal */}
          <div className="flex items-center justify-center space-x-2 w-full mt-1">
            <BananaTerminal id="inv_npn1_e" label="E" labelPosition="left" />

            {/* Precision NPN Schematic (Horizontal Base Bar, B on top, E left, C right) */}
            <svg
              viewBox="0 0 76 52"
              className="h-11 w-16 text-neutral-900 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Enclosing Transistor Circle */}
              <circle cx="38" cy="27" r="21" strokeWidth="1.4" />

              {/* Base lead from top B terminal into circle */}
              <line x1="38" y1="0" x2="38" y2="18" strokeWidth="1.5" />

              {/* Horizontal Base Plate Bar */}
              <line x1="25" y1="18" x2="51" y2="18" strokeWidth="2.6" />

              {/* Emitter branch going down-left with outward arrow */}
              <line x1="30" y1="18" x2="17" y2="38" strokeWidth="1.5" />
              <line x1="17" y1="38" x2="0" y2="38" strokeWidth="1.5" />
              <polygon points="17,38 27,33 22,27" fill="currentColor" stroke="none" />

              {/* Collector branch going down-right */}
              <line x1="46" y1="18" x2="59" y2="38" strokeWidth="1.5" />
              <line x1="59" y1="38" x2="76" y2="38" strokeWidth="1.5" />
            </svg>

            <BananaTerminal id="inv_npn1_c" label="C" labelPosition="right" />
          </div>
        </div>

        {/* Resistors 330 Ω (Separated individually, not joined in one box) */}
        <div className="my-2 flex flex-col items-center space-y-3.5 w-full">
          {/* Upper Resistor 330 Ω */}
          <div className="flex items-center justify-between w-full max-w-[195px] px-1">
            <BananaTerminal id="inv_r330_1_l" />
            <div className="flex flex-col items-center flex-1 px-1.5">
              <svg
                viewBox="0 0 54 12"
                className="h-3.5 w-18 text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="0" y1="6" x2="8" y2="6" />
                <path d="M 8 6 L 12 1.5 L 18 10.5 L 24 1.5 L 30 10.5 L 36 1.5 L 42 10.5 L 46 6" />
                <line x1="46" y1="6" x2="54" y2="6" />
              </svg>
              <span className="text-[8px] font-black tracking-tight text-neutral-800 mt-0.5">
                330 Ω
              </span>
            </div>
            <BananaTerminal id="inv_r330_1_r" />
          </div>

          {/* Lower Resistor 330 Ω */}
          <div className="flex items-center justify-between w-full max-w-[195px] px-1">
            <BananaTerminal id="inv_r330_2_l" />
            <div className="flex flex-col items-center flex-1 px-1.5">
              <svg
                viewBox="0 0 54 12"
                className="h-3.5 w-18 text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="0" y1="6" x2="8" y2="6" />
                <path d="M 8 6 L 12 1.5 L 18 10.5 L 24 1.5 L 30 10.5 L 36 1.5 L 42 10.5 L 46 6" />
                <line x1="46" y1="6" x2="54" y2="6" />
              </svg>
              <span className="text-[8px] font-black tracking-tight text-neutral-800 mt-0.5">
                330 Ω
              </span>
            </div>
            <BananaTerminal id="inv_r330_2_r" />
          </div>
        </div>

        {/* NPN 2 (Bottom Transistor of upper box) */}
        <div className="relative my-1 flex flex-col items-center">
          {/* Top Row: E Terminal - SVG Transistor Schematic - C Terminal */}
          <div className="flex items-center justify-center space-x-2 w-full mb-1">
            <BananaTerminal id="inv_npn2_e" label="E" labelPosition="left" />

            {/* Precision NPN Schematic (Horizontal Base Bar at bottom, B on bottom, E left, C right) */}
            <svg
              viewBox="0 0 76 52"
              className="h-11 w-16 text-neutral-900 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Enclosing Transistor Circle */}
              <circle cx="38" cy="25" r="21" strokeWidth="1.4" />

              {/* Emitter branch coming from left E terminal with outward arrow */}
              <line x1="0" y1="14" x2="17" y2="14" strokeWidth="1.5" />
              <line x1="17" y1="14" x2="30" y2="34" strokeWidth="1.5" />
              <polygon points="17,14 22,25 27,20" fill="currentColor" stroke="none" />

              {/* Collector branch coming from right C terminal */}
              <line x1="76" y1="14" x2="59" y2="14" strokeWidth="1.5" />
              <line x1="59" y1="14" x2="46" y2="34" strokeWidth="1.5" />

              {/* Horizontal Base Plate Bar */}
              <line x1="25" y1="34" x2="51" y2="34" strokeWidth="2.6" />

              {/* Base lead from base plate down to bottom B terminal */}
              <line x1="38" y1="34" x2="38" y2="52" strokeWidth="1.5" />
            </svg>

            <BananaTerminal id="inv_npn2_c" label="C" labelPosition="right" />
          </div>

          {/* Bottom Row: Terminal B & NPN Label */}
          <div className="relative w-full flex items-center justify-center">
            <BananaTerminal id="inv_npn2_b" label="B" labelPosition="bottom" />
            <span className="absolute right-0 bottom-0 rounded border border-neutral-700 bg-white/80 px-1.5 py-0.5 text-[8px] font-black tracking-wider text-neutral-800 shadow-xs">
              NPN
            </span>
          </div>
        </div>
      </div>

      {/* 2. LOWER INVERTER (PNP Stage) */}
      <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-2.5 text-neutral-900 shadow-sm">
        {/* Header Title */}
        <div className="text-center pb-1 border-b border-neutral-400/40">
          <h2 className="text-[11px] font-black tracking-widest uppercase text-neutral-900 font-sans">
            INVERTER
          </h2>
        </div>

        {/* Resistors 330 Ω (Separated individually, not joined in one box) */}
        <div className="my-2 flex flex-col items-center space-y-3.5 w-full">
          {/* Upper Resistor 330 Ω */}
          <div className="flex items-center justify-between w-full max-w-[195px] px-1">
            <BananaTerminal id="inv_pnp_r330_1_l" />
            <div className="flex flex-col items-center flex-1 px-1.5">
              <svg
                viewBox="0 0 54 12"
                className="h-3.5 w-18 text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="0" y1="6" x2="8" y2="6" />
                <path d="M 8 6 L 12 1.5 L 18 10.5 L 24 1.5 L 30 10.5 L 36 1.5 L 42 10.5 L 46 6" />
                <line x1="46" y1="6" x2="54" y2="6" />
              </svg>
              <span className="text-[8px] font-black tracking-tight text-neutral-800 mt-0.5">
                330 Ω
              </span>
            </div>
            <BananaTerminal id="inv_pnp_r330_1_r" />
          </div>

          {/* Lower Resistor 330 Ω */}
          <div className="flex items-center justify-between w-full max-w-[195px] px-1">
            <BananaTerminal id="inv_pnp_r330_2_l" />
            <div className="flex flex-col items-center flex-1 px-1.5">
              <svg
                viewBox="0 0 54 12"
                className="h-3.5 w-18 text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="0" y1="6" x2="8" y2="6" />
                <path d="M 8 6 L 12 1.5 L 18 10.5 L 24 1.5 L 30 10.5 L 36 1.5 L 42 10.5 L 46 6" />
                <line x1="46" y1="6" x2="54" y2="6" />
              </svg>
              <span className="text-[8px] font-black tracking-tight text-neutral-800 mt-0.5">
                330 Ω
              </span>
            </div>
            <BananaTerminal id="inv_pnp_r330_2_r" />
          </div>
        </div>

        {/* Bottom: PNP Transistors Pair (Left & Right) */}
        <div className="relative my-1 flex items-center justify-between px-1">
          {/* PNP 1 (Left Transistor: C top, B left, E bottom) */}
          <div className="flex flex-col items-center">
            <BananaTerminal id="inv_pnp1_c" label="C" labelPosition="top" />

            <div className="flex items-center my-0.5">
              <BananaTerminal id="inv_pnp1_b" label="B" labelPosition="left" />

              {/* Left PNP Schematic */}
              <svg
                viewBox="0 0 52 56"
                className="h-10 w-10 text-neutral-900 shrink-0 ml-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Transistor Circle */}
                <circle cx="28" cy="28" r="18" strokeWidth="1.4" />

                {/* Base lead from left terminal B */}
                <line x1="0" y1="28" x2="18" y2="28" strokeWidth="1.5" />

                {/* Vertical Base Plate Bar on left */}
                <line x1="18" y1="16" x2="18" y2="40" strokeWidth="2.5" />

                {/* Collector branch going up to C */}
                <line x1="18" y1="21" x2="33" y2="10" strokeWidth="1.5" />
                <line x1="33" y1="10" x2="33" y2="0" strokeWidth="1.5" />

                {/* Emitter branch going down to E with inward arrow (PNP) */}
                <line x1="18" y1="35" x2="33" y2="46" strokeWidth="1.5" />
                <line x1="33" y1="46" x2="33" y2="56" strokeWidth="1.5" />
                <polygon points="19,36 27,33 25,40" fill="currentColor" stroke="none" />
              </svg>
            </div>

            <BananaTerminal id="inv_pnp1_e" label="E" labelPosition="bottom" />
          </div>

          {/* Centered PNP Badge */}
          <div className="flex flex-col items-center px-1">
            <span className="rounded border border-neutral-700 bg-white/80 px-2 py-0.5 text-[8px] font-black tracking-wider text-neutral-800 shadow-xs">
              PNP
            </span>
          </div>

          {/* PNP 2 (Right Transistor: E top, B right, C bottom) */}
          <div className="flex flex-col items-center">
            <BananaTerminal id="inv_pnp2_e" label="E" labelPosition="top" />

            <div className="flex items-center my-0.5">
              {/* Right PNP Schematic */}
              <svg
                viewBox="0 0 52 56"
                className="h-10 w-10 text-neutral-900 shrink-0 mr-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Transistor Circle */}
                <circle cx="24" cy="28" r="18" strokeWidth="1.4" />

                {/* Vertical Base Plate Bar on right */}
                <line x1="34" y1="16" x2="34" y2="40" strokeWidth="2.5" />

                {/* Base lead going right to terminal B */}
                <line x1="34" y1="28" x2="52" y2="28" strokeWidth="1.5" />

                {/* Emitter branch going up to E with inward arrow (PNP) */}
                <line x1="34" y1="21" x2="19" y2="10" strokeWidth="1.5" />
                <line x1="19" y1="10" x2="19" y2="0" strokeWidth="1.5" />
                <polygon points="33,20 25,23 27,16" fill="currentColor" stroke="none" />

                {/* Collector branch going down to C */}
                <line x1="34" y1="35" x2="19" y2="46" strokeWidth="1.5" />
                <line x1="19" y1="46" x2="19" y2="56" strokeWidth="1.5" />
              </svg>

              <BananaTerminal id="inv_pnp2_b" label="B" labelPosition="right" />
            </div>

            <BananaTerminal id="inv_pnp2_c" label="C" labelPosition="bottom" />
          </div>
        </div>

        {/* Inverter Running Active Indicator */}
        {isRunning && (
          <div className="mt-1.5 flex items-center justify-center space-x-1.5 rounded bg-amber-100 border border-amber-300 py-1 px-2 text-[8px] font-bold text-amber-900 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <span>Osilasi Aktif (50Hz Quasi-Square)</span>
          </div>
        )}
      </div>
    </div>
  );
};
