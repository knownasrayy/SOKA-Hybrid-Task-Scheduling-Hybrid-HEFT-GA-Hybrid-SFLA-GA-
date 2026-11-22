import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Citation } from '../components/Citation';

export const Slide10HeftGaSpec: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="10 · SPESIFIKASI HEFT-GA" color="blue" />
          <Citation id="aziza2020" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Pseudocode, Formula Objektif, & Parameter Resmi.
        </h2>
        <p className="text-sm text-muted font-medium">
          Mengacu langsung pada paper Aziza & Krichen (2020) di <em>Neural Computing and Applications</em>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Pseudocode Viewer */}
        <Card title="Pseudocode Algoritma HEFT-GA" badge="Paper Algorithm 1 & 2">
          <div className="bg-paper p-3 rounded-xl border border-line font-mono text-[11px] text-ink leading-relaxed overflow-x-auto">
            <div className="text-muted">// 1. Inisialisasi Benih HEFT</div>
            <div>s_heft ← Run_HEFT(Workflow_DAG, VMs)</div>
            <div>Population[0] ← s_heft</div>
            <div className="text-muted mt-1">// 2. Populasi Awal</div>
            <div>For i = 1 to (PopSize - 1) do:</div>
            <div className="pl-4">Population[i] ← Generate_Random_Chromosome()</div>
            <div className="text-muted mt-1">// 3. Loop Evolusi GA</div>
            <div>While evaluations &lt; Evaluation_Budget do:</div>
            <div className="pl-4">P1, P2 ← Tournament_Selection(Population, size=4)</div>
            <div className="pl-4">C1, C2 ← Two_Point_Crossover(P1, P2, pc=0.8)</div>
            <div className="pl-4">C1 ← Integer_Mutation(C1, pm=0.1)</div>
            <div className="pl-4">Evaluate_Fitness(C1, w=0.5)</div>
            <div className="pl-4">Elitism: Preserve Best Solution</div>
            <div>Return Best_Chromosome (Schedule)</div>
          </div>
        </Card>

        {/* Formula & Parameters Table */}
        <div className="flex flex-col gap-3">
          <Card title="Fungsi Objektif Ganda (Persamaan 8 Paper)" badge="Dual QoS">
            <div className="p-2.5 bg-paper rounded-lg border border-line font-mono text-xs text-ink text-center mb-2">
              f(s) = w · (Makespan / Deadline) + (1 - w) · (Cost / Budget)
            </div>
            <p className="text-[11px] text-[#555] leading-relaxed">
              Meminimalkan waktu eksekusi total (makespan) dan biaya moneter cloud secara proporsional. Default w = 0.5 (bobot seimbang waktu vs biaya).
            </p>
          </Card>

          <Card title="Parameter Eksperimen Resmi" badge="Tabel 3 Paper">
            <table className="w-full text-left font-mono text-xs">
              <tbody>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Ukuran Populasi (PopSize)</td>
                  <td className="py-1 font-bold text-ink">20 individu</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Probabilitas Crossover (pc)</td>
                  <td className="py-1 font-bold text-ink">0.8 (Two-point)</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Probabilitas Mutasi (pm)</td>
                  <td className="py-1 font-bold text-ink">0.1 (Integer swap/reassign)</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-1 text-muted">Metode Seleksi</td>
                  <td className="py-1 font-bold text-ink">Tournament (nbr = 4)</td>
                </tr>
                <tr>
                  <td className="py-1 text-muted">Anggaran Evaluasi</td>
                  <td className="py-1 font-bold text-ink">10.000 evaluasi fitness</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Status Verifikasi:</strong> Parameter dan operator 100% sesuai spesifikasi paper Aziza & Krichen (2020).</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Faithful Implementation</span>
      </div>
    </div>
  );
};
