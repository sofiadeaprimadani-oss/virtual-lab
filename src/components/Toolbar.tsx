import React from 'react';
import { WireColor } from '../simulation/circuitLogic';
import {
  RotateCcw,
  Trash2,
  Activity,
  BookOpen,
  Power,
  Zap,
  Bot,
} from 'lucide-react';

interface ToolbarProps {
  activeColor: WireColor;
  onChangeColor: (color: WireColor) => void;
  wireCount: number;
  onUndoWire: () => void;
  onClearWires: () => void;
  onOpenOscilloscope: () => void;
  onOpenGuide: () => void;
  onOpenAiTroubleshoot: () => void;
  mainsPower: boolean;
  onToggleMains: () => void;
  dcSupplyPower: boolean;
  onToggleDcSupply: () => void;
  isTrafoEnergized: boolean;
}

const COLOR_OPTIONS: { color: WireColor; label: string; bgClass: string; borderClass: string }[] = [
  { color: 'red', label: 'Merah (+ / Fasa)', bgClass: 'bg-red-600', borderClass: 'border-red-400' },
  { color: 'black', label: 'Hitam (- / Netral)', bgClass: 'bg-neutral-900', borderClass: 'border-neutral-500' },
  { color: 'blue', label: 'Biru (AC / CT)', bgClass: 'bg-blue-600', borderClass: 'border-blue-400' },
  { color: 'yellow', label: 'Kuning (Tap / Sinyal)', bgClass: 'bg-amber-400', borderClass: 'border-amber-300' },
  { color: 'green', label: 'Hijau (Ground / Filter)', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-400' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeColor,
  onChangeColor,
  wireCount,
  onUndoWire,
  onClearWires,
  onOpenOscilloscope,
  onOpenGuide,
  onOpenAiTroubleshoot,
  mainsPower,
  onToggleMains,
  dcSupplyPower,
  onToggleDcSupply,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-200 select-none shadow-md">
      {/* 1. Wire Color Picker */}
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Warna Kabel:
        </span>
        <div className="flex items-center space-x-1.5">
          {COLOR_OPTIONS.map((c) => {
            const isSelected = activeColor === c.color;
            return (
              <button
                key={c.color}
                type="button"
                onClick={() => onChangeColor(c.color)}
                title={`Kabel ${c.label}`}
                aria-label={`Pilih warna kabel ${c.label}`}
                className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                  c.bgClass
                } ${
                  isSelected
                    ? `${c.borderClass} ring-2 ring-white scale-110 shadow-md`
                    : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                }`}
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Power Switches Quick Controls */}
      <div className="flex items-center space-x-2">
        {/* AC 220V Mains Toggle */}
        <button
          type="button"
          onClick={onToggleMains}
          className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition-all shadow-xs ${
            mainsPower
              ? 'bg-red-600 text-white shadow-red-600/40 hover:bg-red-500'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Power className="h-3.5 w-3.5" />
          <span>AC 220V: {mainsPower ? 'ON' : 'OFF'}</span>
        </button>

        {/* DC 12V Supply Toggle */}
        <button
          type="button"
          onClick={onToggleDcSupply}
          className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition-all shadow-xs ${
            dcSupplyPower
              ? 'bg-emerald-600 text-white shadow-emerald-600/40 hover:bg-emerald-500'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>DC 12V: {dcSupplyPower ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* 3. Wire Actions & Modals */}
      <div className="flex items-center space-x-2">
        {/* Undo Wire */}
        <button
          type="button"
          onClick={onUndoWire}
          disabled={wireCount === 0}
          title="Cabut kabel yang terakhir dipasang"
          className="flex items-center space-x-1 rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cabut Terakhir</span>
        </button>

        {/* Clear All Wires */}
        <button
          type="button"
          onClick={onClearWires}
          disabled={wireCount === 0}
          title="Cabut semua kabel pada papan trainer"
          className="flex items-center space-x-1 rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-red-400 hover:bg-neutral-700 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset Kabel ({wireCount})</span>
        </button>

        <div className="h-4 w-px bg-neutral-700 mx-1" />

        {/* AI Troubleshoot Button */}
        <button
          type="button"
          onClick={onOpenAiTroubleshoot}
          className="flex items-center space-x-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-black text-neutral-950 shadow-sm hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer"
        >
          <Bot className="h-3.5 w-3.5" />
          <span>AI Troubleshoot</span>
        </button>

        {/* Open Oscilloscope */}
        <button
          type="button"
          onClick={onOpenOscilloscope}
          className="flex items-center space-x-1.5 rounded-md bg-amber-600/30 border border-amber-500/50 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-600/50 transition-colors"
        >
          <Activity className="h-3.5 w-3.5 text-amber-400" />
          <span>Osiloskop</span>
        </button>

        {/* Open Practical Lab Guide */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="flex items-center space-x-1.5 rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Panduan Praktikum</span>
        </button>
      </div>
    </div>
  );
};
