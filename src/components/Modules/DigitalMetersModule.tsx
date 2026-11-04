import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { DigitalSevenSegment } from '../DigitalSevenSegment';
import { BananaTerminal } from '../BananaTerminal';

interface DigitalMetersModuleProps {
  dcVoltage: number;
  acVoltage: number;
}

export const DigitalMetersModule: React.FC<DigitalMetersModuleProps> = ({
  dcVoltage,
  acVoltage,
}) => {
  return (
    <div className="flex items-center space-x-2.5 h-full">
      {/* 1. DC VOLT METER */}
      <div className="relative flex flex-1 flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-2 text-neutral-900 shadow-sm h-full">
        <ScrewHead className="absolute top-1 left-1" size={9} />
        <ScrewHead className="absolute top-1 right-1" size={9} />
        <ScrewHead className="absolute bottom-1 left-1" size={9} />
        <ScrewHead className="absolute bottom-1 right-1" size={9} />

        <div className="text-center">
          <h2 className="text-[9px] font-black tracking-wider uppercase text-neutral-900">
            DC VOLT METER
          </h2>
        </div>

        {/* 7-Segment Digital Readout Box */}
        <div className="my-1">
          <DigitalSevenSegment value={dcVoltage} decimals={1} unit="V" />
        </div>

        {/* Terminals: 0 (COM), 220 (V DC) */}
        <div className="flex justify-around px-2 pt-0.5">
          <BananaTerminal id="dc_volt_0" label="0" labelPosition="bottom" />
          <BananaTerminal id="dc_volt_pos" label="220" labelPosition="bottom" />
        </div>
      </div>

      {/* 2. AC VOLT METER */}
      <div className="relative flex flex-1 flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-2 text-neutral-900 shadow-sm h-full">
        <ScrewHead className="absolute top-1 left-1" size={9} />
        <ScrewHead className="absolute top-1 right-1" size={9} />
        <ScrewHead className="absolute bottom-1 left-1" size={9} />
        <ScrewHead className="absolute bottom-1 right-1" size={9} />

        <div className="text-center">
          <h2 className="text-[9px] font-black tracking-wider uppercase text-neutral-900">
            AC VOLT METER
          </h2>
        </div>

        {/* 7-Segment Digital Readout Box */}
        <div className="my-1">
          <DigitalSevenSegment value={acVoltage} decimals={1} unit="V" />
        </div>

        {/* Terminals: 0 (COM), 220 (V AC) */}
        <div className="flex justify-around px-2 pt-0.5">
          <BananaTerminal id="ac_volt_0" label="0" labelPosition="bottom" />
          <BananaTerminal id="ac_volt_pos" label="220" labelPosition="bottom" />
        </div>
      </div>
    </div>
  );
};
