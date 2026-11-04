import React, { useState } from 'react';
import { EXPERIMENTS, Experiment } from '../simulation/experiments';
import { SimulationResults } from '../simulation/circuitLogic';
import {
  BookOpen,
  CheckCircle,
  Play,
  X,
  PlusCircle,
  Trash2,
  FileText,
  AlertTriangle,
  Download,
  ShieldAlert,
  HelpCircle,
  Wrench,
} from 'lucide-react';

interface ExperimentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExperiment: (exp: Experiment) => void;
  currentResults: SimulationResults;
}

interface MeasurementRecord {
  id: string;
  timestamp: string;
  expNumber: number;
  expTitle: string;
  dcVoltage: number;
  acVoltage: number;
  lampVoltage: number;
}

export const ExperimentGuideModal: React.FC<ExperimentGuideModalProps> = ({
  isOpen,
  onClose,
  onLoadExperiment,
  currentResults,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>(EXPERIMENTS[0].id);
  const [records, setRecords] = useState<MeasurementRecord[]>([]);

  if (!isOpen) return null;

  const currentExp = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];

  const handleRecordMeasurement = () => {
    const newRecord: MeasurementRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('id-ID'),
      expNumber: currentExp.number,
      expTitle: currentExp.title,
      dcVoltage: currentResults.dcMeterReading,
      acVoltage: currentResults.acMeterReading,
      lampVoltage: currentResults.lampVoltage,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleClearRecords = () => {
    setRecords([]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 py-3.5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950 border border-blue-700/60 text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="guide-title" className="text-sm sm:text-base font-black tracking-wide text-white">
                Buku Panduan &amp; Jobsheet Praktikum Elektronika Daya
              </h2>
              <p className="text-[11px] text-neutral-400">
                Departemen Teknik Elektro &amp; Informatika — Universitas Negeri Malang
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Panduan Praktikum"
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Layout: Left Nav List + Right Detailed View */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Sidebar: 4 Official Jobsheets */}
          <div className="md:col-span-4 border-r border-neutral-800 bg-neutral-950/70 p-3 overflow-y-auto space-y-2">
            <div className="px-2 pt-1 pb-1">
              <span className="text-[10px] font-black tracking-wider uppercase text-neutral-400">
                Pilih Jobsheet Praktikum (4 Modul)
              </span>
            </div>
            {EXPERIMENTS.map((exp) => {
              const isSelected = exp.id === selectedExpId;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`w-full text-left rounded-lg p-3 transition-all text-xs cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-md'
                      : 'text-neutral-300 bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] tracking-wide uppercase">
                      Jobsheet #{exp.number}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isSelected
                          ? 'bg-blue-800/70 text-blue-100'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {exp.wires.length} kabel
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-semibold leading-snug line-clamp-2">
                    {exp.title}
                  </div>
                </button>
              );
            })}

            {/* Academic Information Card */}
            <div className="mt-4 rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-3 text-[11px] text-neutral-400 space-y-1">
              <p className="font-bold text-neutral-300">Tim Penyusun Trainer:</p>
              <p className="text-[10px] leading-relaxed text-neutral-400">
                • Jefri Khoirur Umam<br />
                • Muhammad Dani Aulia
              </p>
              <p className="pt-1 text-[10px] text-neutral-400">
                <span className="font-semibold text-neutral-300">Dosen Pembimbing:</span><br />
                Nurul Laili Sa&apos;adah
              </p>
            </div>
          </div>

          {/* Right Main Pane: Active Jobsheet Details */}
          <div className="md:col-span-8 p-5 sm:p-6 overflow-y-auto space-y-6 bg-neutral-900">
            {/* Header Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <span className="inline-block rounded bg-blue-900/70 text-blue-300 border border-blue-700/50 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
                  JOBSHEET {currentExp.number}
                </span>
                <h3 className="mt-1.5 text-base sm:text-lg font-black text-white leading-snug">
                  {currentExp.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{currentExp.subtitle}</p>
              </div>

              {/* Action Buttons: Auto-Wire + Download PDF */}
              <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onLoadExperiment(currentExp);
                    onClose();
                  }}
                  className="flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950 hover:bg-emerald-500 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  <span>Pasang Rangkaian (Auto-Wire)</span>
                </button>

                <a
                  href={currentExp.pdfDownloadPath}
                  download={currentExp.pdfFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 rounded-lg border border-neutral-700 bg-neutral-800/90 px-3 py-1.5 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Unduh PDF Asli</span>
                </a>
              </div>
            </div>

            {/* A. TUJUAN PRAKTIKUM */}
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>A. Tujuan Praktikum</span>
              </h4>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs text-neutral-300">
                {currentExp.objective.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold text-blue-400">{i + 1}.</span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B. LANDASAN TEORI */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>B. Landasan Teori</span>
              </h4>
              <div className="mt-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs leading-relaxed text-neutral-300">
                {currentExp.theory}
              </div>
            </div>

            {/* C. ALAT DAN BAHAN */}
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Wrench className="h-4 w-4" />
                <span>C. Alat dan Bahan</span>
              </h4>
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs text-neutral-300">
                {currentExp.materials.map((mat, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* D. KESELAMATAN KERJA (K3) */}
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4" />
                <span>D. K3 Dalam Praktikum</span>
              </h4>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-red-900/50 bg-red-950/20 p-3.5 text-xs text-red-200">
                {currentExp.k3.map((rule, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* E. PROSEDUR PRAKTIKUM */}
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Play className="h-4 w-4" />
                <span>E. Prosedur Praktikum (Langkah Kerja)</span>
              </h4>
              <div className="mt-2 space-y-3">
                {currentExp.procedure.map((sec, secIdx) => (
                  <div
                    key={secIdx}
                    className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-2"
                  >
                    {sec.sectionTitle && (
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-cyan-300 border-b border-neutral-800 pb-1">
                        {sec.sectionTitle}
                      </h5>
                    )}
                    <ol className="space-y-1.5 text-xs text-neutral-300">
                      {sec.steps.map((step, stpIdx) => (
                        <li key={stpIdx} className="flex items-start space-x-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-bold text-neutral-300">
                            {stpIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* F & G. INDIKATOR HASIL PRAKTIKUM */}
            <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span>Indikator Hasil Teori &amp; Simulasi yang Diharapkan:</span>
              </h4>
              <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Tegangan DC:</span>
                  <span className="font-bold text-emerald-400 text-sm">{currentExp.expectedResults.dcVoltage}</span>
                </div>
                <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Tegangan AC:</span>
                  <span className="font-bold text-emerald-400 text-sm">{currentExp.expectedResults.acVoltage}</span>
                </div>
                <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Status Beban:</span>
                  <span className="font-bold text-amber-300 text-xs">{currentExp.expectedResults.lampStatus}</span>
                </div>
                <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Bentuk Gelombang:</span>
                  <span className="font-medium text-neutral-200 text-[11px] leading-tight block">
                    {currentExp.expectedResults.waveformDesc}
                  </span>
                </div>
              </div>
            </div>

            {/* H. ANALISIS DATA */}
            <div>
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="h-4 w-4" />
                <span>H. Analisis Praktikum</span>
              </h4>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs text-neutral-300">
                {currentExp.analysis.map((ana, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold text-purple-400">{i + 1}.</span>
                    <span className="leading-relaxed">{ana}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* J. TUGAS PRAKTIKUM */}
            <div>
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>J. Tugas Jobsheet</span>
              </h4>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs text-neutral-300">
                {currentExp.tasks.map((task, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold text-pink-400">{i + 1}.</span>
                    <span className="leading-relaxed">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Measurement Log Section (Student Lab Data Logger) */}
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                    Tabel Pengamatan Data Pengukuran Mandiri
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Catat pengukuran aktual instrumen saat rangkaian sedang beroperasi
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleRecordMeasurement}
                    className="flex items-center space-x-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Catat Data Saat Ini</span>
                  </button>
                  {records.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearRecords}
                      className="rounded bg-neutral-800 p-1.5 text-neutral-400 hover:text-red-400 cursor-pointer"
                      title="Hapus Semua Data"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {records.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-800 p-4 text-center text-xs text-neutral-500">
                  Belum ada data pengukuran yang dicatat. Klik &quot;Catat Data Saat Ini&quot; untuk menyimpan hasil praktikum dari instrumen volt meter dan beban.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-neutral-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-950 text-[11px] text-neutral-400">
                      <tr>
                        <th className="p-2">Waktu</th>
                        <th className="p-2">Percobaan</th>
                        <th className="p-2 text-right">DC Volt</th>
                        <th className="p-2 text-right">AC Volt</th>
                        <th className="p-2 text-right">Tegangan Beban</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {records.map((r) => (
                        <tr key={r.id} className="hover:bg-neutral-800/40">
                          <td className="p-2 text-neutral-400">{r.timestamp}</td>
                          <td className="p-2 font-sans font-medium text-white">#{r.expNumber} {r.expTitle}</td>
                          <td className="p-2 text-right text-emerald-400 font-bold">{r.dcVoltage.toFixed(2)} V</td>
                          <td className="p-2 text-right text-emerald-400 font-bold">{r.acVoltage.toFixed(1)} V</td>
                          <td className="p-2 text-right text-amber-300">{r.lampVoltage.toFixed(1)} V</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
