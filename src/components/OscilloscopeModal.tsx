import React, { useEffect, useRef, useState } from 'react';
import { SimulationResults, getInstantaneousVoltage } from '../simulation/circuitLogic';
import { TERMINALS } from '../simulation/terminals';
import { Activity, X, Play, Square, Sparkles } from 'lucide-react';

interface OscilloscopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationResults: SimulationResults;
}

export const OscilloscopeModal: React.FC<OscilloscopeModalProps> = ({
  isOpen,
  onClose,
  simulationResults,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Oscilloscope controls state
  const [ch1Terminal, setCh1Terminal] = useState<string>('trafo_sec_15_l');
  const [ch2Terminal, setCh2Terminal] = useState<string>('bridge_plus');
  const [isCh2Enabled, setIsCh2Enabled] = useState<boolean>(true);
  const [timeDivMs, setTimeDivMs] = useState<number>(5); // 5ms per div (4 divs = 20ms = 1 full 50Hz cycle)
  const [voltDiv1, setVoltDiv1] = useState<number>(10); // 10V per div
  const [voltDiv2, setVoltDiv2] = useState<number>(10); // 10V per div
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Animation frame loop
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear CRT background with deep oscilloscope dark green phosphor
      ctx.fillStyle = '#06130b';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Oscilloscope Reticle Grid (10 horizontal divs, 8 vertical divs)
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#12391e';
      const numDivsX = 10;
      const numDivsY = 8;
      const dx = w / numDivsX;
      const dy = h / numDivsY;

      ctx.beginPath();
      for (let x = 0; x <= w; x += dx) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += dy) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Center crosshairs with subdivision tick marks
      ctx.strokeStyle = '#1d5e32';
      ctx.beginPath();
      // Center vertical
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      // Center horizontal
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Draw subdivisions on axes
      const centerY = h / 2;
      const centerX = w / 2;
      ctx.strokeStyle = '#277840';
      ctx.beginPath();
      for (let x = 0; x <= w; x += dx / 5) {
        ctx.moveTo(x, centerY - 3);
        ctx.lineTo(x, centerY + 3);
      }
      for (let y = 0; y <= h; y += dy / 5) {
        ctx.moveTo(centerX - 3, y);
        ctx.lineTo(centerX + 3, y);
      }
      ctx.stroke();

      const elapsed = isRunning ? (now - startTime) : 0;
      const totalTimeSpanMs = timeDivMs * numDivsX;

      // Function to render a channel trace
      const drawChannel = (termId: string, color: string, voltDiv: number) => {
        const points: { x: number; y: number }[] = [];
        const stepPx = 1.5;

        for (let x = 0; x <= w; x += stepPx) {
          const tMs = elapsed + (x / w) * totalTimeSpanMs;
          const v = getInstantaneousVoltage(termId, tMs, simulationResults);
          // 1 div = voltDiv volts -> pixel offset = (v / voltDiv) * dy
          const y = centerY - (v / voltDiv) * dy;
          points.push({ x, y });
        }

        if (points.length < 2) return;

        // Phosphor outer glow pass
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Core bright line pass
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      };

      // Draw CH1 (Bright Gold/Yellow)
      if (ch1Terminal) {
        drawChannel(ch1Terminal, '#facc15', voltDiv1);
      }

      // Draw CH2 (Bright Cyan)
      if (isCh2Enabled && ch2Terminal) {
        drawChannel(ch2Terminal, '#38bdf8', voltDiv2);
      }

      if (isRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, ch1Terminal, ch2Terminal, isCh2Enabled, timeDivMs, voltDiv1, voltDiv2, isRunning, simulationResults]);

  if (!isOpen) return null;

  // Selected probe potentials for automated measurements
  const pot1 = simulationResults.nodePotentials[ch1Terminal];
  const pot2 = simulationResults.nodePotentials[ch2Terminal];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="oscilloscope-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
    >
      <div className="relative flex w-full max-w-4xl flex-col rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden">
        {/* DSO Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 py-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 id="oscilloscope-title" className="text-sm font-black tracking-wide text-neutral-100">
                Digital Storage Oscilloscope (DSO 50MHz Dual-Channel)
              </h2>
              <p className="text-[11px] text-neutral-400">
                Analisis Bentuk Gelombang Real-Time Laboratorium
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-1.5 rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                isRunning
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-600/60 hover:bg-amber-600/50'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isRunning ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{isRunning ? 'HOLD (Stop)' : 'RUN (Start)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Osiloskop"
              className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Oscilloscope Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 bg-neutral-900">
          {/* Left 2 Cols: CRT Display Screen */}
          <div className="lg:col-span-2 flex flex-col space-y-2">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg border-2 border-neutral-700 bg-neutral-950 shadow-inner">
              <canvas
                ref={canvasRef}
                width={600}
                height={450}
                className="h-full w-full object-contain"
              />
              {/* Screen Bezel HUD labels */}
              <div className="pointer-events-none absolute top-2 left-3 flex items-center space-x-4 text-[11px] font-mono font-bold">
                <span className="text-yellow-400">CH1: {voltDiv1}V/div</span>
                {isCh2Enabled && <span className="text-sky-400">CH2: {voltDiv2}V/div</span>}
                <span className="text-emerald-400">TIME: {timeDivMs}ms/div</span>
              </div>
            </div>

            {/* Quick Auto Measurements Box */}
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-xs font-mono">
              <div className="space-y-1 border-r border-neutral-800 pr-2">
                <span className="text-[10px] font-bold text-yellow-400 uppercase">CH1 Measurements:</span>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Vpp:</span>
                  <span className="font-bold text-neutral-100">{pot1 ? (pot1.peakVoltage * 2).toFixed(1) : '0.0'} V</span>
                </div>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Vrms:</span>
                  <span className="font-bold text-neutral-100">{pot1 ? pot1.acRmsVoltage.toFixed(1) : '0.0'} V</span>
                </div>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Freq:</span>
                  <span className="font-bold text-neutral-100">{pot1 && pot1.frequency > 0 ? `${pot1.frequency} Hz` : '0 Hz'}</span>
                </div>
              </div>

              <div className="space-y-1 pl-2">
                <span className="text-[10px] font-bold text-sky-400 uppercase">CH2 Measurements:</span>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Vpp:</span>
                  <span className="font-bold text-neutral-100">{pot2 ? (pot2.peakVoltage * 2).toFixed(1) : '0.0'} V</span>
                </div>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Vdc:</span>
                  <span className="font-bold text-neutral-100">{pot2 ? pot2.dcVoltage.toFixed(1) : '0.0'} V</span>
                </div>
                <div className="flex justify-between text-neutral-300 text-[11px]">
                  <span>Ripple:</span>
                  <span className="font-bold text-neutral-100">{pot2 ? `${pot2.rippleVoltage.toFixed(2)} V` : '0.0 V'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Control Knobs & Probes Selection */}
          <div className="flex flex-col space-y-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Titik Probe &amp; Skala</span>
            </div>

            {/* CH1 Probe Setup */}
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/10 p-3 space-y-2">
              <label htmlFor="ch1-terminal-select" className="block text-[11px] font-bold text-yellow-400">
                PROBE CH1 (Kuning)
              </label>
              <select
                id="ch1-terminal-select"
                value={ch1Terminal}
                onChange={(e) => setCh1Terminal(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-yellow-400"
              >
                {TERMINALS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.module.toUpperCase()}: {t.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-neutral-400">Volt/Div CH1:</span>
                <select
                  value={voltDiv1}
                  onChange={(e) => setVoltDiv1(Number(e.target.value))}
                  aria-label="Skala Volt per Divisi CH1"
                  className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-yellow-300"
                >
                  <option value={2}>2 V / Div</option>
                  <option value={5}>5 V / Div</option>
                  <option value={10}>10 V / Div</option>
                  <option value={20}>20 V / Div</option>
                  <option value={50}>50 V / Div</option>
                </select>
              </div>
            </div>

            {/* CH2 Probe Setup */}
            <div className="rounded-lg border border-sky-500/30 bg-sky-950/10 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="ch2-terminal-select" className="text-[11px] font-bold text-sky-400">
                  PROBE CH2 (Biru Muda)
                </label>
                <button
                  type="button"
                  onClick={() => setIsCh2Enabled(!isCh2Enabled)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isCh2Enabled ? 'bg-sky-600 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {isCh2Enabled ? 'AKTIF' : 'NONAKTIF'}
                </button>
              </div>

              {isCh2Enabled && (
                <>
                  <select
                    id="ch2-terminal-select"
                    value={ch2Terminal}
                    onChange={(e) => setCh2Terminal(e.target.value)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-sky-400"
                  >
                    {TERMINALS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.module.toUpperCase()}: {t.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400">Volt/Div CH2:</span>
                    <select
                      value={voltDiv2}
                      onChange={(e) => setVoltDiv2(Number(e.target.value))}
                      aria-label="Skala Volt per Divisi CH2"
                      className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-sky-300"
                    >
                      <option value={2}>2 V / Div</option>
                      <option value={5}>5 V / Div</option>
                      <option value={10}>10 V / Div</option>
                      <option value={20}>20 V / Div</option>
                      <option value={50}>50 V / Div</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Horizontal Timebase Setting */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 space-y-2">
              <span className="block text-[11px] font-bold text-emerald-400">
                HORIZONTAL TIMEBASE (Waktu)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">Time/Div:</span>
                <select
                  value={timeDivMs}
                  onChange={(e) => setTimeDivMs(Number(e.target.value))}
                  aria-label="Skala Waktu per Divisi"
                  className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-emerald-300"
                >
                  <option value={1}>1 ms / Div (Cepat)</option>
                  <option value={2}>2 ms / Div</option>
                  <option value={5}>5 ms / Div (Standar 50Hz)</option>
                  <option value={10}>10 ms / Div</option>
                  <option value={20}>20 ms / Div (Lambat)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
