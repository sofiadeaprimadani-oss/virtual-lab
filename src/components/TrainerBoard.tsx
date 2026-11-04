import React, { useRef, useState, useMemo } from 'react';
import { TerminalDef } from '../simulation/terminals';
import { SimulationResults, Wire, WireColor } from '../simulation/circuitLogic';
import { BoardHeader } from './BoardHeader';
import { ScrewHead } from './ScrewHead';
import { SocketAcModule } from './Modules/SocketAcModule';
import { TransformerModule } from './Modules/TransformerModule';
import { RectifierFullModule } from './Modules/RectifierFullModule';
import { RectifierHalfModule } from './Modules/RectifierHalfModule';
import { InverterModule } from './Modules/InverterModule';
import { LoadModule } from './Modules/LoadModule';
import { PowerSupplyDcModule } from './Modules/PowerSupplyDcModule';
import { DigitalMetersModule } from './Modules/DigitalMetersModule';
import { WiringOverlay } from './WiringOverlay';
import { TerminalContext } from './TerminalContext';
import { sounds } from '../simulation/soundEffects';

interface TrainerBoardProps {
  wires: Wire[];
  onAddWire: (wire: Wire) => void;
  onRemoveWire: (wireId: string) => void;
  mainsPower: boolean;
  onToggleMains: () => void;
  dcSupplyPower: boolean;
  onToggleDcSupply: () => void;
  activeColor: WireColor;
  simulationResults: SimulationResults;
}

export const TrainerBoard: React.FC<TrainerBoardProps> = ({
  wires,
  onAddWire,
  onRemoveWire,
  mainsPower,
  onToggleMains,
  dcSupplyPower,
  onToggleDcSupply,
  activeColor,
  simulationResults,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<TerminalDef | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Update cursor position relative to panel for live wire dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current || !selectedTerminal) return;
    const rect = panelRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTerminalClick = (terminal: TerminalDef) => {
    if (!selectedTerminal) {
      setSelectedTerminal(terminal);
      sounds.playPlugIn();
    } else {
      if (selectedTerminal.id === terminal.id) {
        setSelectedTerminal(null);
        setCursorPos(null);
      } else {
        const alreadyExists = wires.some(
          (w) =>
            (w.from === selectedTerminal.id && w.to === terminal.id) ||
            (w.from === terminal.id && w.to === selectedTerminal.id)
        );

        if (!alreadyExists) {
          const newWire: Wire = {
            id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            from: selectedTerminal.id,
            to: terminal.id,
            color: activeColor,
          };
          onAddWire(newWire);
          sounds.playPlugIn();
        }

        setSelectedTerminal(null);
        setCursorPos(null);
      }
    }
  };

  // Count connected wires per terminal
  const terminalWireCount: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of wires) {
      counts[w.from] = (counts[w.from] || 0) + 1;
      counts[w.to] = (counts[w.to] || 0) + 1;
    }
    return counts;
  }, [wires]);

  const contextValue = useMemo(() => ({
    terminalWireCount,
    selectedTerminalId: selectedTerminal?.id || null,
    onTerminalClick: handleTerminalClick,
  }), [terminalWireCount, selectedTerminal]);

  return (
    <TerminalContext.Provider value={contextValue}>
      <div className="relative mx-auto w-full max-w-6xl p-2 select-none">
        {/* Heavy Industrial Aluminium Lab Trainer Flightcase / Bezel */}
        <div className="relative rounded-2xl border-4 border-neutral-700 bg-neutral-800 p-2 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Frame Screws */}
          <ScrewHead className="absolute top-2 left-2" size={13} />
          <ScrewHead className="absolute top-2 right-2" size={13} />
          <ScrewHead className="absolute bottom-2 left-2" size={13} />
          <ScrewHead className="absolute bottom-2 right-2" size={13} />

          {/* Physical Trainer Front Panel */}
          <div
            ref={panelRef}
            onMouseMove={handleMouseMove}
            onClick={() => {
              if (selectedTerminal) {
                setSelectedTerminal(null);
                setCursorPos(null);
              }
            }}
            className="relative w-full overflow-hidden rounded-lg border-2 border-neutral-900 bg-[#f4f2ea] shadow-inner"
            style={{
              backgroundImage: `radial-gradient(#e5e1d5 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          >
            {/* 1. Academic Header */}
            <BoardHeader />

            {/* 2. Main Module Grid Layout */}
            <div className="grid grid-cols-12 gap-2.5 p-3 sm:p-4">
              {/* Left Column (3 cols): Socket AC, Transformer, Load */}
              <div className="col-span-3 flex flex-col space-y-2.5">
                <SocketAcModule
                  mainsPower={mainsPower}
                  onToggleMains={onToggleMains}
                />
                <TransformerModule
                  isEnergized={simulationResults.isTrafoEnergized}
                />
                <LoadModule
                  voltage={simulationResults.lampVoltage}
                  brightness={simulationResults.lampBrightness}
                  power={simulationResults.lampPower}
                />
              </div>

              {/* Center Column (6 cols): Rectifiers & Meters */}
              <div className="col-span-6 flex flex-col space-y-2.5">
                <RectifierFullModule
                  isRectifying={simulationResults.isBridgeRectifying}
                />
                <RectifierHalfModule
                  isRectifying={simulationResults.isHalfWaveRectifying}
                />

                {/* Bottom Row of Center: Power Supply DC & Digital Voltmeters */}
                <div className="grid grid-cols-5 gap-2.5">
                  <div className="col-span-2">
                    <PowerSupplyDcModule
                      isOn={dcSupplyPower}
                      onToggle={onToggleDcSupply}
                    />
                  </div>
                  <div className="col-span-3">
                    <DigitalMetersModule
                      dcVoltage={simulationResults.dcMeterReading}
                      acVoltage={simulationResults.acMeterReading}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (3 cols): Inverters (NPN & PNP) */}
              <div className="col-span-3 flex flex-col h-full">
                <InverterModule isRunning={simulationResults.isInverterRunning} />
              </div>
            </div>

            {/* 3. Patch Cables Curved SVG Overlay */}
            <WiringOverlay
              wires={wires}
              selectedTerminal={selectedTerminal}
              cursorPos={cursorPos}
              activeColor={activeColor}
              onRemoveWire={(id) => {
                onRemoveWire(id);
                sounds.playUnplug();
              }}
              panelRef={panelRef}
            />
          </div>
        </div>

        {/* Instructional Helper & Live Wire Count Status */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {selectedTerminal
                ? `Hubungkan terminal ke: ${selectedTerminal.name} (klik terminal tujuan)...`
                : 'Klik soket banana (merah/hitam) untuk memasang kabel patch jumper.'}
            </span>
          </div>
          <div>
            <span>Total Kabel Terpasang: <strong className="text-white">{wires.length}</strong></span>
          </div>
        </div>
      </div>
    </TerminalContext.Provider>
  );
};
