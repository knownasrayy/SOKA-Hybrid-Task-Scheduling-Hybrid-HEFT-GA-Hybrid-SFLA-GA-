import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Server, Cpu, Clock, DollarSign, Shuffle } from 'lucide-react';

export const Slide03MasalahCloud: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="03 · FORMULASI MASALAH" color="yellow" />
          <span className="font-mono text-xs text-muted">Cloud Task Scheduling</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Penjadwalan Task di Cloud adalah Masalah <Highlight color="orange">NP-Hard</Highlight>.
        </h2>
        <p className="text-sm text-muted font-medium">
          Memetakan himpunan <span className="font-mono font-bold text-ink">n task</span> ke <span className="font-mono font-bold text-ink">m Virtual Machine (VM)</span> heterogen dengan dependensi data dan tujuan ganda (Makespan vs Biaya).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="Kompleksitas Solusi" badge="Search Space">
          <div className="p-3 bg-paper rounded-xl border border-line text-center my-2">
            <span className="font-mono text-2xl font-black text-hot">mⁿ Kemungkinan</span>
            <span className="block text-[11px] text-muted mt-1">Untuk 50 task & 4 VM = 4⁵⁰ ≈ 1.26 × 10³⁰ solusi!</span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Metode exhaustive search mustahil dilakukan dalam waktu polinomial. Dibutuhkan heuristik dan metaheuristik untuk menemukan solusi mendekati optimal.
          </p>
        </Card>

        <Card title="Trade-off QoS Bertolak Belakang" badge="Multi-Objektif">
          <div className="flex flex-col gap-2 my-2">
            <div className="flex items-center justify-between p-2 rounded bg-[#dbe7fb] border border-ink text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-heft" /> Makespan (Waktu Selesai)</span>
              <span>Minimalkan</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#ffe6cc] border border-ink text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-hot" /> Biaya Sewa VM ($)</span>
              <span>Minimalkan</span>
            </div>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            VM cepat (MIPS tinggi) memperpendek makespan tetapi biayanya mahal. VM lambat murah tetapi membuat bottleneck antrean task.
          </p>
        </Card>

        <Card title="Heterogenitas & Komunikasi" badge="Realitas Cloud">
          <div className="flex flex-col gap-1.5 my-2 font-mono text-xs">
            <div className="p-1.5 rounded bg-paper border border-line flex justify-between">
              <span>Transfer Data Inter-VM:</span>
              <span className="font-bold text-hot">Ada Latensi + Biaya</span>
            </div>
            <div className="p-1.5 rounded bg-paper border border-line flex justify-between">
              <span>Transfer Data Intra-VM:</span>
              <span className="font-bold text-safe">0s (Memory Bus / Gratis)</span>
            </div>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Penjadwal cerdas harus memperhitungkan clustering task yang saling bertukar data pada VM yang sama untuk menghemat transfer time.
          </p>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Tantangan Algoritma Tunggal:</strong> Heuristik murni greedy terjebak lokal optimum; Metaheuristik murni lambat konvergen di awal.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Solusi: Pendekatan Hybrid!</span>
      </div>
    </div>
  );
};
