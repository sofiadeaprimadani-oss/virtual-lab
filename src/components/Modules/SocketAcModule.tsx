import React from 'react';
import { ScrewHead } from '../ScrewHead';
import { BananaTerminal } from '../BananaTerminal';
import { Power } from 'lucide-react';

interface SocketAcModuleProps {
  mainsPower: boolean;
  onToggleMains: () => void;
}

export const SocketAcModule: React.FC<SocketAcModuleProps> = ({
  mainsPower,
  onToggleMains,
}) => {
  return (
    <div className="relative flex flex-col justify-between rounded border-2 border-neutral-800 bg-[#f7f5ee] p-3 text-neutral-900 shadow-sm">
      <ScrewHead className="absolute top-1 left-1" size={10} />
      <ScrewHead className="absolute top-1 right-1" size={10} />
      <ScrewHead className="absolute bottom-1 left-1" size={10} />
      <ScrewHead className="absolute bottom-1 right-1" size={10} />

      {/* Module Title */}
      <div className="text-center">
        <h2 className="text-[11px] font-black tracking-wider uppercase text-neutral-900">
          SOCKET AC 220
        </h2>
      </div>

      {/* IEC C14 Inlet Socket & Fuse Representation */}
      <div className="my-1.5 flex items-center justify-center space-x-3">
        {/* IEC C14 Socket */}
        <div className="relative flex h-13 w-15 flex-col items-center justify-center rounded-sm border-2 border-neutral-900 bg-neutral-900 p-1 shadow-inner">
          <div className="flex h-9 w-11 flex-col items-center justify-between rounded-sm bg-neutral-950 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]">
            <div className="flex w-full justify-between px-1">
              <div className="h-3 w-1 rounded-xs bg-neutral-800 border-b border-amber-600/40" />
              <div className="h-3 w-1 rounded-xs bg-neutral-800 border-b border-amber-600/40" />
            </div>
            <div className="h-1 w-3 rounded-xs bg-neutral-800 border-b border-amber-600/40" />
          </div>
        </div>

        {/* Fuse */}
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-6 items-center justify-center rounded-xs border border-neutral-800 bg-neutral-900 shadow-inner">
            <span className="text-[7px] font-black text-neutral-300 -rotate-90">FUSE</span>
          </div>
          <span className="mt-0.5 text-[8px] font-bold text-neutral-700">FUSE</span>
        </div>
      </div>

      {/* Terminals Row with integrated Banana Sockets */}
      <div className="mt-1 flex items-center justify-around px-2">
        <BananaTerminal id="socket_ac_0" label="0" labelPosition="bottom" />
        <BananaTerminal id="socket_ac_220" label="220" labelPosition="bottom" />
      </div>

      {/* Power Plug / Mains Switch Control */}
      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-neutral-300">
        <button
          type="button"
          onClick={onToggleMains}
          className={`flex items-center space-x-1.5 rounded px-2 py-1 text-[10px] font-bold shadow-xs transition-all ${
            mainsPower
              ? 'bg-red-600 text-white shadow-red-500/50 hover:bg-red-700'
              : 'bg-neutral-300 text-neutral-700 hover:bg-neutral-400'
          }`}
        >
          <Power className="h-3 w-3" />
          <span>{mainsPower ? 'AC 220V ON' : 'Colokan AC OFF'}</span>
        </button>

        <div className="flex items-center space-x-1">
          <div
            className={`h-2.5 w-2.5 rounded-full border border-neutral-700 transition-colors ${
              mainsPower
                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]'
                : 'bg-neutral-400'
            }`}
          />
          <span className="text-[9px] font-semibold text-neutral-600">
            {mainsPower ? '220V' : '0V'}
          </span>
        </div>
      </div>
    </div>
  );
};
