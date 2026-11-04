import { Wire } from './circuitLogic';

const assetBase = import.meta.env?.BASE_URL ?? '/';

export interface ExperimentProcedureSection {
  sectionTitle?: string;
  steps: string[];
}

export interface Experiment {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  objective: string[];
  theory: string;
  materials: string[];
  k3: string[];
  procedure: ExperimentProcedureSection[];
  analysis: string[];
  tasks: string[];
  pdfFileName: string;
  pdfDownloadPath: string;
  wires: Wire[];
  defaultMains: boolean;
  defaultDcSupply: boolean;
  expectedResults: {
    dcVoltage: string;
    acVoltage: string;
    lampStatus: string;
    waveformDesc: string;
  };
}

export const EXPERIMENTS: Experiment[] = [
  // ==========================================
  // JOBSHEET 1: PENYEARAH SETENGAH GELOMBANG
  // ==========================================
  {
    id: 'jobsheet_1_half_wave',
    number: 1,
    title: 'Penyearah Setengah Gelombang (Half-Wave Rectifier)',
    subtitle: 'Mata Kuliah Elektronika Daya — S1 Pendidikan Teknik Elektro UM',
    objective: [
      'Mahasiswa mampu merangkai dan mengoperasikan rangkaian penyearah setengah gelombang menggunakan dioda 1N4007.',
      'Mahasiswa mampu mengukur dan menghitung tegangan keluaran DC pada rangkaian tanpa filter dan dengan filter (Kapasitor dan Induktor).',
      'Mahasiswa mampu menganalisis pengaruh nilai kapasitansi dan induktansi terhadap penurunan tegangan ripple.',
    ],
    theory:
      'Penyearah setengah gelombang (Half-Wave Rectifier) adalah rangkaian elektronika daya dasar yang mengubah arus bolak-balik (AC) menjadi arus searah (DC) dengan melewatkan hanya setengah siklus dari gelombang AC masukan. Rangkaian ini menggunakan satu buah dioda yang berada pada kondisi forward bias selama siklus positif dan reverse bias pada siklus negatif. Rumus tegangan rata-rata DC tanpa filter adalah VDC = Vmax / π. Kelemahan utama penyearah ini adalah besarnya tegangan ripple. Untuk menghaluskannya digunakan filter kapasitor (C) paralel dan filter induktor (L) seri (Filter LC).',
    materials: [
      'Trainer Inverter & Rectifier (Blok Transformer & Rectifier Half Wave)',
      'Dioda 1N4007',
      'Elco 1000 µF dan 2200 µF',
      'Induktor 0.04 mH dan 0.2 mH',
      'Resistor 330 Ω dan 1 kΩ',
      'Kabel Jumper secukupnya',
      'Osiloskop & Multimeter',
    ],
    k3: [
      'Pastikan kabel power trainer tidak terhubung ke sumber listrik saat merangkai jumper.',
      'Perhatikan polaritas kapasitor elektrolit (Elco); pemasangan terbalik dapat menyebabkan kapasitor meledak.',
      'Hindari menyentuh area blok "Socket AC 220" dan terminal tegangan tinggi pada trafo saat menyala.',
      'Lakukan pengecekan ulang rangkaian sebelum menyalakan saklar Power Supply.',
    ],
    procedure: [
      {
        sectionTitle: 'Persiapan Alat Ukur',
        steps: [
          'Nyalakan Osiloskop dan lakukan kalibrasi probe (posisi 1X atau 10X sesuai kebutuhan).',
          'Siapkan Osiloskop pada mode Dual Trace (CH1 dan CH2 aktif).',
          'Hubungkan jepit referensi/ground CH1 dan CH2 ke terminal 0 (Nol) sekunder Trafo sebagai jalur ground rangkaian.',
        ],
      },
      {
        sectionTitle: 'Tahap 1: Pengamatan Tanpa Filter',
        steps: [
          'Pastikan saklar trainer dalam keadaan OFF.',
          'Hubungkan terminal tegangan AC sekunder dari Transformer (12V) ke terminal masukan Anoda Dioda 1N4007.',
          'Hubungkan terminal Katoda Dioda ke beban Resistor 1 kΩ.',
          'Hubungkan ujung bawah Resistor 1 kΩ kembali ke terminal 0 (CT) Trafo.',
          'Pasang probe CH1 Osiloskop pada masukan AC (12V dan 0) dan pasang probe CH2 serta DC Volt Meter paralel beban Resistor 1 kΩ.',
          'Nyalakan trainer. Catat nilai Vp pada osiloskop dan Vdc pada Volt Meter (~5.1V DC).',
        ],
      },
      {
        sectionTitle: 'Tahap 2: Pengamatan dengan Filter Kapasitor Saja',
        steps: [
          'Matikan trainer.',
          'Hubungkan Kapasitor 1000 µF secara paralel dengan beban Resistor 1 kΩ (kutub positif ke katoda, kutub negatif ke 0/ground).',
          'Nyalakan trainer. Amati perubahan gelombang pada CH2 menjadi gigi gergaji (discharge curve) dan catat Vdc serta Vripple(p-p).',
          'Ulangi dengan mengganti kapasitor menjadi 2200 µF dan bandingkan kelandaian kurva pelepasan muatan.',
        ],
      },
      {
        sectionTitle: 'Tahap 3: Pengamatan dengan Filter LC (Induktor 0.2 mH + Kapasitor 2200 µF)',
        steps: [
          'Matikan trainer. Hubungkan Katoda Dioda ke kaki terminal Induktor 0.2 mH secara seri.',
          'Hubungkan kaki Induktor satunya ke beban Resistor 1 kΩ.',
          'Pasang Kapasitor 2200 µF secara paralel setelah posisi Induktor.',
          'Nyalakan trainer. Amati garis tegangan DC menjadi jauh lebih lurus (smooth) dan catat nilai Vdc akhir.',
        ],
      },
    ],
    analysis: [
      'Jelaskan perbedaan visual bentuk gelombang keluaran (CH2) antara rangkaian tanpa filter dan dengan filter kapasitor! Mengapa saat menggunakan kapasitor tidak menyentuh 0V?',
      'Bandingkan nilai Vripple(p-p) antara kapasitor 1000 µF dan 2200 µF. Apa korelasi kapasitas dengan discharge angle?',
      'Jelaskan secara analitis mengapa penambahan Induktor seri (Filter LC) mampu menghaluskan sisa ripple tegangan!',
    ],
    tasks: [
      'Analisislah proses pengisian (charging) dan pengosongan (discharging) kapasitor selama siklus sinus.',
      'Hitunglah Faktor Riak (Ripple Factor) γ = 1 / (2√3 · f · R · C). Evaluasi deviasi hasil teoritis terhadap pengukuran!',
      'Rancanglah skema filter bertingkat regulator aktif tambahan agar tegangan output stabil 0 ripple pada beban berapapun.',
    ],
    pdfFileName: 'HALF_WAVE_d8b41077.pdf',
    pdfDownloadPath: `${assetBase}assets/aistudio/HALF_WAVE_d8b41077.pdf`,
    wires: [
      { id: 'w_js1_1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w_js1_2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w_js1_3', from: 'trafo_sec_12_l', to: 'rect_half_d1_anode', color: 'yellow' },
      { id: 'w_js1_4', from: 'rect_half_d1_cathode', to: 'rect_half_l02_1', color: 'red' },
      { id: 'w_js1_5', from: 'rect_half_l02_2', to: 'rect_half_c2200_pos', color: 'red' },
      { id: 'w_js1_6', from: 'rect_half_c2200_pos', to: 'rect_half_r1k_top', color: 'red' },
      { id: 'w_js1_7', from: 'rect_half_c2200_neg', to: 'rect_half_r1k_bot', color: 'black' },
      { id: 'w_js1_8', from: 'rect_half_r1k_bot', to: 'trafo_ct', color: 'black' },
      { id: 'w_js1_9', from: 'rect_half_r1k_top', to: 'dc_volt_pos', color: 'red' },
      { id: 'w_js1_10', from: 'rect_half_r1k_bot', to: 'dc_volt_0', color: 'black' },
    ],
    defaultMains: true,
    defaultDcSupply: false,
    expectedResults: {
      dcVoltage: '~15.5 V DC',
      acVoltage: '0.0 V (DC Mode)',
      lampStatus: 'Mati (fokus pada modul penyearah)',
      waveformDesc: 'DC tersaring halus oleh kombinasi filter LC (Induktor 0.2mH + Elco 2200µF)',
    },
  },

  // ==========================================
  // JOBSHEET 2: PENYEARAH GELOMBANG PENUH
  // ==========================================
  {
    id: 'jobsheet_2_full_wave',
    number: 2,
    title: 'Penyearah Gelombang Penuh (Full-Wave Rectifier)',
    subtitle: 'Mata Kuliah Elektronika Daya — S1 Pendidikan Teknik Elektro UM',
    objective: [
      'Mahasiswa mampu memahami prinsip kerja penyearah gelombang penuh menggunakan topologi Dioda Bridge.',
      'Mahasiswa mampu membandingkan efisiensi dan kestabilan tegangan output antara penyearah setengah gelombang dan gelombang penuh.',
      'Mahasiswa mampu merangkai kombinasi filter L dan C (LC Filter) pada keluaran gelombang penuh.',
    ],
    theory:
      'Penyearah gelombang penuh mengonversi seluruh siklus gelombang AC (positif dan negatif) menjadi arus searah. Menggunakan topologi Bridge Rectifier dengan 4 buah dioda: pada setengah siklus positif 2 dioda forward bias, dan pada setengah siklus negatif 2 dioda lainnya forward bias. Rumus tegangan rata-rata tanpa filter adalah VDC = 2·Vmax / π. Frekuensi ripple menjadi 2 kali lipat frekuensi jala-jala (100 Hz untuk sumber 50 Hz), sehingga proses pemfilteran kapasitor dan induktor menjadi jauh lebih efisien dibanding penyearah setengah gelombang.',
    materials: [
      'Trainer Inverter & Rectifier (Blok Transformer & Rectifier Full Wave)',
      '4 Dioda 1N4007 (Konfigurasi Bridge)',
      'Elco 1000 µF dan 2200 µF',
      'Induktor 0.04 mH dan 0.2 mH',
      'Resistor 330 Ω dan 1 kΩ',
      'Kabel Jumper secukupnya',
      'Osiloskop & Multimeter',
    ],
    k3: [
      'Pastikan kabel power trainer tidak terhubung ke sumber listrik PLN saat merangkai kabel.',
      'Perhatikan polaritas Elco, hindari terbalik kutub.',
      'Hindari menyentuh terminal tegangan tinggi trafo.',
      'Peringatan Grounding: Pastikan jepit buaya osiloskop hanya terhubung ke terminal negatif (-) keluaran Dioda Bridge sebagai titik referensi 0V DC.',
    ],
    procedure: [
      {
        sectionTitle: 'Tahap 1: Pengamatan Tanpa Filter',
        steps: [
          'Pastikan saklar trainer OFF.',
          'Hubungkan terminal 12V dan 0 (CT) dari sekunder Transformer ke dua terminal masukan AC (simbol ~) Dioda Bridge.',
          'Hubungkan terminal (+) Dioda Bridge ke beban Resistor 1 kΩ atas, dan terminal (-) Dioda Bridge ke sisi bawah Resistor 1 kΩ.',
          'Pasang probe CH1 pada masukan AC, dan pasang probe CH2 serta DC Volt Meter paralel beban Resistor.',
          'Nyalakan trainer. Amati gelombang penyearahan yang rapat (frekuensi 100 Hz, dua kali lipat CH1) dan catat nilai Vdc (~10-12V DC).',
        ],
      },
      {
        sectionTitle: 'Tahap 2: Pengamatan dengan Filter Kapasitor Saja',
        steps: [
          'Matikan trainer.',
          'Hubungkan Elco 1000 µF secara paralel dengan beban Resistor (perhatikan polaritas + dan -).',
          'Nyalakan trainer. Amati bentuk gelombang riak dan catat nilai Vdc serta Vripple(p-p).',
          'Ulangi dengan kapasitor 2200 µF untuk mengamati tegangan semakin mendekati garis lurus.',
        ],
      },
      {
        sectionTitle: 'Tahap 3: Pengamatan dengan Filter LC (Induktor 0.2 mH + Kapasitor 2200 µF)',
        steps: [
          'Matikan trainer. Masukkan Induktor 0.2 mH secara seri (arus dari (+) dioda -> Induktor -> Beban).',
          'Pasang Kapasitor 2200 µF paralel tepat pada beban setelah Induktor.',
          'Nyalakan trainer. Bandingkan kestabilan garis pada CH2 dan catat nilai Vdc akhir.',
        ],
      },
    ],
    analysis: [
      'Mengapa frekuensi gelombang keluaran (CH2) Full-Wave terlihat 2x lebih rapat dibanding Half-Wave?',
      'Analisislah mengapa dengan nilai kapasitor yang sama (1000 µF), Full-Wave menghasilkan ripple jauh lebih kecil dari Half-Wave.',
      'Bagaimana pengaruh Induktor dalam meredam perubahan arus mendadak saat transisi puncak gelombang?',
    ],
    tasks: [
      'Analisislah jalur arus menggunakan hukum Kirchhoff (KVL) saat siklus AC sedang berada di fasa negatif.',
      'Evaluasi performa filter kapasitor bila beban diganti resistansi sangat rendah (arus besar).',
      'Rancanglah sebuah skema filter bertingkat Pi-Filter (C-L-C) menggunakan komponen trainer ini.',
    ],
    pdfFileName: 'FULL_WAVE_6159227f.pdf',
    pdfDownloadPath: `${assetBase}assets/aistudio/FULL_WAVE_6159227f.pdf`,
    wires: [
      { id: 'w_js2_1', from: 'socket_ac_0', to: 'trafo_pri_0', color: 'black' },
      { id: 'w_js2_2', from: 'socket_ac_220', to: 'trafo_pri_220', color: 'red' },
      { id: 'w_js2_3', from: 'trafo_sec_12_l', to: 'bridge_ac_top', color: 'yellow' },
      { id: 'w_js2_4', from: 'trafo_ct', to: 'bridge_ac_bot', color: 'blue' },
      { id: 'w_js2_5', from: 'bridge_plus', to: 'rect_full_l02_1', color: 'red' },
      { id: 'w_js2_6', from: 'rect_full_l02_2', to: 'rect_full_c2200_pos', color: 'red' },
      { id: 'w_js2_7', from: 'bridge_minus', to: 'rect_full_c2200_neg', color: 'black' },
      { id: 'w_js2_8', from: 'rect_full_c2200_pos', to: 'rect_full_r1k_top', color: 'red' },
      { id: 'w_js2_9', from: 'rect_full_c2200_neg', to: 'rect_full_r1k_bot', color: 'black' },
      { id: 'w_js2_10', from: 'rect_full_r1k_top', to: 'dc_volt_pos', color: 'red' },
      { id: 'w_js2_11', from: 'rect_full_r1k_bot', to: 'dc_volt_0', color: 'black' },
    ],
    defaultMains: true,
    defaultDcSupply: false,
    expectedResults: {
      dcVoltage: '~15.0 V DC konstan',
      acVoltage: '0.0 V (DC Mode)',
      lampStatus: 'Mati',
      waveformDesc: 'Tegangan DC sangat rata dengan frekuensi riak dasar 100 Hz teredam optimal',
    },
  },

  // ==========================================
  // JOBSHEET 3: INVERTER TRANSISTOR NPN
  // ==========================================
  {
    id: 'jobsheet_3_inverter_npn',
    number: 3,
    title: 'Inverter Transistor NPN',
    subtitle: 'Mata Kuliah Elektronika Daya — S1 Pendidikan Teknik Elektro UM',
    objective: [
      'Mahasiswa mampu memahami prinsip dasar konversi listrik arus searah (DC) menjadi arus bolak-balik (AC) menggunakan komponen switching.',
      'Mahasiswa mampu merangkai dan menguji inverter sederhana topologi Push-Pull menggunakan transistor NPN dan Center Tap (CT) Transformer.',
      'Mahasiswa mampu menganalisis peran transistor sebagai saklar elektronik berkecepatan tinggi.',
    ],
    theory:
      'Inverter adalah kebalikan dari rectifier: mengubah tegangan DC (misal dari baterai atau Catu Daya 12V) menjadi tegangan AC 220V. Pada topologi dasar Push-Pull menggunakan trafo CT, dua buah transistor NPN berfungsi sebagai saklar elektronik yang menyala secara bergantian (flip-flop / osilasi astabil). Transistor NPN berada pada kondisi saturasi (ON) apabila basisnya mendapat tegangan bias positif yang cukup terhadap emitor. Ketika dua NPN di-ON-OFF-kan bergantian, arus DC mengalir bolak-balik melalui kumparan primer trafo CT. Induksi elektromagnetik dinaikkan (step-up) oleh lilitan trafo menjadi tegangan AC 220V yang mampu menyalakan lampu pijar AC.',
    materials: [
      'Power Supply DC 12V (terdapat pada panel trainer)',
      'Blok Inverter NPN (berisi 2 Transistor NPN dan Resistor Basis 330 Ω)',
      'Transformer (Trafo Step-Up menggunakan jalur CT - 12V - 12V dan keluaran 0 - 220V)',
      'Modul Load (Lampu) dan AC Volt Meter',
      'Kabel Jumper secukupnya',
    ],
    k3: [
      'PERINGATAN TEGANGAN TINGGI: Sisi keluaran trafo (0 - 220) menghasilkan listrik bertegangan tinggi 220V yang mematikan. Dilarang menyentuh terminal ini atau terminal fitting lampu saat sumber DC dinyalakan!',
      'Pastikan rangkaian pada sisi transistor dan trafo 12V sudah benar sebelum menyalakan Power Supply DC 12V.',
      'Kesalahan wiring Push-Pull dapat menyebabkan short circuit yang membakar transistor.',
    ],
    procedure: [
      {
        sectionTitle: 'Langkah Kerja Rangkaian Inverter NPN',
        steps: [
          'Pastikan Power Supply DC 12V dalam keadaan OFF.',
          'Hubungkan terminal Emitor (E) dari kedua transistor NPN ke terminal Negatif (-) / Ground dari Power Supply 12V DC (jumper kedua emitor ke minus).',
          'Hubungkan terminal Kolektor (C) Transistor NPN 1 ke sisi 12V Trafo bagian atas, dan Kolektor NPN 2 ke sisi 12V Trafo bagian bawah.',
          'Hubungkan pin CT (Center Tap) dari trafo langsung ke terminal Positif (+) Power Supply 12V DC.',
          'Berikan sinyal pemicu osilasi: Hubungkan Resistor 330 Ω silang (cross-coupling): Kolektor NPN 1 ke Resistor 1 lalu ke Basis NPN 2, dan Kolektor NPN 2 ke Resistor 2 lalu ke Basis NPN 1.',
          'Pada sisi sekunder trafo (tegangan tinggi), hubungkan terminal 0 dan 220 ke blok Load (lampu pijar).',
          'Paralelkan blok keluaran 0-220V tersebut dengan AC Volt Meter.',
          'Nyalakan saklar Power Supply DC 12V. Amati lampu pijar MENYALA TERANG dan AC Volt Meter membaca tegangan keluaran ~220V AC!',
        ],
      },
    ],
    analysis: [
      'Hubungan antara tegangan input DC 12V dengan tegangan output AC yang dihasilkan. Apakah mencapai 220V secara penuh? Jika tidak, jelaskan faktor kerugiannya (losses).',
      'Fungsi dari Resistor 330 Ω pada terminal Basis transistor dalam mekanisme umpan balik osilasi.',
    ],
    tasks: [
      'Analisislah gelombang yang dihasilkan oleh inverter jenis push-pull transistor dasar ini. Mengapa berbentuk Modified Square Wave bukan Pure Sine Wave?',
      'Evaluasi parameter pada transistor NPN (VCE(sat) dan Switching Time) yang menyebabkan tingginya rugi-rugi daya switching.',
      'Rancanglah sebuah sistem umpan balik (feedback loop) teoritis menggunakan mikrokontroler (misal ESP32) untuk mengatur PWM pada basis transistor!',
    ],
    pdfFileName: 'TRANS_NPN_2ed83184.pdf',
    pdfDownloadPath: `${assetBase}assets/aistudio/TRANS_NPN_2ed83184.pdf`,
    wires: [
      // 1. DC 12V ke CT (+) dan Emitor NPN (-)
      { id: 'w_js3_1', from: 'ps_dc12_pos', to: 'trafo_ct', color: 'red' },
      { id: 'w_js3_2', from: 'ps_dc12_neg', to: 'inv_npn1_e', color: 'black' },
      { id: 'w_js3_3', from: 'inv_npn1_e', to: 'inv_npn2_e', color: 'black' },

      // 2. Kolektor NPN ke Tap 12V Trafo
      { id: 'w_js3_4', from: 'inv_npn1_c', to: 'trafo_sec_12_l', color: 'red' },
      { id: 'w_js3_5', from: 'inv_npn2_c', to: 'trafo_sec_12_r', color: 'red' },

      // 3. Resistor Basis 330 Ω Cross-Coupled Triggering
      { id: 'w_js3_6', from: 'inv_npn1_c', to: 'inv_r330_1_l', color: 'yellow' },
      { id: 'w_js3_7', from: 'inv_r330_1_r', to: 'inv_npn2_b', color: 'yellow' },
      { id: 'w_js3_8', from: 'inv_npn2_c', to: 'inv_r330_2_l', color: 'yellow' },
      { id: 'w_js3_9', from: 'inv_r330_2_r', to: 'inv_npn1_b', color: 'yellow' },

      // 4. Keluaran Step-Up 0-220V ke Lampu dan AC Voltmeter
      { id: 'w_js3_10', from: 'trafo_pri_0', to: 'load_lamp_0', color: 'black' },
      { id: 'w_js3_11', from: 'trafo_pri_220', to: 'load_lamp_220', color: 'red' },
      { id: 'w_js3_12', from: 'load_lamp_0', to: 'ac_volt_0', color: 'black' },
      { id: 'w_js3_13', from: 'load_lamp_220', to: 'ac_volt_pos', color: 'red' },
    ],
    defaultMains: false,
    defaultDcSupply: true,
    expectedResults: {
      dcVoltage: '0.00 V (pada DC meter)',
      acVoltage: '220.0 V AC RMS',
      lampStatus: 'Menyala Sangat Terang (Daya AC 220V dari Inverter)',
      waveformDesc: 'Gelombang bolak-balik Inverter Quasi-Square 50 Hz dengan tegangan step-up 220V RMS',
    },
  },

  // ==========================================
  // JOBSHEET 4: INVERTER TRANSISTOR PNP
  // ==========================================
  {
    id: 'jobsheet_4_inverter_pnp',
    number: 4,
    title: 'Inverter Transistor PNP',
    subtitle: 'Mata Kuliah Elektronika Daya — S1 Pendidikan Teknik Elektro UM',
    objective: [
      'Mahasiswa mampu merangkai inverter menggunakan topologi transistor tipe PNP.',
      'Mahasiswa mampu membandingkan karakteristik dan aliran arus rangkaian inverter PNP dengan NPN.',
      'Mahasiswa mampu menganalisis kelebihan dan kekurangan dari setiap konfigurasi transistor dalam aplikasi elektronika daya.',
    ],
    theory:
      'Berbeda dengan NPN, transistor PNP mengalirkan arus utama dari Emitor (E) menuju Kolektor (C). Untuk mengaktifkan transistor PNP (kondisi saturasi/ON), terminal Basis (B) harus dibuat lebih negatif dibandingkan tegangan pada Emitor. Dalam topologi inverter menggunakan PNP, common yang digunakan berbalik dengan NPN: Emitor dihubungkan ke sumber tegangan positif (+), sedangkan Center Tap (CT) trafo dihubungkan ke ground / negatif (-). Prinsip induksi transformator tetap sama, yaitu menaikkan tegangan pulsa bolak-balik primer menjadi keluaran AC 220V.',
    materials: [
      'Power Supply DC 12V',
      'Blok Inverter PNP (berisi 2 Transistor PNP dan Resistor Basis 330 Ω)',
      'Trafo Step-Up (CT - 12V - 12V dan keluaran 0 - 220V)',
      'Modul Load & AC Volt Meter',
      'Kabel Jumper secukupnya',
    ],
    k3: [
      'PERINGATAN TEGANGAN TINGGI: Sisi keluaran trafo (0 - 220) menghasilkan tegangan tinggi 220V AC. Dilarang menyentuh terminal ini saat trainer menyala!',
      'Pastikan rangkaian pada sisi transistor dan trafo 12V sudah benar sebelum menyalakan Power Supply DC 12V.',
      'Matikan saklar sumber DC segera setelah pengambilan data selesai agar transistor tidak mengalami panas berlebih (overheating).',
    ],
    procedure: [
      {
        sectionTitle: 'Langkah Kerja Rangkaian Inverter PNP',
        steps: [
          'Pastikan tegangan sumber DC OFF.',
          'Hubungkan terminal Emitor (E) dari kedua transistor PNP secara bersamaan ke terminal Positif (+) Power Supply 12V DC.',
          'Hubungkan terminal pin CT Trafo ke terminal Negatif (-) / Ground Power Supply 12V DC.',
          'Hubungkan terminal Kolektor (C) Transistor PNP 1 ke sisi 12V Trafo atas, dan PNP 2 ke sisi 12V Trafo bawah.',
          'Berikan sinyal pemicuan osilasi ke terminal Basis (B) melalui Resistor 330 Ω (cross-coupled dengan polaritas pemicu relatif terhadap supply).',
          'Sambungkan sisi tegangan tinggi trafo (0-220) ke fitting lampu dan AC Volt Meter.',
          'Nyalakan saklar Power Supply DC 12V, amati intensitas cahaya lampu menyala terang dan catat angka pada AC Volt Meter (~220V AC).',
          'Matikan saklar setelah data diperoleh.',
        ],
      },
    ],
    analysis: [
      'Perbedaan spesifik cara pemasangan sumber daya (VCC dan Ground) pada rangkaian CT Inverter NPN dibandingkan dengan PNP.',
      'Perbandingan nilai tegangan keluaran AC antara modul PNP dan NPN. Apakah identik? Jika ada deviasi, jabarkan alasannya.',
    ],
    tasks: [
      'Pada datasheet transistor BJT, mengapa tipe NPN memiliki kemampuan arus dan switching lebih tinggi dibanding pasangannya PNP (mobilitas elektron vs hole)?',
      'Mengapa di industri saklar Low-Side (NPN / N-MOSFET) lebih dominan dibanding High-Side (PNP / P-MOSFET)?',
      'Rancanglah skema topologi Full-Bridge Inverter (H-Bridge tanpa trafo CT) yang mengombinasikan 2 NPN dan 2 PNP serta jelaskan proteksi Dead-Time.',
    ],
    pdfFileName: 'TRANS_PNP_04a81c58.pdf',
    pdfDownloadPath: `${assetBase}assets/aistudio/TRANS_PNP_04a81c58.pdf`,
    wires: [
      // 1. DC 12V ke Emitor PNP (+) dan CT (-)
      { id: 'w_js4_1', from: 'ps_dc12_pos', to: 'inv_pnp1_e', color: 'red' },
      { id: 'w_js4_2', from: 'inv_pnp1_e', to: 'inv_pnp2_e', color: 'red' },
      { id: 'w_js4_3', from: 'ps_dc12_neg', to: 'trafo_ct', color: 'black' },

      // 2. Kolektor PNP ke Tap 12V Trafo
      { id: 'w_js4_4', from: 'inv_pnp1_c', to: 'trafo_sec_12_l', color: 'blue' },
      { id: 'w_js4_5', from: 'inv_pnp2_c', to: 'trafo_sec_12_r', color: 'blue' },

      // 3. Resistor Basis 330 Ω Cross-Coupled Triggering
      { id: 'w_js4_6', from: 'inv_pnp1_c', to: 'inv_pnp_r330_1_l', color: 'green' },
      { id: 'w_js4_7', from: 'inv_pnp_r330_1_r', to: 'inv_pnp2_b', color: 'green' },
      { id: 'w_js4_8', from: 'inv_pnp2_c', to: 'inv_pnp_r330_2_l', color: 'green' },
      { id: 'w_js4_9', from: 'inv_pnp_r330_2_r', to: 'inv_pnp1_b', color: 'green' },

      // 4. Keluaran Step-Up 0-220V ke Lampu dan AC Voltmeter
      { id: 'w_js4_10', from: 'trafo_pri_0', to: 'load_lamp_0', color: 'black' },
      { id: 'w_js4_11', from: 'trafo_pri_220', to: 'load_lamp_220', color: 'red' },
      { id: 'w_js4_12', from: 'load_lamp_0', to: 'ac_volt_0', color: 'black' },
      { id: 'w_js4_13', from: 'load_lamp_220', to: 'ac_volt_pos', color: 'red' },
    ],
    defaultMains: false,
    defaultDcSupply: true,
    expectedResults: {
      dcVoltage: '0.00 V (pada DC meter)',
      acVoltage: '220.0 V AC RMS',
      lampStatus: 'Menyala Sangat Terang (Daya AC 220V dari Inverter PNP)',
      waveformDesc: 'Gelombang bolak-balik Inverter Quasi-Square 50 Hz dengan tegangan step-up 220V RMS',
    },
  },
];
