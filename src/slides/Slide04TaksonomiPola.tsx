import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';

export const Slide04TaksonomiPola: React.FC = () => {
  const patterns = [
    { code: 'Pola A', name: 'Heuristik + Heuristik', desc: 'Menggabungkan aturan greedy (contoh: RASA = Min-Min + Max-Min). Ringan tanpa populasi.', valid: false, note: 'Tidak Memenuhi Syarat Tugas' },
    { code: 'Pola B', name: 'Heuristik + Metaheuristik', desc: 'Seeding / Relay: Solusi heuristik disuntikkan menjadi populasi awal metaheuristik (HEFT → GA).', valid: true, note: 'Pilihan 1: Hybrid HEFT-GA' },
    { code: 'Pola C', name: 'Metaheuristik + Metaheuristik', desc: 'Teamwork / Co-evolution: Dua metaheuristik berkolaborasi (SFLA + GA operator dalam memeplex).', valid: true, note: 'Pilihan 2: Hybrid SFLA-GA' },
    { code: 'Pola D', name: 'Metaheuristik + Local Search', desc: 'Memetic Algorithm: Setiap individu keturunan diperbaiki dengan operator local search deterministik.', valid: true, note: 'Contoh: GA + Hill Climbing' },
    { code: 'Pola E', name: 'Hyper-Heuristic', desc: 'Level pembelajaran di atas heuristik (contoh: agen Q-learning memilih heuristik dinamis).', valid: true, note: 'Reinforcement Learning' }
  ];

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="04 · TAKSONOMI HYBRID" color="yellow" />
          <span className="font-mono text-xs text-muted">Klasifikasi Talbi & 5 Pola Dosen</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Memetakan <Highlight>Lima Pola Hybrid</Highlight> Penjadwalan Cloud.
        </h2>
        <p className="text-sm text-muted font-medium">
          Dosen mewajibkan pemilihan dari <span className="font-bold text-ink">Pola B–E</span>. Pola A tidak memenuhi syarat karena hanya menggabungkan dua heuristik tanpa eksplorasi metaheuristik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-auto">
        {patterns.map((p) => (
          <Card
            key={p.code}
            highlight={p.valid && (p.code === 'Pola B' || p.code === 'Pola C')}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border border-ink ${
                  p.valid ? 'bg-ink text-paper' : 'bg-red-100 text-bad border-bad'
                }`}>
                  {p.code}
                </span>
                {p.valid ? (
                  <span className="text-[10px] font-mono font-bold text-safe">VALID</span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-bad">INVALID</span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-ink mb-1">{p.name}</h4>
              <p className="text-[11px] text-[#555] leading-relaxed mb-3">{p.desc}</p>
            </div>

            <div className={`p-2 rounded-lg border text-[11px] font-mono font-bold ${
              p.code === 'Pola B' ? 'bg-[#dbe7fb] border-heft text-heft' :
              p.code === 'Pola C' ? 'bg-[#dcf3e1] border-sfla text-sfla' :
              'bg-paper border-line text-muted'
            }`}>
              {p.note}
            </div>
          </Card>
        ))}
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Justifikasi Kepatuhan:</strong> Proyek ini mengimplementasikan <strong className="text-heft">Pola B (HEFT-GA)</strong> dan <strong className="text-sfla">Pola C (SFLA-GA)</strong>, 100% mematuhi batas ketentuan tugas.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">100% Compliant</span>
      </div>
    </div>
  );
};
