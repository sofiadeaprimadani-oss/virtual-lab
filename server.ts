import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

// Helper for comprehensive electrical engineering diagnostic rules
function getExpertCircuitDiagnosis(circuitState: any, userQuery?: string): string {
  const wires = circuitState?.wires || [];
  const mains = circuitState?.mainsPower;
  const dcPower = circuitState?.dcSupplyPower;
  const dcV = circuitState?.dcMeterReading ?? 0;
  const acV = circuitState?.acMeterReading ?? 0;
  const lampV = circuitState?.lampVoltage ?? 0;
  const isTrafo = circuitState?.isTrafoEnergized;
  const isBridge = circuitState?.isBridgeRectifying;

  if (wires.length === 0) {
    return `🔍 **Diagnosa Rangkaian:**
Papan trainer masih kosong (belum ada kabel jumper banana jack yang terpasang).

💡 **Penyebab Fisis:**
Komponen belum terhubung ke sumber daya apapun (loop tertutup belum terbentuk).

🛠️ **Solusi Perbaikan:**
1. Pasang kabel dari **Socket AC 220** (terminal 0 dan 220) ke **Transformator Primer** (terminal 0 dan 220).
2. Atau gunakan tombol **"Panduan Praktikum"** di toolbar atas lalu klik **"Pasang Rangkaian Otomatis (Auto-Wire)"** untuk memuat rangkaian percobaan siap uji.`;
  }

  const issues: string[] = [];
  const solutions: string[] = [];

  // Trafo check
  const hasTrafoPri = wires.some((w: any) => w.from.includes('trafo_pri') || w.to.includes('trafo_pri'));
  if (hasTrafoPri && !mains) {
    issues.push('Transformator primer sudah terhubung ke Socket AC, namun saklar **AC 220V** masih dalam posisi **OFF**.');
    solutions.push('Tekan tombol **"AC 220V ON"** di modul Socket AC atau toolbar atas.');
  }

  // Voltmeter check
  const hasDcMeter = wires.some((w: any) => w.from.includes('dc_volt') || w.to.includes('dc_volt'));
  if (hasDcMeter && dcV === 0) {
    issues.push('DC Volt Meter terhubung kabel tetapi nilai terbaca **0.0 V**.');
    solutions.push('Pastikan terminal **0 (COM)** dan **220 (V DC)** dihubungkan ke kutub potensial berbeda (misalnya keluaran (+) dan (-) Dioda Bridge atau Catu Daya DC 12V).');
  }

  // Load check
  const hasLamp = wires.some((w: any) => w.from.includes('load_lamp') || w.to.includes('load_lamp'));
  if (hasLamp && lampV === 0) {
    issues.push('Beban Lampu terhubung tetapi tidak menyala (tegangan beban 0.0 V).');
    solutions.push('Periksa jalur netral/ground. Lampu membutuhkan loop tertutup antara sumber fasa/positif ke terminal 220 lampu dan netral/negatif ke terminal 0 lampu.');
  }

  if (issues.length > 0) {
    return `🔍 **Hasil Diagnosa Rangkaian:**
${issues.map((iss, i) => `${i + 1}. ${iss}`).join('\n')}

💡 **Analisis Fisis:**
Arus listrik hanya dapat mengalir pada loop tertutup (*closed loop circuit*) dengan beda potensial yang cukup untuk mengatasi tegangan ambang komponen.

🛠️ **Langkah Solusi:**
${solutions.map((sol, i) => `${i + 1}. ${sol}`).join('\n')}`;
  }

  return `✅ **Status Rangkaian Normal:**
Rangkaian virtual Anda telah tersambung dengan benar dan beroperasi!
- **Tegangan DC Terukur:** ${dcV} V
- **Tegangan AC Terukur:** ${acV} V
- **Tegangan Lampu Beban:** ${lampV} V (${lampV > 0 ? 'Menyala Berpijar' : 'Mati / Belum Dihubungkan'})
- **Transformator Step-Down:** ${isTrafo ? 'Aktif Menginduksi Tegangan Sekunder' : 'Non-aktif'}
- **Penyearah Dioda Bridge:** ${isBridge ? 'Menyearahkan Gelombang Penuh' : 'Non-aktif'}

${userQuery ? `Terkait pertanyaan Anda: *"${userQuery}"*:\nUntuk penyearahan gelombang penuh, pastikan input AC (simbol ~) terhubung ke sekunder trafo, dan output (+ dan -) dihubungkan ke filter kapasitor atau beban resistor.` : ''}`;
}

// AI Troubleshooting endpoint
app.post('/api/ai/troubleshoot', async (req, res) => {
  const { circuitState, query } = req.body;

  // Try calling Gemini API if apiKey is configured and valid
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5;

  if (isKeyConfigured) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Anda adalah Asisten Pakar Troubleshooting Elektronika Daya & Laboratorium Trainer Inverter & Rectifier di Universitas Negeri Malang.
Berikan diagnosa kesalahan pengkabelan, penjelasan fisis, dan solusi konkret step-by-step dalam bahasa Indonesia yang ramah dan mendidik.`;

      const wiresList = (circuitState?.wires || [])
        .map((w: any, idx: number) => `  ${idx + 1}. [Kabel ${w.color}] Dari '${w.from}' ke '${w.to}'`)
        .join('\n');

      const prompt = `Status Rangkaian Virtual Trainer Mahasiswa:
- Saklar AC 220V: ${circuitState?.mainsPower ? 'ON' : 'OFF'}
- Saklar DC 12V: ${circuitState?.dcSupplyPower ? 'ON' : 'OFF'}
- Transformator Aktif: ${circuitState?.isTrafoEnergized ? 'YA' : 'TIDAK'}
- Penyearah Bridge: ${circuitState?.isBridgeRectifying ? 'YA' : 'TIDAK'}
- DC Volt Meter: ${circuitState?.dcMeterReading ?? 0} V
- AC Volt Meter: ${circuitState?.acMeterReading ?? 0} V
- Lampu Beban: ${circuitState?.lampVoltage ?? 0} V
- Total Kabel: ${circuitState?.wires?.length || 0}
- Konfigurasi Kabel:
${wiresList || '  (Belum ada kabel terpasang)'}

Pertanyaan Mahasiswa:
${query || 'Lakukan diagnosa komprehensif terhadap rangkaian saya saat ini.'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction },
      });

      if (response.text) {
        return res.json({ reply: response.text, success: true, aiPowered: true });
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, using expert circuit diagnosis fallback:', err?.message);
    }
  }

  // High-fidelity circuit diagnostic solver fallback
  const fallbackReply = getExpertCircuitDiagnosis(circuitState, query);
  res.json({ reply: fallbackReply, success: true, aiPowered: false });
});

// In development, mount Vite middleware to serve client SPA with SSR/HMR
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      port: 3000,
      host: '0.0.0.0',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
