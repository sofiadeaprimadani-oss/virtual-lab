import React, { useState, useEffect } from 'react';
import { Wire, WireColor } from '../simulation/circuitLogic';
import { TERMINAL_MAP, TerminalDef } from '../simulation/terminals';
import { X } from 'lucide-react';

interface WiringOverlayProps {
  wires: Wire[];
  selectedTerminal: TerminalDef | null;
  cursorPos: { x: number; y: number } | null;
  activeColor: WireColor;
  onRemoveWire: (wireId: string) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const WIRE_HEX_COLORS: Record<WireColor, { stroke: string; shadow: string; plug: string }> = {
  red: { stroke: '#dc2626', shadow: '#7f1d1d', plug: '#b91c1c' },
  black: { stroke: '#1f2937', shadow: '#030712', plug: '#111827' },
  blue: { stroke: '#2563eb', shadow: '#1e3a8a', plug: '#1d4ed8' },
  yellow: { stroke: '#eab308', shadow: '#713f12', plug: '#ca8a04' },
  green: { stroke: '#16a34a', shadow: '#14532d', plug: '#15803d' },
};

export const WiringOverlay: React.FC<WiringOverlayProps> = ({
  wires,
  selectedTerminal,
  cursorPos,
  activeColor,
  onRemoveWire,
  panelRef,
}) => {
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);
  const [, setTick] = useState<number>(0);

  // Force re-render on resize/scroll to update exact wire coordinates
  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, []);

  // Calculate the exact center pixel coordinates of a terminal relative to the panel
  const getCoords = (termId: string) => {
    if (!panelRef.current) return { x: 0, y: 0 };
    const el = panelRef.current.querySelector(`[data-terminal-id="${termId}"]`);
    if (!el) return { x: 0, y: 0 };
    const elRect = el.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    return {
      x: elRect.left + elRect.width / 2 - panelRect.left,
      y: elRect.top + elRect.height / 2 - panelRect.top,
    };
  };

  // Compute curved catenary / bezier path with realistic gravity sag
  const getWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);

    // Natural gravity sag increases with distance
    const sag = Math.min(85, Math.max(16, dist * 0.16 + Math.abs(dx) * 0.08));

    const cp1x = x1 + dx * 0.25;
    const cp1y = y1 + dy * 0.25 + sag;
    const cp2x = x1 + dx * 0.75;
    const cp2y = y1 + dy * 0.75 + sag;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + sag * 0.75;

    return {
      d: `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`,
      midX,
      midY,
    };
  };

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-25"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Render all existing wires */}
      {wires.map((wire) => {
        const from = getCoords(wire.from);
        const to = getCoords(wire.to);
        if (from.x === 0 && from.y === 0 && to.x === 0 && to.y === 0) return null;

        const { d, midX, midY } = getWirePath(from.x, from.y, to.x, to.y);
        const colors = WIRE_HEX_COLORS[wire.color] || WIRE_HEX_COLORS.red;
        const isHovered = hoveredWireId === wire.id;

        return (
          <g key={wire.id} className="group">
            {/* Ambient shadow beneath the wire */}
            <path
              d={d}
              fill="none"
              stroke="rgba(0, 0, 0, 0.4)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#wire-shadow)"
            />

            {/* Main flexible silicone wire body */}
            <path
              d={d}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={isHovered ? 5.5 : 4}
              strokeLinecap="round"
              className="transition-all duration-150"
            />

            {/* Specular highlight */}
            <path
              d={d}
              fill="none"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />

            {/* Banana plug boots */}
            <circle cx={from.x} cy={from.y} r="4.5" fill={colors.plug} stroke="#ffffff" strokeWidth="1" />
            <circle cx={to.x} cy={to.y} r="4.5" fill={colors.plug} stroke="#ffffff" strokeWidth="1" />

            {/* Interactive hit path */}
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth="22"
              className="pointer-events-auto cursor-pointer"
              onMouseEnter={() => setHoveredWireId(wire.id)}
              onMouseLeave={() => setHoveredWireId(null)}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveWire(wire.id);
              }}
            >
              <title>{`Kabel ${wire.color}: ${TERMINAL_MAP[wire.from]?.name ?? wire.from} ↔ ${TERMINAL_MAP[wire.to]?.name ?? wire.to} (Klik untuk mencabut)`}</title>
            </path>

            {/* Disconnect button at wire center on hover */}
            {isHovered && (
              <g
                className="pointer-events-auto cursor-pointer transition-transform hover:scale-125"
                transform={`translate(${midX}, ${midY})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveWire(wire.id);
                }}
              >
                <circle r="11" fill="#ef4444" stroke="#ffffff" strokeWidth="1.8" className="shadow-lg" />
                <foreignObject x="-6" y="-6" width="12" height="12">
                  <X className="h-3 w-3 text-white" />
                </foreignObject>
              </g>
            )}
          </g>
        );
      })}

      {/* Live active wire while dragging */}
      {selectedTerminal && cursorPos && (
        <g>
          {(() => {
            const start = getCoords(selectedTerminal.id);
            const activeColors = WIRE_HEX_COLORS[activeColor];
            const { d } = getWirePath(start.x, start.y, cursorPos.x, cursorPos.y);

            return (
              <>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                <path
                  d={d}
                  fill="none"
                  stroke={activeColors.stroke}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  className="animate-pulse"
                />
                <circle cx={cursorPos.x} cy={cursorPos.y} r="4.5" fill={activeColors.plug} stroke="#fff" strokeWidth="1.2" />
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
};
