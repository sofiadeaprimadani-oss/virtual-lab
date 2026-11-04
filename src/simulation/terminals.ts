/**
 * Terminal registry for the Trainer Inverter & Rectifier.
 */

export type TerminalColor = 'red' | 'black';

export type TerminalModule = 
  | 'socket_ac'
  | 'transformer'
  | 'rect_full'
  | 'rect_half'
  | 'inverter_npn'
  | 'inverter_pnp'
  | 'load'
  | 'power_supply_dc'
  | 'dc_voltmeter'
  | 'ac_voltmeter';

export interface TerminalDef {
  id: string;
  name: string;
  color: TerminalColor;
  module: TerminalModule;
  group?: string;
}

export const TERMINALS: TerminalDef[] = [
  // 1. SOCKET AC 220
  { id: 'socket_ac_0', name: '0', color: 'black', module: 'socket_ac' },
  { id: 'socket_ac_220', name: '220', color: 'red', module: 'socket_ac' },

  // 2. TRANSFORMER
  { id: 'trafo_pri_0', name: '0', color: 'black', module: 'transformer', group: 'primary' },
  { id: 'trafo_pri_220', name: '220', color: 'red', module: 'transformer', group: 'primary' },
  { id: 'trafo_sec_12_l', name: '12', color: 'red', module: 'transformer', group: 'secondary' },
  { id: 'trafo_ct', name: 'CT', color: 'black', module: 'transformer', group: 'secondary' },
  { id: 'trafo_sec_12_r', name: '12', color: 'red', module: 'transformer', group: 'secondary' },
  { id: 'trafo_sec_18_l', name: '18', color: 'red', module: 'transformer', group: 'secondary' },
  { id: 'trafo_sec_15_l', name: '15', color: 'red', module: 'transformer', group: 'secondary' },
  { id: 'trafo_sec_15_r', name: '15', color: 'red', module: 'transformer', group: 'secondary' },
  { id: 'trafo_sec_18_r', name: '18', color: 'red', module: 'transformer', group: 'secondary' },

  // 3. RECTIFIER FULL WAVE
  { id: 'bridge_ac_top', name: '~ (AC Atas)', color: 'black', module: 'rect_full', group: 'bridge' },
  { id: 'bridge_ac_bot', name: '~ (AC Bawah)', color: 'black', module: 'rect_full', group: 'bridge' },
  { id: 'bridge_minus', name: '- (DC Min)', color: 'black', module: 'rect_full', group: 'bridge' },
  { id: 'bridge_plus', name: '+ (DC Plus)', color: 'black', module: 'rect_full', group: 'bridge' },
  { id: 'rect_full_c1000_pos', name: '+ (1000uF)', color: 'red', module: 'rect_full', group: 'cap_1000' },
  { id: 'rect_full_c1000_neg', name: '- (1000uF)', color: 'black', module: 'rect_full', group: 'cap_1000' },
  { id: 'rect_full_c2200_pos', name: '+ (2200uF)', color: 'red', module: 'rect_full', group: 'cap_2200' },
  { id: 'rect_full_c2200_neg', name: '- (2200uF)', color: 'black', module: 'rect_full', group: 'cap_2200' },
  { id: 'rect_full_l004_1', name: 'L1 (0.04mH)', color: 'black', module: 'rect_full', group: 'ind_004' },
  { id: 'rect_full_l004_2', name: 'L2 (0.04mH)', color: 'black', module: 'rect_full', group: 'ind_004' },
  { id: 'rect_full_l02_1', name: 'L1 (0.2mH)', color: 'black', module: 'rect_full', group: 'ind_02' },
  { id: 'rect_full_l02_2', name: 'L2 (0.2mH)', color: 'black', module: 'rect_full', group: 'ind_02' },
  { id: 'rect_full_r330_top', name: 'R1 (330Ω)', color: 'red', module: 'rect_full', group: 'res_330' },
  { id: 'rect_full_r330_bot', name: 'R2 (330Ω)', color: 'black', module: 'rect_full', group: 'res_330' },
  { id: 'rect_full_r1k_top', name: 'R1 (1kΩ)', color: 'red', module: 'rect_full', group: 'res_1k' },
  { id: 'rect_full_r1k_bot', name: 'R2 (1kΩ)', color: 'black', module: 'rect_full', group: 'res_1k' },

  // 4. RECTIFIER HALF WAVE
  { id: 'rect_half_d1_anode', name: 'A (1N4007 D1)', color: 'red', module: 'rect_half', group: 'diode_1' },
  { id: 'rect_half_d1_cathode', name: 'K (1N4007 D1)', color: 'black', module: 'rect_half', group: 'diode_1' },
  { id: 'rect_half_d2_anode', name: 'A (1N4007 D2)', color: 'red', module: 'rect_half', group: 'diode_2' },
  { id: 'rect_half_d2_cathode', name: 'K (1N4007 D2)', color: 'black', module: 'rect_half', group: 'diode_2' },
  { id: 'rect_half_c1000_pos', name: '+ (1000uF)', color: 'red', module: 'rect_half', group: 'cap_1000' },
  { id: 'rect_half_c1000_neg', name: '- (1000uF)', color: 'black', module: 'rect_half', group: 'cap_1000' },
  { id: 'rect_half_c2200_pos', name: '+ (2200uF)', color: 'red', module: 'rect_half', group: 'cap_2200' },
  { id: 'rect_half_c2200_neg', name: '- (2200uF)', color: 'black', module: 'rect_half', group: 'cap_2200' },
  { id: 'rect_half_l004_1', name: 'L1 (0.04mH)', color: 'black', module: 'rect_half', group: 'ind_004' },
  { id: 'rect_half_l004_2', name: 'L2 (0.04mH)', color: 'black', module: 'rect_half', group: 'ind_004' },
  { id: 'rect_half_l02_1', name: 'L1 (0.2mH)', color: 'black', module: 'rect_half', group: 'ind_02' },
  { id: 'rect_half_l02_2', name: 'L2 (0.2mH)', color: 'black', module: 'rect_half', group: 'ind_02' },
  { id: 'rect_half_r330_top', name: 'R1 (330Ω)', color: 'red', module: 'rect_half', group: 'res_330' },
  { id: 'rect_half_r330_bot', name: 'R2 (330Ω)', color: 'black', module: 'rect_half', group: 'res_330' },
  { id: 'rect_half_r1k_top', name: 'R1 (1kΩ)', color: 'red', module: 'rect_half', group: 'res_1k' },
  { id: 'rect_half_r1k_bot', name: 'R2 (1kΩ)', color: 'black', module: 'rect_half', group: 'res_1k' },

  // 5. INVERTER NPN
  { id: 'inv_npn1_b', name: 'B (NPN 1)', color: 'red', module: 'inverter_npn', group: 'npn1' },
  { id: 'inv_npn1_e', name: 'E (NPN 1)', color: 'black', module: 'inverter_npn', group: 'npn1' },
  { id: 'inv_npn1_c', name: 'C (NPN 1)', color: 'black', module: 'inverter_npn', group: 'npn1' },
  { id: 'inv_r330_1_l', name: 'R1 (330Ω)', color: 'red', module: 'inverter_npn', group: 'res1' },
  { id: 'inv_r330_1_r', name: 'R2 (330Ω)', color: 'red', module: 'inverter_npn', group: 'res1' },
  { id: 'inv_r330_2_l', name: 'R1 (330Ω)', color: 'red', module: 'inverter_npn', group: 'res2' },
  { id: 'inv_r330_2_r', name: 'R2 (330Ω)', color: 'red', module: 'inverter_npn', group: 'res2' },
  { id: 'inv_npn2_e', name: 'E (NPN 2)', color: 'black', module: 'inverter_npn', group: 'npn2' },
  { id: 'inv_npn2_c', name: 'C (NPN 2)', color: 'black', module: 'inverter_npn', group: 'npn2' },
  { id: 'inv_npn2_b', name: 'B (NPN 2)', color: 'red', module: 'inverter_npn', group: 'npn2' },

  // 6. INVERTER PNP
  { id: 'inv_pnp_r330_1_l', name: 'R1 (330Ω)', color: 'black', module: 'inverter_pnp', group: 'res_pnp1' },
  { id: 'inv_pnp_r330_1_r', name: 'R2 (330Ω)', color: 'black', module: 'inverter_pnp', group: 'res_pnp1' },
  { id: 'inv_pnp_r330_2_l', name: 'R1 (330Ω)', color: 'black', module: 'inverter_pnp', group: 'res_pnp2' },
  { id: 'inv_pnp_r330_2_r', name: 'R2 (330Ω)', color: 'black', module: 'inverter_pnp', group: 'res_pnp2' },
  { id: 'inv_pnp1_c', name: 'C (PNP 1)', color: 'red', module: 'inverter_pnp', group: 'pnp1' },
  { id: 'inv_pnp1_b', name: 'B (PNP 1)', color: 'black', module: 'inverter_pnp', group: 'pnp1' },
  { id: 'inv_pnp1_e', name: 'E (PNP 1)', color: 'red', module: 'inverter_pnp', group: 'pnp1' },
  { id: 'inv_pnp2_e', name: 'E (PNP 2)', color: 'red', module: 'inverter_pnp', group: 'pnp2' },
  { id: 'inv_pnp2_b', name: 'B (PNP 2)', color: 'black', module: 'inverter_pnp', group: 'pnp2' },
  { id: 'inv_pnp2_c', name: 'C (PNP 2)', color: 'red', module: 'inverter_pnp', group: 'pnp2' },

  // 7. LOAD
  { id: 'load_lamp_0', name: '0', color: 'black', module: 'load' },
  { id: 'load_lamp_220', name: '220', color: 'red', module: 'load' },

  // 8. POWER SUPPLY DC 12V
  { id: 'ps_dc12_pos', name: '+', color: 'red', module: 'power_supply_dc' },
  { id: 'ps_dc12_neg', name: '-', color: 'black', module: 'power_supply_dc' },

  // 9. DC VOLT METER
  { id: 'dc_volt_0', name: '0 (COM)', color: 'black', module: 'dc_voltmeter' },
  { id: 'dc_volt_pos', name: '220 (V)', color: 'red', module: 'dc_voltmeter' },

  // 10. AC VOLT METER
  { id: 'ac_volt_0', name: '0 (COM)', color: 'black', module: 'ac_voltmeter' },
  { id: 'ac_volt_pos', name: '220 (V)', color: 'red', module: 'ac_voltmeter' },
];

export const TERMINAL_MAP: Record<string, TerminalDef> = TERMINALS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<string, TerminalDef>
);
