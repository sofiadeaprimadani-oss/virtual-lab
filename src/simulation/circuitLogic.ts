/**
 * Circuit Simulation Logic for Trainer Inverter & Rectifier.
 * Pure logic module decoupled from UI for deterministic testing and high performance.
 */

export type WireColor = 'red' | 'black' | 'blue' | 'yellow' | 'green';

export interface Wire {
  id: string;
  from: string;
  to: string;
  color: WireColor;
}

export interface SimulationState {
  mainsPower: boolean; // AC 220V socket switch
  fuseBlown: boolean;
  dcSupplyPower: boolean; // 12V DC power supply switch
  wires: Wire[];
}

export interface WaveformPoint {
  timeMs: number;
  voltage: number;
}

export interface NodePotential {
  dcVoltage: number; // Volts DC
  acRmsVoltage: number; // Volts AC RMS
  frequency: number; // Hz (0 for DC, 50 for AC, 100 for rectified full-wave)
  waveformType: 'flat_dc' | 'ac_sine' | 'half_wave' | 'full_wave' | 'filtered_dc' | 'inverter_ac' | 'zero';
  peakVoltage: number;
  rippleVoltage: number;
}

export interface SimulationResults {
  dcMeterReading: number; // Volts
  acMeterReading: number; // Volts
  lampVoltage: number; // Volts
  lampPower: number; // Watts
  lampBrightness: number; // 0.0 to 1.0
  isTrafoEnergized: boolean;
  isBridgeRectifying: boolean;
  isHalfWaveRectifying: boolean;
  isInverterRunning: boolean;
  activeNetsCount: number;
  // Node potential map for oscilloscope probing
  nodePotentials: Record<string, NodePotential>;
}

// Disjoint Set Union (Union-Find) to group connected terminals into electrical nets
export class Netlist {
  private parent: Record<string, string> = {};

  find(id: string): string {
    if (!this.parent[id]) {
      this.parent[id] = id;
      return id;
    }
    if (this.parent[id] !== id) {
      this.parent[id] = this.find(this.parent[id]);
    }
    return this.parent[id];
  }

  union(idA: string, idB: string): void {
    const rootA = this.find(idA);
    const rootB = this.find(idB);
    if (rootA !== rootB) {
      this.parent[rootA] = rootB;
    }
  }

  areConnected(idA: string, idB: string): boolean {
    return this.find(idA) === this.find(idB);
  }

  getNets(): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    for (const id of Object.keys(this.parent)) {
      const root = this.find(id);
      if (!groups[root]) groups[root] = [];
      groups[root].push(id);
    }
    return groups;
  }
}

export const INDUCTOR_COIL_PINS: [string, string][] = [
  ['rect_full_l004_1', 'rect_full_l004_2'],
  ['rect_full_l02_1', 'rect_full_l02_2'],
  ['rect_half_l004_1', 'rect_half_l004_2'],
  ['rect_half_l02_1', 'rect_half_l02_2'],
];

/**
 * Builds netlist from wire connections and internal copper coil continuity
 */
export function buildNetlist(wires: Wire[]): Netlist {
  const netlist = new Netlist();
  // Internal copper winding continuity of passive inductors (conducts DC through coil)
  for (const [p1, p2] of INDUCTOR_COIL_PINS) {
    netlist.union(p1, p2);
  }
  for (const wire of wires) {
    netlist.union(wire.from, wire.to);
  }
  return netlist;
}

/**
 * Solves the circuit for the current state and returns meter readings,
 * lamp status, and waveform parameters for any node.
 */
export function solveCircuit(state: SimulationState): SimulationResults {
  const net = buildNetlist(state.wires);
  const potentials: Record<string, NodePotential> = {};

  const zeroPotential: NodePotential = {
    dcVoltage: 0,
    acRmsVoltage: 0,
    frequency: 0,
    waveformType: 'zero',
    peakVoltage: 0,
    rippleVoltage: 0,
  };

  const defaultResult: SimulationResults = {
    dcMeterReading: 0,
    acMeterReading: 0,
    lampVoltage: 0,
    lampPower: 0,
    lampBrightness: 0,
    isTrafoEnergized: false,
    isBridgeRectifying: false,
    isHalfWaveRectifying: false,
    isInverterRunning: false,
    activeNetsCount: Object.keys(net.getNets()).length,
    nodePotentials: potentials,
  };

  // 1. Socket AC 220V
  const mainsActive = state.mainsPower && !state.fuseBlown;
  if (mainsActive) {
    potentials['socket_ac_0'] = { ...zeroPotential };
    potentials['socket_ac_220'] = {
      dcVoltage: 0,
      acRmsVoltage: 220,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 220 * Math.SQRT2,
      rippleVoltage: 0,
    };
  }

  // 2. Inverter Evaluation (Push-Pull NPN & PNP topologies driving Trafo CT in step-up mode)
  let isInverterRunning = false;
  let isInverterNpnActive = false;
  let isInverterPnpActive = false;

  const dc12PosNet = net.find('ps_dc12_pos');
  const dc12NegNet = net.find('ps_dc12_neg');

  if (state.dcSupplyPower) {
    // A. Topologi Inverter NPN Push-Pull (Jobsheet 3):
    // CT Trafo -> (+) 12V DC
    // Emitor NPN 1 & NPN 2 -> (-) 12V DC
    // Kolektor NPN 1 -> 12V Trafo (L), Kolektor NPN 2 -> 12V Trafo (R)
    // Basis NPN 1 & 2 terbias pemicu melalui Resistor 330 Ω (cross-coupled)
    const npnCtConnected = net.find('trafo_ct') === dc12PosNet;
    const npnEmittersGrounded = 
      net.find('inv_npn1_e') === dc12NegNet && net.find('inv_npn2_e') === dc12NegNet;
    const npn1ColTap = net.find('inv_npn1_c');
    const npn2ColTap = net.find('inv_npn2_c');
    const trafo12L = net.find('trafo_sec_12_l');
    const trafo12R = net.find('trafo_sec_12_r');

    const npnCollectorsWired = 
      (npn1ColTap === trafo12L && npn2ColTap === trafo12R) ||
      (npn1ColTap === trafo12R && npn2ColTap === trafo12L);

    // Bias / triggering through 330 Ω resistors
    const npnBase1Biased = 
      net.areConnected('inv_npn1_b', 'inv_r330_1_r') || net.areConnected('inv_npn1_b', 'inv_r330_2_r') ||
      net.areConnected('inv_npn1_b', 'inv_r330_1_l') || net.areConnected('inv_npn1_b', 'inv_r330_2_l') ||
      net.areConnected('inv_npn1_b', 'inv_npn2_c') || net.areConnected('inv_npn1_b', 'ps_dc12_pos');

    const npnBase2Biased = 
      net.areConnected('inv_npn2_b', 'inv_r330_1_r') || net.areConnected('inv_npn2_b', 'inv_r330_2_r') ||
      net.areConnected('inv_npn2_b', 'inv_r330_1_l') || net.areConnected('inv_npn2_b', 'inv_r330_2_l') ||
      net.areConnected('inv_npn2_b', 'inv_npn1_c') || net.areConnected('inv_npn2_b', 'ps_dc12_pos');

    if (npnCtConnected && npnEmittersGrounded && npnCollectorsWired && npnBase1Biased && npnBase2Biased) {
      isInverterRunning = true;
      isInverterNpnActive = true;
    }

    // B. Topologi Inverter PNP Push-Pull (Jobsheet 4):
    // Emitor PNP 1 & PNP 2 -> (+) 12V DC
    // CT Trafo -> (-) 12V DC
    // Kolektor PNP 1 -> 12V Trafo (L), Kolektor PNP 2 -> 12V Trafo (R)
    // Basis PNP 1 & 2 terbias pemicu melalui Resistor 330 Ω (cross-coupled)
    const pnpCtGrounded = net.find('trafo_ct') === dc12NegNet;
    const pnpEmittersPos = 
      net.find('inv_pnp1_e') === dc12PosNet && net.find('inv_pnp2_e') === dc12PosNet;
    const pnp1ColTap = net.find('inv_pnp1_c');
    const pnp2ColTap = net.find('inv_pnp2_c');

    const pnpCollectorsWired = 
      (pnp1ColTap === trafo12L && pnp2ColTap === trafo12R) ||
      (pnp1ColTap === trafo12R && pnp2ColTap === trafo12L);

    const pnpBase1Biased = 
      net.areConnected('inv_pnp1_b', 'inv_pnp_r330_1_r') || net.areConnected('inv_pnp1_b', 'inv_pnp_r330_2_r') ||
      net.areConnected('inv_pnp1_b', 'inv_pnp_r330_1_l') || net.areConnected('inv_pnp1_b', 'inv_pnp_r330_2_l') ||
      net.areConnected('inv_pnp1_b', 'inv_pnp2_c') || net.areConnected('inv_pnp1_b', 'ps_dc12_neg');

    const pnpBase2Biased = 
      net.areConnected('inv_pnp2_b', 'inv_pnp_r330_1_r') || net.areConnected('inv_pnp2_b', 'inv_pnp_r330_2_r') ||
      net.areConnected('inv_pnp2_b', 'inv_pnp_r330_1_l') || net.areConnected('inv_pnp2_b', 'inv_pnp_r330_2_l') ||
      net.areConnected('inv_pnp2_b', 'inv_pnp1_c') || net.areConnected('inv_pnp2_b', 'ps_dc12_neg');

    if (pnpCtGrounded && pnpEmittersPos && pnpCollectorsWired && pnpBase1Biased && pnpBase2Biased) {
      isInverterRunning = true;
      isInverterPnpActive = true;
    }

    // Direct transistor oscillation fallback (if testing single stage directly to lamp/meters)
    if (!isInverterRunning) {
      const npnDirect = (net.find('inv_npn1_c') === dc12PosNet && net.find('inv_npn1_e') === dc12NegNet);
      const pnpDirect = (net.find('inv_pnp1_e') === dc12PosNet && net.find('inv_pnp1_c') === dc12NegNet);
      if (npnDirect || pnpDirect) {
        isInverterRunning = true;
        potentials['inv_npn1_c'] = {
          dcVoltage: 6.0,
          acRmsVoltage: 12.0,
          frequency: 50,
          waveformType: 'inverter_ac',
          peakVoltage: 12.0,
          rippleVoltage: 12.0,
        };
      }
    }
  }

  // If inverter is driving transformer in step-up mode, energize transformer 220V output
  if (isInverterRunning && (isInverterNpnActive || isInverterPnpActive)) {
    potentials['trafo_pri_0'] = { ...zeroPotential };
    potentials['trafo_pri_220'] = {
      dcVoltage: 0,
      acRmsVoltage: 220,
      frequency: 50,
      waveformType: 'inverter_ac',
      peakVoltage: 220 * Math.SQRT2,
      rippleVoltage: 0,
    };

    if (isInverterNpnActive) {
      potentials['inv_npn1_c'] = {
        dcVoltage: 6.0,
        acRmsVoltage: 12.0,
        frequency: 50,
        waveformType: 'inverter_ac',
        peakVoltage: 12.0 * Math.SQRT2,
        rippleVoltage: 12.0,
      };
      potentials['inv_npn2_c'] = {
        dcVoltage: 6.0,
        acRmsVoltage: 12.0,
        frequency: 50,
        waveformType: 'inverter_ac',
        peakVoltage: 12.0 * Math.SQRT2,
        rippleVoltage: 12.0,
      };
    }

    if (isInverterPnpActive) {
      potentials['inv_pnp1_c'] = {
        dcVoltage: 6.0,
        acRmsVoltage: 12.0,
        frequency: 50,
        waveformType: 'inverter_ac',
        peakVoltage: 12.0 * Math.SQRT2,
        rippleVoltage: 12.0,
      };
      potentials['inv_pnp2_c'] = {
        dcVoltage: 6.0,
        acRmsVoltage: 12.0,
        frequency: 50,
        waveformType: 'inverter_ac',
        peakVoltage: 12.0 * Math.SQRT2,
        rippleVoltage: 12.0,
      };
    }
  }

  // 3. Transformer Normal Mains Step-Down Energization Check
  // Primary connected to Mains AC 220
  const pri0_connected = mainsActive && (net.areConnected('socket_ac_0', 'trafo_pri_0') || net.areConnected('socket_ac_220', 'trafo_pri_0'));
  const pri220_connected = mainsActive && (net.areConnected('socket_ac_0', 'trafo_pri_220') || net.areConnected('socket_ac_220', 'trafo_pri_220'));
  const different_primary_feeds = mainsActive && (
    (net.areConnected('socket_ac_0', 'trafo_pri_0') && net.areConnected('socket_ac_220', 'trafo_pri_220')) ||
    (net.areConnected('socket_ac_220', 'trafo_pri_0') && net.areConnected('socket_ac_0', 'trafo_pri_220'))
  );

  const isTrafoEnergized = mainsActive && different_primary_feeds;

  if (isTrafoEnergized) {
    potentials['trafo_ct'] = { ...zeroPotential };

    // Left secondary taps
    potentials['trafo_sec_12_l'] = {
      dcVoltage: 0,
      acRmsVoltage: 12,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 12 * Math.SQRT2,
      rippleVoltage: 0,
    };
    potentials['trafo_sec_15_l'] = {
      dcVoltage: 0,
      acRmsVoltage: 15,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 15 * Math.SQRT2,
      rippleVoltage: 0,
    };
    potentials['trafo_sec_18_l'] = {
      dcVoltage: 0,
      acRmsVoltage: 18,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 18 * Math.SQRT2,
      rippleVoltage: 0,
    };

    // Right secondary taps (180 deg out of phase)
    potentials['trafo_sec_12_r'] = {
      dcVoltage: 0,
      acRmsVoltage: 12,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 12 * Math.SQRT2,
      rippleVoltage: 0,
    };
    potentials['trafo_sec_15_r'] = {
      dcVoltage: 0,
      acRmsVoltage: 15,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 15 * Math.SQRT2,
      rippleVoltage: 0,
    };
    potentials['trafo_sec_18_r'] = {
      dcVoltage: 0,
      acRmsVoltage: 18,
      frequency: 50,
      waveformType: 'ac_sine',
      peakVoltage: 18 * Math.SQRT2,
      rippleVoltage: 0,
    };
  }

  // Helper to determine AC RMS voltage between any two terminals
  function getAcVoltageBetween(termA: string, termB: string): number {
    // If inverter is oscillating, the transformer primary produces 220V AC step-up
    if (isInverterRunning) {
      if (
        (net.areConnected(termA, 'trafo_pri_0') && net.areConnected(termB, 'trafo_pri_220')) ||
        (net.areConnected(termB, 'trafo_pri_0') && net.areConnected(termA, 'trafo_pri_220'))
      ) {
        return 220;
      }
      if (
        (net.areConnected(termA, 'trafo_sec_12_l') && net.areConnected(termB, 'trafo_sec_12_r')) ||
        (net.areConnected(termB, 'trafo_sec_12_l') && net.areConnected(termA, 'trafo_sec_12_r'))
      ) {
        return 24;
      }
      if (
        (net.areConnected(termA, 'trafo_ct') && (net.areConnected(termB, 'trafo_sec_12_l') || net.areConnected(termB, 'trafo_sec_12_r'))) ||
        (net.areConnected(termB, 'trafo_ct') && (net.areConnected(termA, 'trafo_sec_12_l') || net.areConnected(termA, 'trafo_sec_12_r')))
      ) {
        return 12;
      }
    }

    if (!isTrafoEnergized && !mainsActive) return 0;

    // Check directly if connected to AC socket
    if (mainsActive && (
      (net.areConnected(termA, 'socket_ac_220') && net.areConnected(termB, 'socket_ac_0')) ||
      (net.areConnected(termB, 'socket_ac_220') && net.areConnected(termA, 'socket_ac_0'))
    )) {
      return 220;
    }

    if (!isTrafoEnergized) return 0;

    const taps = [
      { id: 'trafo_sec_18_l', v: -18 },
      { id: 'trafo_sec_15_l', v: -15 },
      { id: 'trafo_sec_12_l', v: -12 },
      { id: 'trafo_ct', v: 0 },
      { id: 'trafo_sec_12_r', v: 12 },
      { id: 'trafo_sec_15_r', v: 15 },
      { id: 'trafo_sec_18_r', v: 18 },
    ];

    let vA: number | null = null;
    let vB: number | null = null;

    for (const tap of taps) {
      if (net.areConnected(termA, tap.id)) vA = tap.v;
      if (net.areConnected(termB, tap.id)) vB = tap.v;
    }

    if (vA !== null && vB !== null && vA !== vB) {
      return Math.abs(vA - vB);
    }
    return 0;
  }

  // 3. DC 12V Power Supply
  if (state.dcSupplyPower) {
    potentials['ps_dc12_neg'] = { ...zeroPotential };
    potentials['ps_dc12_pos'] = {
      dcVoltage: 12.0,
      acRmsVoltage: 0,
      frequency: 0,
      waveformType: 'flat_dc',
      peakVoltage: 12.0,
      rippleVoltage: 0,
    };
  }

  // 4. Rectifier Full Wave (Diode Bridge)
  const bridgeAcInputV = getAcVoltageBetween('bridge_ac_top', 'bridge_ac_bot');
  let isBridgeRectifying = bridgeAcInputV > 0;

  if (isBridgeRectifying) {
    // Diode drop for bridge is ~1.4V (two diodes in conduction path)
    const peakV = Math.max(0, bridgeAcInputV * Math.SQRT2 - 1.4);

    // Check what capacitor is connected across bridge outputs:
    // C1000 or C2200
    let capacitanceF = 0;
    const bridgePlusNet = net.find('bridge_plus');
    const bridgeMinusNet = net.find('bridge_minus');

    const c1000_connected = 
      (net.find('rect_full_c1000_pos') === bridgePlusNet && net.find('rect_full_c1000_neg') === bridgeMinusNet) ||
      (net.find('rect_full_c1000_pos') === bridgeMinusNet && net.find('rect_full_c1000_neg') === bridgePlusNet);
    if (c1000_connected) capacitanceF += 0.001; // 1000 uF

    const c2200_connected = 
      (net.find('rect_full_c2200_pos') === bridgePlusNet && net.find('rect_full_c2200_neg') === bridgeMinusNet) ||
      (net.find('rect_full_c2200_pos') === bridgeMinusNet && net.find('rect_full_c2200_neg') === bridgePlusNet);
    if (c2200_connected) capacitanceF += 0.0022; // 2200 uF

    // Check load resistor
    let loadResistance = Infinity;
    const r330_connected = 
      (net.find('rect_full_r330_top') === bridgePlusNet && net.find('rect_full_r330_bot') === bridgeMinusNet) ||
      (net.find('rect_full_r330_top') === bridgeMinusNet && net.find('rect_full_r330_bot') === bridgePlusNet);
    if (r330_connected) loadResistance = 330;

    const r1k_connected = 
      (net.find('rect_full_r1k_top') === bridgePlusNet && net.find('rect_full_r1k_bot') === bridgeMinusNet) ||
      (net.find('rect_full_r1k_top') === bridgeMinusNet && net.find('rect_full_r1k_bot') === bridgePlusNet);
    if (r1k_connected) {
      loadResistance = loadResistance === Infinity ? 1000 : (1 / (1 / loadResistance + 1 / 1000));
    }

    // Check inductor choke in series
    let inductanceH = 0;
    // Check if l004 or l02 is wired in series with load
    if (net.areConnected('bridge_plus', 'rect_full_l004_1')) inductanceH += 0.00004;
    if (net.areConnected('bridge_plus', 'rect_full_l02_1')) inductanceH += 0.0002;

    let dcV = 0;
    let rippleV = 0;
    let waveType: NodePotential['waveformType'] = 'full_wave';

    if (capacitanceF > 0) {
      waveType = 'filtered_dc';
      if (loadResistance < Infinity) {
        // Vr = I_load / (2 * f * C) for full wave (f=50Hz -> 2f=100Hz)
        const iEstimated = peakV / loadResistance;
        rippleV = Math.min(peakV * 0.8, iEstimated / (100 * capacitanceF));
        if (inductanceH > 0) {
          rippleV *= 0.6; // LC smoothing factor
        }
        dcV = peakV - rippleV / 2;
      } else {
        // Open circuit: charges to peak!
        dcV = peakV;
        rippleV = 0.05;
      }
    } else {
      // Unfiltered full-wave rectified DC
      // Vdc = 2 * Vpeak / pi ≈ 0.636 * Vpeak
      dcV = (2 * peakV) / Math.PI;
      rippleV = peakV;
    }

    potentials['bridge_minus'] = { ...zeroPotential };
    potentials['bridge_plus'] = {
      dcVoltage: Number(dcV.toFixed(2)),
      acRmsVoltage: Number((rippleV / 2.828).toFixed(2)),
      frequency: 100,
      waveformType: waveType,
      peakVoltage: Number(peakV.toFixed(2)),
      rippleVoltage: Number(rippleV.toFixed(2)),
    };
  }

  // 5. Rectifier Half Wave (1N4007 Diode 1 or 2)
  let isHalfWaveRectifying = false;
  let halfWaveAcIn = 0;
  let activeDiodeCathode = '';

  const groundReferencePins = [
    'rect_half_r1k_bot',
    'rect_half_r330_bot',
    'rect_half_c1000_neg',
    'rect_half_c2200_neg',
    'trafo_ct',
    'dc_volt_0',
  ];

  for (const refPin of groundReferencePins) {
    const acD1 = getAcVoltageBetween('rect_half_d1_anode', refPin);
    if (acD1 > halfWaveAcIn) {
      halfWaveAcIn = acD1;
      activeDiodeCathode = 'rect_half_d1_cathode';
      isHalfWaveRectifying = true;
    }
    const acD2 = getAcVoltageBetween('rect_half_d2_anode', refPin);
    if (acD2 > halfWaveAcIn) {
      halfWaveAcIn = acD2;
      activeDiodeCathode = 'rect_half_d2_cathode';
      isHalfWaveRectifying = true;
    }
  }

  if (isHalfWaveRectifying && halfWaveAcIn > 0) {
    const peakV = Math.max(0, halfWaveAcIn * Math.SQRT2 - 0.7); // 1 diode drop 0.7V
    const cathodeNet = net.find(activeDiodeCathode);

    let capacitanceF = 0;
    if (net.find('rect_half_c1000_pos') === cathodeNet) capacitanceF += 0.001;
    if (net.find('rect_half_c2200_pos') === cathodeNet) capacitanceF += 0.0022;

    let loadR = Infinity;
    if (net.find('rect_half_r330_top') === cathodeNet) loadR = 330;
    if (net.find('rect_half_r1k_top') === cathodeNet) {
      loadR = loadR === Infinity ? 1000 : (1 / (1 / loadR + 1 / 1000));
    }

    // Check inductor in half wave path
    let inductanceH = 0;
    if (net.find('rect_half_l004_1') === cathodeNet) inductanceH += 0.00004;
    if (net.find('rect_half_l02_1') === cathodeNet) inductanceH += 0.0002;

    let dcV = 0;
    let rippleV = 0;
    let waveType: NodePotential['waveformType'] = 'half_wave';

    if (capacitanceF > 0) {
      waveType = 'filtered_dc';
      if (loadR < Infinity) {
        // Vr = I_load / (f * C) for half wave (f=50Hz)
        const iEst = peakV / loadR;
        rippleV = Math.min(peakV * 0.9, iEst / (50 * capacitanceF));
        if (inductanceH > 0) {
          rippleV *= 0.5; // LC filter choke smoothing
        }
        dcV = peakV - rippleV / 2;
      } else {
        dcV = peakV;
        rippleV = 0.08;
      }
    } else {
      // Unfiltered half-wave Vdc = Vpeak / pi ≈ 0.318 * Vpeak
      dcV = peakV / Math.PI;
      rippleV = peakV;
      if (inductanceH > 0) {
        rippleV *= 0.75;
      }
    }

    potentials[activeDiodeCathode] = {
      dcVoltage: Number(dcV.toFixed(2)),
      acRmsVoltage: Number((rippleV / 2).toFixed(2)),
      frequency: 50,
      waveformType: waveType,
      peakVoltage: Number(peakV.toFixed(2)),
      rippleVoltage: Number(rippleV.toFixed(2)),
    };
  }

  // 6. Inverter Module potentials have already been populated in Step 2.

  // Propagate potentials to all terminals sharing the same net
  const allTerminalIds = Object.keys(potentials);
  for (const srcId of allTerminalIds) {
    const srcPot = potentials[srcId];
    for (const wire of state.wires) {
      if (net.areConnected(srcId, wire.from) && !potentials[wire.from]) {
        potentials[wire.from] = { ...srcPot };
      }
      if (net.areConnected(srcId, wire.to) && !potentials[wire.to]) {
        potentials[wire.to] = { ...srcPot };
      }
    }
  }

  // 7. Measure DC Voltmeter
  // Connects between dc_volt_pos and dc_volt_0
  let dcMeterVal = 0;
  const dcPosNet = net.find('dc_volt_pos');
  const dc0Net = net.find('dc_volt_0');

  if (dcPosNet !== dc0Net) {
    // Find if either terminal connects to a known potential
    let vPos = 0;
    let vNeg = 0;

    for (const [id, pot] of Object.entries(potentials)) {
      if (net.find(id) === dcPosNet) vPos = pot.dcVoltage;
      if (net.find(id) === dc0Net) vNeg = pot.dcVoltage;
    }

    dcMeterVal = Math.abs(vPos - vNeg);
  }

  // 8. Measure AC Voltmeter
  // Connects between ac_volt_pos and ac_volt_0
  let acMeterVal = 0;
  const acPosNet = net.find('ac_volt_pos');
  const ac0Net = net.find('ac_volt_0');

  if (acPosNet !== ac0Net) {
    const acDiff = getAcVoltageBetween('ac_volt_pos', 'ac_volt_0');
    if (acDiff > 0) {
      acMeterVal = acDiff;
    } else {
      // Check if measuring an AC RMS node potential
      let vAcPos = 0;
      let vAcNeg = 0;
      for (const [id, pot] of Object.entries(potentials)) {
        if (net.find(id) === acPosNet) vAcPos = pot.acRmsVoltage;
        if (net.find(id) === ac0Net) vAcNeg = pot.acRmsVoltage;
      }
      acMeterVal = Math.max(vAcPos, vAcNeg);
    }
  }

  // 9. Load (Light Bulb)
  let lampVoltage = 0;
  const lamp0Net = net.find('load_lamp_0');
  const lamp220Net = net.find('load_lamp_220');

  if (lamp0Net !== lamp220Net) {
    // Check if directly connected to AC socket
    if (mainsActive && (
      (net.areConnected('load_lamp_0', 'socket_ac_0') && net.areConnected('load_lamp_220', 'socket_ac_220')) ||
      (net.areConnected('load_lamp_220', 'socket_ac_0') && net.areConnected('load_lamp_0', 'socket_ac_220'))
    )) {
      lampVoltage = 220;
    } else {
      // Check if connected across transformer taps
      const trafoV = getAcVoltageBetween('load_lamp_0', 'load_lamp_220');
      if (trafoV > 0) {
        lampVoltage = trafoV;
      } else {
        // Check DC or rectified potential
        let vPos = 0;
        let vNeg = 0;
        for (const [id, pot] of Object.entries(potentials)) {
          if (net.find(id) === lamp220Net) vPos = Math.max(pot.dcVoltage, pot.acRmsVoltage);
          if (net.find(id) === lamp0Net) vNeg = Math.max(pot.dcVoltage, pot.acRmsVoltage);
        }
        lampVoltage = Math.abs(vPos - vNeg);
      }
    }
  }

  // Bulb glow computation:
  // Rated for dual: bright on 220V, but also visible glow on 12V-36V (as low-voltage lab demonstration lamp)
  let lampBrightness = 0;
  let lampPower = 0;
  if (lampVoltage > 0) {
    if (lampVoltage >= 100) {
      // 220V bulb mode
      lampBrightness = Math.min(1.0, (lampVoltage / 220) ** 1.6);
      lampPower = (lampVoltage ** 2) / 1000; // ~48W at 220V
    } else {
      // 12V-36V demonstration mode
      lampBrightness = Math.min(1.0, (lampVoltage / 18) ** 1.4);
      lampPower = (lampVoltage ** 2) / 24; // ~6W at 12V
    }
  }

  return {
    dcMeterReading: Number(dcMeterVal.toFixed(2)),
    acMeterReading: Number(acMeterVal.toFixed(1)),
    lampVoltage: Number(lampVoltage.toFixed(1)),
    lampPower: Number(lampPower.toFixed(2)),
    lampBrightness: Number(Math.min(1.0, Math.max(0, lampBrightness)).toFixed(3)),
    isTrafoEnergized,
    isBridgeRectifying,
    isHalfWaveRectifying,
    isInverterRunning,
    activeNetsCount: Object.keys(net.getNets()).length,
    nodePotentials: potentials,
  };
}

/**
 * Generates instantaneous sample value V(t) at timeMs for a given terminal relative to ground,
 * used for the Oscilloscope screen.
 */
export function getInstantaneousVoltage(
  terminalId: string,
  timeMs: number,
  results: SimulationResults
): number {
  const pot = results.nodePotentials[terminalId];
  if (!pot) return 0;

  const f = pot.frequency || 50;
  const omega = 2 * Math.PI * (f / 1000); // radians per millisecond
  const phase = omega * timeMs;

  switch (pot.waveformType) {
    case 'ac_sine':
      return pot.peakVoltage * Math.sin(phase);

    case 'half_wave': {
      const sine = Math.sin(phase);
      return sine > 0 ? pot.peakVoltage * sine : 0;
    }

    case 'full_wave': {
      return pot.peakVoltage * Math.abs(Math.sin(phase));
    }

    case 'filtered_dc': {
      // DC with residual sawtooth/exponential ripple
      // Vr period is 10ms for 100Hz full-wave, 20ms for 50Hz half-wave
      const period = 1000 / f;
      const tInPeriod = (timeMs % period) / period;
      const ripple = (0.5 - tInPeriod) * pot.rippleVoltage;
      return pot.dcVoltage + ripple;
    }

    case 'inverter_ac': {
      // Quasi-square / modified sine inverter output
      const sine = Math.sin(phase);
      if (Math.abs(sine) < 0.25) return 0;
      return sine > 0 ? pot.peakVoltage : -pot.peakVoltage;
    }

    case 'flat_dc':
      return pot.dcVoltage;

    case 'zero':
    default:
      return 0;
  }
}
