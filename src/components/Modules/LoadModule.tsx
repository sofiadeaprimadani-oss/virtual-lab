import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';

interface LoadModuleProps {
  voltage: number;
  brightness: number; // 0.0 to 1.0
  power: number; // Watts
}

export const LoadModule: React.FC<LoadModuleProps> = ({ voltage, brightness, power }) => {
  const isGlowing = brightness > 0.01;

  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-3 text-neutral-900 shadow-sm">
      <ScrewHead className="absolute top-1 left-1" size={10} />
      <ScrewHead className="absolute top-1 right-1" size={10} />
      <ScrewHead className="absolute bottom-1 left-1" size={10} />
      <ScrewHead className="absolute bottom-1 right-1" size={10} />

      <div className="text-center">
        <h2 className="text-[11px] font-black tracking-wider uppercase text-neutral-900">
          LOAD
        </h2>
      </div>

      {/* Realistic Heavy Industrial Lamp Socket & Incandescent Bulb */}
      <div className="relative my-1 flex flex-col items-center justify-center">
        {/* Ambient glow radiating outwards if lamp is on */}
        {isGlowing && (
          <div
            className="pointer-events-none absolute h-28 w-28 rounded-full transition-all duration-300"
            style={{
              background: `radial-gradient(circle, rgba(251,191,36,${brightness * 0.8}) 0%, rgba(245,158,11,${brightness * 0.4}) 45%, rgba(0,0,0,0) 70%)`,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Heavy Black Bakelite Socket Base */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-neutral-950 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
          {/* Inner brass collar */}
          <div className="relative flex h-13 w-13 items-center justify-center rounded-full border border-amber-800/80 bg-gradient-to-tr from-amber-900 via-neutral-800 to-amber-700 shadow-inner">
            {/* Clear glass bulb envelope */}
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-white/40 shadow-inner backdrop-blur-[1px] transition-all duration-300 ${
                isGlowing
                  ? 'bg-gradient-to-t from-amber-100/90 via-amber-300/80 to-yellow-100/90 shadow-[0_0_20px_rgba(251,191,36,0.9)]'
                  : 'bg-neutral-800/60'
              }`}
            >
              {/* Glass surface reflection */}
              <div className="pointer-events-none absolute top-1 left-1.5 h-3 w-4 rounded-full bg-white/40 blur-[1px] rotate-[-25deg]" />

              {/* Filament */}
              <div className="relative flex flex-col items-center justify-center">
                <div className="flex w-5 justify-between">
                  <div className="h-4 w-0.5 bg-neutral-600" />
                  <div className="h-4 w-0.5 bg-neutral-600" />
                </div>
                <div
                  className={`-mt-1 h-2 w-4 rounded-t-full border-t-2 transition-all duration-200 ${
                    isGlowing
                      ? 'border-yellow-100 shadow-[0_0_10px_#fff,0_0_16px_#f59e0b]'
                      : 'border-neutral-500'
                  }`}
                  style={{
                    boxShadow: isGlowing ? `0 0 10px rgba(255,255,255,${brightness}), 0 0 16px rgba(245,158,11,${brightness})` : 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Power / Voltage readout */}
        <div className="mt-1 flex items-center space-x-1 text-[8px] font-bold">
          <span className={isGlowing ? 'text-amber-700 font-extrabold' : 'text-neutral-500'}>
            {isGlowing ? `${voltage.toFixed(1)}V (${power.toFixed(1)}W)` : 'Mati (0V)'}
          </span>
        </div>
      </div>

      {/* Terminal labels with integrated Banana Sockets */}
      <div className="flex justify-around px-2 pt-1">
        <BananaTerminal id="load_lamp_0" label="0" labelPosition="bottom" />
        <BananaTerminal id="load_lamp_220" label="220" labelPosition="bottom" />
      </div>
    </div>
  );
};
