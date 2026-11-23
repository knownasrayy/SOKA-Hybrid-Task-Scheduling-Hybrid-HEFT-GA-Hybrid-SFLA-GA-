import React from 'react';
import { Badge } from '../components/Badge';
import { Highlight } from '../components/Highlight';
import { Layers, Users, GraduationCap } from 'lucide-react';

export const Slide01Cover: React.FC = () => {
  const members = [
    { name: 'Rayhan Agnan Kusuma', nrp: '5027241102', role: 'Presenter' },
    { name: 'Ahmad Idza Anafin', nrp: '5027241017', role: 'Anggota' },
    { name: 'Andi Naufal Zaki', nrp: '5027241059', role: 'Anggota' },
    { name: 'Alnico Virendra Kitaro Diaz', nrp: 'Departemen TI', role: 'Anggota' },
    { name: 'Zidny Ilman Nafian', nrp: '5027221072', role: 'Anggota' }
  ];

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div className="flex items-center justify-between">
        <Badge label="SOKA · DEPARTEMEN TEKNOLOGI INFORMASI ITS" color="yellow" />
        <span className="font-mono text-xs font-bold text-muted uppercase">Tugas Minggu 13–14 · Kelompok 6 (Kelas C)</span>
      </div>

      <div className="max-w-4xl my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-ink text-xs font-mono font-bold mb-4">
          <Layers className="w-3.5 h-3.5 text-its-blue" />
          <span>Presentasi Web Interaktif Algoritma Hybrid</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink leading-tight tracking-tight mb-3 sm:mb-4">
          Hybrid <Highlight color="blue">HEFT-GA</Highlight> vs Hybrid <Highlight color="green">SFLA-GA</Highlight> untuk Cloud Task Scheduling.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted font-medium leading-relaxed max-w-2xl mb-4 sm:mb-6">
          Eksplorasi mendalam, simulasi berbasis browser tanpa hardcode, penentuan pemenang berbasis data, dan perbandingan 3 arah dengan baseline.
        </p>

        {/* Group Members Grid */}
        <div className="pt-4 border-t border-its-blue/15">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-its-navy uppercase tracking-wider">
              <Users className="w-4 h-4 text-its-blue" />
              <span>Tim Penyusun · Kelompok 6 (Kelas C)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-its-silver">
              <GraduationCap className="w-3.5 h-3.5 text-its-gold" />
              <span>Dosen Pengampu: Henning Titi Ciptaningtyas, S.Kom, M.Kom.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono text-xs">
            {members.map((m) => (
              <div
                key={m.name}
                className="p-2.5 rounded-xl bg-white/95 border border-its-blue/20 shadow-sm flex flex-col justify-between hover:border-its-blue/50 transition-all"
              >
                <div>
                  <span className="text-[10px] text-its-silver uppercase tracking-wider font-semibold block mb-0.5">
                    {m.role}
                  </span>
                  <span className="font-extrabold text-its-navy text-xs leading-tight block truncate" title={m.name}>
                    {m.name}
                  </span>
                </div>
                <span className="text-[11px] text-its-blue font-bold mt-1.5 block">
                  {m.nrp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-line text-xs font-mono text-muted">
        <span>Tekan <kbd className="px-2 py-0.5 rounded bg-white border border-ink font-bold text-ink">Spasi</kbd> atau <kbd className="px-2 py-0.5 rounded bg-white border border-ink font-bold text-ink">→</kbd> untuk mulai</span>
        <span>Demo 1 (Minggu 13) & Demo 2 (Minggu 14)</span>
      </div>
    </div>
  );
};
