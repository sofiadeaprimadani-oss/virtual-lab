import React from 'react';

interface DigitalSevenSegmentProps {
  value: number;
  label?: string;
  decimals?: number;
  unit?: string;
  isActive?: boolean;
}

export const DigitalSevenSegment: React.FC<DigitalSevenSegmentProps> = ({
  value,
  decimals = 1,
  isActive = true,
}) => {
  // Format formatted string
  let displayStr = '0.0';
  if (isActive) {
    displayStr = value.toFixed(decimals);
    // Pad to 4-5 chars if needed
    if (displayStr.length < 4) {
      displayStr = displayStr.padStart(4, ' ');
    }
  } else {
    displayStr = '---';
  }

  return (
    <div className="relative flex items-center justify-center rounded-sm border-2 border-neutral-900 bg-neutral-950 p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
      {/* Acrylic filter glare reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />

      {/* 7-segment LED readout */}
      <div className="flex items-baseline space-x-1 font-mono tracking-widest select-none">
        {/* Inactive ghost background 8.8.8 */}
        <div
          className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-black tracking-widest text-red-950/20 select-none pointer-events-none"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          888.8
        </div>

        {/* Lit active segments */}
        <span
          className={`relative z-10 text-2xl font-black tracking-widest transition-colors duration-150 ${
            isActive
              ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]'
              : 'text-red-950/30'
          }`}
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {displayStr}
        </span>
      </div>
    </div>
  );
};
