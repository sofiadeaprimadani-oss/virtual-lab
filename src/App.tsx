/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Wire, WireColor, SimulationState, solveCircuit } from './simulation/circuitLogic';
import { EXPERIMENTS, Experiment } from './simulation/experiments';
import { Toolbar } from './components/Toolbar';
import { TrainerBoard } from './components/TrainerBoard';
import { OscilloscopeModal } from './components/OscilloscopeModal';
import { ExperimentGuideModal } from './components/ExperimentGuideModal';
import { AiTroubleshootModal } from './components/AiTroubleshootModal';
import { sounds } from './simulation/soundEffects';

export default function App() {
  // Initial demo wiring: Experiment 1 (Transformator CT Step-Down to AC Voltmeter)
  const [wires, setWires] = useState<Wire[]>(EXPERIMENTS[0].wires);
  const [mainsPower, setMainsPower] = useState<boolean>(true);
  const [dcSupplyPower, setDcSupplyPower] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<WireColor>('red');
  const [isOscilloscopeOpen, setIsOscilloscopeOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAiTroubleshootOpen, setIsAiTroubleshootOpen] = useState<boolean>(false);

  // Compute live circuit state
  const simulationState: SimulationState = useMemo(() => ({
    mainsPower,
    fuseBlown: false,
    dcSupplyPower,
    wires,
  }), [mainsPower, dcSupplyPower, wires]);

  const simulationResults = useMemo(() => {
    return solveCircuit(simulationState);
  }, [simulationState]);

  // Handle mains audio hum
  useEffect(() => {
    sounds.setMainsHum(mainsPower && simulationResults.isTrafoEnergized);
  }, [mainsPower, simulationResults.isTrafoEnergized]);

  // Handlers
  const handleToggleMains = () => {
    const next = !mainsPower;
    setMainsPower(next);
    sounds.playSwitch(next);
  };

  const handleToggleDcSupply = () => {
    const next = !dcSupplyPower;
    setDcSupplyPower(next);
    sounds.playSwitch(next);
  };

  const handleAddWire = (wire: Wire) => {
    setWires((prev) => [...prev, wire]);
  };

  const handleRemoveWire = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  const handleUndoWire = () => {
    setWires((prev) => prev.slice(0, -1));
    sounds.playUnplug();
  };

  const handleClearWires = () => {
    setWires([]);
    sounds.playUnplug();
  };

  const handleLoadExperiment = (exp: Experiment) => {
    setWires(exp.wires);
    setMainsPower(exp.defaultMains);
    setDcSupplyPower(exp.defaultDcSupply);
    sounds.playPlugIn();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Controls Toolbar */}
      <Toolbar
        activeColor={activeColor}
        onChangeColor={setActiveColor}
        wireCount={wires.length}
        onUndoWire={handleUndoWire}
        onClearWires={handleClearWires}
        onOpenOscilloscope={() => setIsOscilloscopeOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAiTroubleshoot={() => setIsAiTroubleshootOpen(true)}
        mainsPower={mainsPower}
        onToggleMains={handleToggleMains}
        dcSupplyPower={dcSupplyPower}
        onToggleDcSupply={handleToggleDcSupply}
        isTrafoEnergized={simulationResults.isTrafoEnergized}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-x-auto p-2 sm:p-5 flex flex-col items-center justify-center">
        <TrainerBoard
          wires={wires}
          onAddWire={handleAddWire}
          onRemoveWire={handleRemoveWire}
          mainsPower={mainsPower}
          onToggleMains={handleToggleMains}
          dcSupplyPower={dcSupplyPower}
          onToggleDcSupply={handleToggleDcSupply}
          activeColor={activeColor}
          simulationResults={simulationResults}
        />
      </main>

      {/* Virtual Dual-Channel Digital Storage Oscilloscope Modal */}
      <OscilloscopeModal
        isOpen={isOscilloscopeOpen}
        onClose={() => setIsOscilloscopeOpen(false)}
        simulationResults={simulationResults}
      />

      {/* Virtual Lab Experiment Guide Modal */}
      <ExperimentGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onLoadExperiment={handleLoadExperiment}
        currentResults={simulationResults}
      />

      {/* AI Circuit Troubleshooting Modal */}
      <AiTroubleshootModal
        isOpen={isAiTroubleshootOpen}
        onClose={() => setIsAiTroubleshootOpen(false)}
        simulationState={simulationState}
        simulationResults={simulationResults}
      />
    </div>
  );
}
