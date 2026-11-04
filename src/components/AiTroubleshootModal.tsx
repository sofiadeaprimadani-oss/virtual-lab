import React, { useState } from 'react';
import { SimulationResults, SimulationState } from '../simulation/circuitLogic';
import { Bot, Sparkles, Send, X, AlertTriangle, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';

interface AiTroubleshootModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationState: SimulationState;
  simulationResults: SimulationResults;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isDiagnosis?: boolean;
}

// Built-in rule-based quick diagnostics for immediate offline feedback
function generateLocalDiagnostic(state: SimulationState, results: SimulationResults): string {
  const issues: string[] = [];
  const fixes: string[] = [];

  if (state.wires.length === 0) {
    return `🔍 **Diagnosa Masalah:**
Papan trainer masih dalam keadaan kosong (belum ada kabel jumper yang terhubung).

💡 **Penyebab:**
Komponen transformator, penyearah, dan alat ukur belum menerima pasokan energi listrik.

🛠️ **Langkah Solusi:**
1. Anda dapat memasang kabel secara manual dari terminal **Socket AC (0 dan 220)** ke **Transformator Primer (0 dan 220)**.
2. Atau buka menu **"Panduan Praktikum"** di bagian atas dan klik **"Pasang Rangkaian Otomatis (Auto-Wire)"** untuk memilih salah satu modul percobaan praktikum yang tersedia.`;
  }

  // Check if mains is off while trafo is connected
  const hasTrafoPriWiring = state.wires.some(w => w.from.includes('trafo_pri') || w.to.includes('trafo_pri'));
  if (hasTrafoPriWiring && !state.mainsPower) {
    issues.push('Kabel ke transformator primer sudah terpasang, namun saklar **AC 220V** masih dalam posisi MATI (OFF).');
    fixes.push('Nyalakan saklar **AC 220V ON** pada modul Socket AC atau toolbar atas.');
  }

  // Check if load lamp is wired to something but has 0V
  const hasLampWiring = state.wires.some(w => w.from.includes('load_lamp') || w.to.includes('load_lamp'));
  if (hasLampWiring && results.lampVoltage === 0) {
    issues.push('Beban lampu terhubung kabel tetapi tegangannya 0.0V sehingga filamen tidak berpijar.');
    fixes.push('Pastikan sumber daya (Catu Daya DC 12V atau output sekunder transformator) sudah dinyalakan dan kedua kutubnya (positif dan negatif/netral) tersambung lengkap ke terminal 0 dan 220 pada lampu.');
  }

  // Check if meters are reading 0
  const hasDcMeterWiring = state.wires.some(w => w.from.includes('dc_volt') || w.to.includes('dc_volt'));
  if (hasDcMeterWiring && results.dcMeterReading === 0) {
    issues.push('DC Volt Meter terhubung tetapi membaca 0.0 V.');
    fixes.push('Periksa apakah terminal 0 (COM) dan 220 (V DC) terhubung ke kutub beda potensial positif dan negatif dari penyearah atau catu daya.');
  }

  if (issues.length > 0) {
    return `🔍 **Diagnosa Masalah Rangkaian:**
${issues.map((iss, i) => `${i + 1}. ${iss}`).join('\n')}

🛠️ **Rekomendasi Langkah Perbaikan:**
${fixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}`;
  }

  return `✅ **Diagnosa Status Rangkaian:**
Rangkaian Anda saat ini beroperasi dengan normal!
- Tegangan DC Terukur: **${results.dcMeterReading} V**
- Tegangan AC Terukur: **${results.acMeterReading} V**
- Tegangan Lampu Beban: **${results.lampVoltage} V** (${results.lampVoltage > 0 ? 'Lampu Menyala' : 'Lampu Tidak Aktif'})
- Transformator: **${results.isTrafoEnergized ? 'Tereduksi Aktif' : 'Non-aktif'}**
- Penyearah Dioda Bridge: **${results.isBridgeRectifying ? 'Menyearahkan' : 'Non-aktif'}**

Jika Anda ingin menguji variasi lain (seperti menambahkan kapasitor filter atau induktor LC), Anda dapat membuka menu **Panduan Praktikum** atau mengajukan pertanyaan troubleshooting di bawah ini.`;
}

export const AiTroubleshootModal: React.FC<AiTroubleshootModalProps> = ({
  isOpen,
  onClose,
  simulationState,
  simulationResults,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya Asisten AI Troubleshooting Rangkaian Trainer Inverter & Rectifier. Ada kendala pada rangkaian praktikum Anda? Klik tombol "Diagnosa Rangkaian Sekarang" atau ketik pertanyaan Anda di bawah.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendTroubleshoot = async (customPrompt?: string) => {
    const queryText = (customPrompt || inputQuery).trim();
    if (!queryText && !customPrompt) return;

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: queryText || 'Lakukan diagnosa sirkuit saat ini.' },
    ];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call server-side Gemini API
      const res = await fetch('/api/ai/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuitState: {
            ...simulationState,
            ...simulationResults,
          },
          query: queryText,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, isDiagnosis: true },
        ]);
      } else {
        throw new Error('No reply from AI service');
      }
    } catch (err) {
      console.warn('Falling back to local circuit diagnosis:', err);
      // Fallback to rich deterministic local diagnostic engine
      const localAnalysis = generateLocalDiagnostic(simulationState, simulationResults);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: localAnalysis,
          isDiagnosis: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Kenapa lampu beban saya tidak menyala?',
    'Kenapa DC Volt Meter membaca 0.0V?',
    'Bagaimana cara menghubungkan Dioda Bridge yang benar?',
    'Mengapa tegangan output penyearah ada gelombang ripple?',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-troubleshoot-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 py-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 shadow-md text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="ai-troubleshoot-title" className="text-sm font-black tracking-wide text-white">
                  AI Circuit Troubleshooting &amp; Diagnostik
                </h2>
                <span className="flex items-center space-x-1 rounded-full bg-emerald-950 border border-emerald-600/50 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Gemini AI Siap</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Pemeriksaan kesalahan pengkabelan &amp; solusi praktikum virtual otomatis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Troubleshooting AI"
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Circuit Context Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950/70 px-5 py-2 text-[11px] font-mono">
          <div className="flex items-center space-x-3 text-neutral-300">
            <span>Kabel: <strong className="text-white">{simulationState.wires.length}</strong></span>
            <span>AC 220V: <strong className={simulationState.mainsPower ? 'text-red-400' : 'text-neutral-500'}>{simulationState.mainsPower ? 'ON' : 'OFF'}</strong></span>
            <span>DC 12V: <strong className={simulationState.dcSupplyPower ? 'text-emerald-400' : 'text-neutral-500'}>{simulationState.dcSupplyPower ? 'ON' : 'OFF'}</strong></span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400">DC: {simulationResults.dcMeterReading}V</span>
            <span className="text-sky-400">AC: {simulationResults.acMeterReading}V</span>
            <span className="text-amber-300">Lampu: {simulationResults.lampVoltage}V</span>
          </div>
        </div>

        {/* Action Button: One-Click Instant Diagnostics */}
        <div className="border-b border-neutral-800 bg-neutral-900/90 px-5 py-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSendTroubleshoot('Lakukan diagnosa komprehensif terhadap rangkaian saya saat ini. Apakah ada kesalahan pengkabelan, korsleting, atau komponen yang belum terhubung? Berikan solusi perbaikannya.')}
            disabled={isLoading}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-xs font-black text-white shadow-md hover:from-amber-600 hover:to-red-600 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Diagnosa Rangkaian Sekarang (AI Scan)</span>
          </button>

          <span className="text-[11px] text-neutral-400 hidden sm:inline">
            Menganalisis netlist sambungan &amp; polaritas komponen
          </span>
        </div>

        {/* Chat / Diagnostic Log Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-900/60 max-h-[48vh]">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-neutral-950 border border-neutral-800 rounded-xl p-3 max-w-[70%]">
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
              <span>AI sedang memeriksa simpul rangkaian &amp; menghitung aliran daya...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-neutral-800 bg-neutral-950/80 px-4 py-2 flex items-center space-x-1.5 overflow-x-auto">
          <HelpCircle className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <span className="text-[10px] text-neutral-400 shrink-0 mr-1">Tanya Cepat:</span>
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendTroubleshoot(q)}
              disabled={isLoading}
              className="shrink-0 rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-[11px] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendTroubleshoot();
          }}
          className="border-t border-neutral-800 bg-neutral-950 p-3 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Tanyakan masalah rangkaian atau ketik keluhan praktikum Anda..."
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            aria-label="Kirim pertanyaan troubleshooting"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
