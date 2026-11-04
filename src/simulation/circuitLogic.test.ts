import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Netlist,
  buildNetlist,
  solveCircuit,
  getInstantaneousVoltage,
  SimulationState,
  Wire,
} from './circuitLogic';
import { EXPERIMENTS } from './experiments';

test('Netlist correctly groups connected terminals', () => {
  const wires: Wire[] = [
    { id: 'w1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
    { id: 'w2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
    { id: 'w3', from: 'trafo_sec_12_l', to: 'ac_volt_pos', color: 'red' },
    { id: 'w4', from: 'trafo_ct', to: 'ac_volt_0', color: 'black' },
  ];

  const net = buildNetlist(wires);
  assert.equal(net.areConnected('socket_ac_0', 'trafo_pri_0'), true);
  assert.equal(net.areConnected('socket_ac_220', 'trafo_pri_220'), true);
  assert.equal(net.areConnected('socket_ac_0', 'socket_ac_220'), false);
  assert.equal(net.areConnected('trafo_sec_12_l', 'ac_volt_pos'), true);
  assert.equal(net.areConnected('trafo_ct', 'ac_volt_0'), true);
});

test('Transformer energizes when wired to AC socket and produces correct secondary voltages', () => {
  const state: SimulationState = {
    mainsPower: true,
    fuseBlown: false,
    dcSupplyPower: false,
    wires: [
      { id: 'w1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w3', from: 'trafo_sec_12_l', to: 'ac_volt_pos', color: 'red' },
      { id: 'w4', from: 'trafo_ct', to: 'ac_volt_0', color: 'black' },
    ],
  };

  const res = solveCircuit(state);
  assert.equal(res.isTrafoEnergized, true);
  assert.equal(res.acMeterReading, 12);

  // Test 18V tap
  const state18V: SimulationState = {
    ...state,
    wires: [
      { id: 'w1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w3', from: 'trafo_sec_18_l', to: 'ac_volt_pos', color: 'red' },
      { id: 'w4', from: 'trafo_ct', to: 'ac_volt_0', color: 'black' },
    ],
  };
  const res18 = solveCircuit(state18V);
  assert.equal(res18.acMeterReading, 18);

  // Test across 12V left and 12V right (total 24V)
  const state24V: SimulationState = {
    ...state,
    wires: [
      { id: 'w1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w3', from: 'trafo_sec_12_l', to: 'ac_volt_pos', color: 'red' },
      { id: 'w4', from: 'trafo_sec_12_r', to: 'ac_volt_0', color: 'black' },
    ],
  };
  const res24 = solveCircuit(state24V);
  assert.equal(res24.acMeterReading, 24);
});

test('Full-wave bridge rectifier rectifies AC and capacitor filters ripple', () => {
  const stateUnfiltered: SimulationState = {
    mainsPower: true,
    fuseBlown: false,
    dcSupplyPower: false,
    wires: [
      { id: 'w1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w3', from: 'trafo_sec_15_l', to: 'bridge_ac_top', color: 'red' },
      { id: 'w4', from: 'trafo_ct', to: 'bridge_ac_bot', color: 'black' },
      { id: 'w5', from: 'bridge_plus', to: 'dc_volt_pos', color: 'red' },
      { id: 'w6', from: 'bridge_minus', to: 'dc_volt_0', color: 'black' },
    ],
  };

  const resUnfiltered = solveCircuit(stateUnfiltered);
  assert.equal(resUnfiltered.isBridgeRectifying, true);
  assert.ok(resUnfiltered.dcMeterReading > 11 && resUnfiltered.dcMeterReading < 14);

  const stateFiltered: SimulationState = {
    ...stateUnfiltered,
    wires: [
      ...stateUnfiltered.wires,
      { id: 'w7', from: 'bridge_plus', to: 'rect_full_c1000_pos', color: 'red' },
      { id: 'w8', from: 'bridge_minus', to: 'rect_full_c1000_neg', color: 'black' },
    ],
  };

  const resFiltered = solveCircuit(stateFiltered);
  assert.ok(resFiltered.dcMeterReading > 18.0 && resFiltered.dcMeterReading < 21.0);
});

test('Jobsheet 3: Inverter Transistor NPN operates step-up trafo and lights 220V lamp', () => {
  const js3 = EXPERIMENTS.find((e) => e.id === 'jobsheet_3_inverter_npn')!;
  assert.ok(js3);

  const state: SimulationState = {
    mainsPower: false,
    fuseBlown: false,
    dcSupplyPower: true,
    wires: js3.wires,
  };

  const res = solveCircuit(state);
  assert.equal(res.isInverterRunning, true, 'Inverter NPN should be running');
  assert.equal(res.acMeterReading, 220.0, 'AC Voltmeter must read 220V from step-up transformer');
  assert.equal(res.lampVoltage, 220.0, 'Load lamp voltage should be 220V');
  assert.equal(res.lampBrightness, 1.0, 'Load lamp brightness should be full 1.0 at 220V');
});

test('Jobsheet 4: Inverter Transistor PNP operates step-up trafo and lights 220V lamp', () => {
  const js4 = EXPERIMENTS.find((e) => e.id === 'jobsheet_4_inverter_pnp')!;
  assert.ok(js4);

  const state: SimulationState = {
    mainsPower: false,
    fuseBlown: false,
    dcSupplyPower: true,
    wires: js4.wires,
  };

  const res = solveCircuit(state);
  assert.equal(res.isInverterRunning, true, 'Inverter PNP should be running');
  assert.equal(res.acMeterReading, 220.0, 'AC Voltmeter must read 220V from step-up transformer');
  assert.equal(res.lampVoltage, 220.0, 'Load lamp voltage should be 220V');
  assert.equal(res.lampBrightness, 1.0, 'Load lamp brightness should be full 1.0 at 220V');
});

test('Oscilloscope sample generator produces continuous periodic waveform for Inverter AC', () => {
  const js3 = EXPERIMENTS.find((e) => e.id === 'jobsheet_3_inverter_npn')!;
  const state: SimulationState = {
    mainsPower: false,
    fuseBlown: false,
    dcSupplyPower: true,
    wires: js3.wires,
  };
  const res = solveCircuit(state);
  const vPos = getInstantaneousVoltage('trafo_pri_220', 5, res);
  assert.ok(Math.abs(vPos) > 100, 'Oscilloscope voltage on 220V inverter node should be high voltage AC');
});

test('Jobsheet 1: Half-Wave Rectifier with Inductor (0.2 mH) shows valid DC voltmeter reading', () => {
  const js1 = EXPERIMENTS.find((e) => e.id === 'jobsheet_1_half_wave')!;
  assert.ok(js1);

  const state: SimulationState = {
    mainsPower: true,
    fuseBlown: false,
    dcSupplyPower: false,
    wires: js1.wires,
  };

  const res = solveCircuit(state);
  assert.equal(res.isHalfWaveRectifying, true, 'Half-wave rectifier should be active');
  assert.ok(
    res.dcMeterReading > 14.0 && res.dcMeterReading < 18.0,
    `DC voltmeter reading (${res.dcMeterReading}V) through inductor must be > 14V and not 0V`
  );
});

test('Jobsheet 2: Full-Wave Rectifier with Inductor (0.2 mH) shows valid DC voltmeter reading', () => {
  const js2 = EXPERIMENTS.find((e) => e.id === 'jobsheet_2_full_wave')!;
  assert.ok(js2);

  const state: SimulationState = {
    mainsPower: true,
    fuseBlown: false,
    dcSupplyPower: false,
    wires: js2.wires,
  };

  const res = solveCircuit(state);
  assert.equal(res.isBridgeRectifying, true, 'Full-wave bridge should be rectifying');
  assert.ok(
    res.dcMeterReading > 14.0 && res.dcMeterReading < 17.0,
    `DC voltmeter reading (${res.dcMeterReading}V) through inductor must be > 14V and not 0V`
  );
});

