import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Citation } from '../components/Citation';

export const Slide15SflaGaSpec: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="15 · SPESIFIKASI SFLA-GA" color="green" />
          <Citation id="kayalvili2019" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Pseudocode, Diagram Alur, & Parameter SFLA-GA.
        </h2>
        <p className="text-sm text-muted font-medium">
          Mengacu langsung pada paper Kayalvili & Selvam (2019) di <em>Cluster Computing</em>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Pseudocode Viewer */}
        <Card title="Pseudocode Algoritma Hybrid SFLA-GA" badge="Paper Fig. 3 Flowchart">
          <div className="bg-paper p-3 rounded-xl border border-line font-mono text-[11px] text-ink leading-relaxed overflow-x-auto">
            <div className="text-muted">// 1. Inisialisasi Populasi Katak</div>
            <div>Frogs ← Generate_Random_Frogs(F=24, dim=n)</div>
            <div>Evaluate_Fitness(Frogs)</div>
            <div className="text-muted mt-1">// 2. Siklus SFLA Luar</div>
            <div>While evaluations &lt; Evaluation_Budget do:</div>
            <div className="pl-4">Sort_Descending_By_Fitness(Frogs)</div>
            <div className="pl-4">Memeplexes ← Partition_Modulo(Frogs, m=4)</div>
            <div className="text-muted pl-4 mt-0.5">// 3. Evolusi Lokal GA dalam Memeplex</div>
            <div className="pl-4">For each memeplex in Memeplexes do:</div>
            <div className="pl-8">For step = 1 to N_local_ga (4) do:</div>
            <div className="pl-12">P1, P2 ← Select_Parents(memeplex)</div>
            <div className="pl-12">C1, C2 ← Two_Point_Crossover(P1, P2, pc=0.8)</div>
            <div className="pl-12">Mutate(C1, pm=0.12); Mutate(C2, pm=0.12)</div>
            <div className="pl-12">Replace_Worst_If_Better(memeplex, C1, C2)</div>
            <div className="text-muted pl-4 mt-0.5">// 4. Global Shuffling</div>
            <div className="pl-4">Frogs ← Pool_And_Shuffle(Memeplexes)</div>
            <div>Return Best_Frog (Schedule)</div>
          </div>
        </Card>

        {/* Parameter & Flow Overview */}
        <div className="flex flex-col gap-3">
          <Card title="Representasi Biner / Integer Solusi" badge="Seksi 3.4 Paper">
            <p className="text-xs text-[#444] leading-relaxed mb-2">
              Setiap katak merepresentasikan pemetaan tugas ke VM. Pada implementasi diskrit cloud, gen ke-i berisi indeks VM alokasi untuk Task i.
            </p>
            <div className="p-2 bg-paper rounded border border-line font-mono text-xs text-center text-ink font-bold">
              [ VM-1, VM-3, VM-2, VM-4, VM-1, ... ] (Panjang = n task)
            </div>
          </Card>

          <Card title="Parameter Eksperimen SFLA-GA" badge="Tabel Parameter">
            <table className="w-full text-left font-mono text-xs">
              <tbody>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Jumlah Katak (F)</td>
                  <td className="py-1 font-bold text-ink">24 ekor</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Jumlah Memeplex (m)</td>
                  <td className="py-1 font-bold text-ink">4 memeplex (6 katak/memeplex)</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Langkah GA Lokal per Siklus</td>
                  <td className="py-1 font-bold text-ink">4 iterasi rekombinasi</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Probabilitas Crossover (pc)</td>
                  <td className="py-1 font-bold text-ink">0.80</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Probabilitas Mutasi (pm)</td>
                  <td className="py-1 font-bold text-ink">0.12</td>
                </tr>
                <tr>
                  <td className="py-1 text-muted">Anggaran Evaluasi Total</td>
                  <td className="py-1 font-bold text-ink">10.000 evaluasi (Setara HEFT-GA)</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Keadilan Anggaran:</strong> SFLA-GA dan HEFT-GA dievaluasi dengan kuota evaluasi fitness yang sama persis (10.000 evaluasi).</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Fair Budget Allocation</span>
      </div>
    </div>
  );
};
