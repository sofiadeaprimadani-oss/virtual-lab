import React from 'react';
import { TERMINAL_MAP, TerminalDef } from '../simulation/terminals';
import { useTerminalContext } from './TerminalContext';

interface BananaTerminalProps {
  id: string;
  className?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const BananaTerminal: React.FC<BananaTerminalProps> = ({
  id,
  className = '',
  label,
  labelPosition = 'bottom',
}) => {
  const terminal = TERMINAL_MAP[id];
  const context = useTerminalContext();

  if (!terminal) return null;

  const isRed = terminal.color === 'red';
  const connectedCount = context.terminalWireCount[id] || 0;
  const isSelected = context.selectedTerminalId === id;
  const isTargetable = context.selectedTerminalId !== null && context.selectedTerminalId !== id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.onTerminalClick(terminal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      context.onTerminalClick(terminal);
    }
  };

  const jackElement = (
    <div
      data-terminal-id={terminal.id}
      role="button"
      tabIndex={0}
      aria-label={`Terminal ${terminal.name} (${terminal.color})`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative inline-flex items-center justify-center cursor-pointer select-none rounded-full transition-transform active:scale-90 ${
        isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
      } ${className}`}
    >
      {isSelected && (
        <div className="absolute -inset-2 animate-ping rounded-full bg-amber-400 opacity-75" />
      )}
      {isTargetable && !isSelected && (
        <div className="absolute -inset-1.5 animate-pulse rounded-full bg-cyan-400/60 ring-2 ring-cyan-300" />
      )}

      {/* Realistic banana jack socket */}
      <div
        className={`relative flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] ${
          isRed
            ? 'bg-gradient-to-b from-red-500 via-red-600 to-red-800'
            : 'bg-gradient-to-b from-neutral-800 via-neutral-900 to-black'
        } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
      >
        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-neutral-400/80 bg-gradient-to-tr from-neutral-400 via-neutral-200 to-neutral-400 shadow-inner">
          <div className="h-2 w-2 rounded-full bg-neutral-950 shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)] ring-1 ring-neutral-700">
            {connectedCount > 0 && (
              <div
                className={`h-full w-full rounded-full transition-colors ${
                  isRed ? 'bg-red-500/80' : 'bg-neutral-600/80'
                }`}
              />
            )}
          </div>
        </div>

        {connectedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-amber-500 px-0.5 text-[8px] font-bold text-neutral-950 shadow">
            {connectedCount}
          </span>
        )}
      </div>

      {/* Floating tooltip */}
      <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900/95 px-1.5 py-0.5 text-[9px] font-mono font-medium text-neutral-100 opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100 z-40">
        {terminal.name}
      </div>
    </div>
  );

  if (!label) return jackElement;

  return (
    <div className={`flex items-center ${
      labelPosition === 'top' ? 'flex-col-reverse' :
      labelPosition === 'bottom' ? 'flex-col' :
      labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'
    } gap-1`}>
      {jackElement}
      <span className="text-[9px] font-bold text-neutral-800 select-none">{label}</span>
    </div>
  );
};
