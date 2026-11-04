import React from 'react';

export const BoardHeader: React.FC = () => {
  return (
    <header className="relative flex flex-col items-center justify-center border-b-2 border-neutral-800 bg-[#f4f2ea] px-6 py-5 select-none text-center">
      {/* Main Academic Title */}
      <h1 className="font-sans text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
        TRAINER INVERTER &amp; RECTIFIER
      </h1>
      
      {/* Academic Department & Program */}
      <p className="mt-1 text-[11px] font-bold tracking-wider text-neutral-800 uppercase sm:text-xs">
        Departemen Teknik Elektro dan Informatika Program Studi S1 Pendidikan Teknik Elektro
      </p>

      {/* Student Names & Faculty Advisor */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-neutral-800">
        <p>
          <span className="font-extrabold text-neutral-950">Mahasiswa:</span> Jefri Khoirur Umam, Muhammad Dani Aulia
        </p>
        <span className="hidden sm:inline text-neutral-400">•</span>
        <p>
          <span className="font-extrabold text-neutral-950">Dosen Pembimbing:</span> Nurul Laili Sa&apos;adah
        </p>
      </div>
    </header>
  );
};
