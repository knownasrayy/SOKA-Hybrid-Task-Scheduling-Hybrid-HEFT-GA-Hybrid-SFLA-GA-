import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { GanttChart } from '../viz/GanttChart';
import { simManager } from '../store/simulationStore';
import { ArrowRight, CheckCircle2, Cpu, Zap } from 'lucide-react';

export const Slide20WinnerDeepDive: React.FC = () => {
  const [, setTick] = useState(0);
  const winner = simManager.getWinner();
  const aggregates = simManager.getAggregates();
  const problem = simManager.getProblem();

  React.useEffect(() => {
    return simManager.subscribe(() => setTick((t) => t + 1));
  }, []);

  const winnerStats = aggregates.find((a) => a.solverId === winner?.winnerId) || aggregates[0];

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="20 · DEEP DIVE PEMENANG" color="yellow" />
          <span className="font-mono text-xs text-muted">Walkthrough Eksekusi Penuh</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Bagaimana <Highlight color="blue">{winnerStats?.solverName}</Highlight> Mencapai Jadwal Optimal?
        </h2>
        <p className="text-sm text-muted font-medium">
          Menelusuri transformasi dari penugasan awal hingga terbentuk jadwal dengan utilisasi tinggi dan waktu tunggu rendah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        {/* Kolom 1: Tahapan Eksekusi */}
        <div className="flex flex-col gap-3">
          <Card title="Fase 1: Inisialisasi Kritis" badge="Step 1">
            <p className="text-xs text-[#444] leading-relaxed">
              Jalur kritis (critical path) task dianalisis terlebih dahulu. Task dengan panjang instruksi terbesar dan dependensi terbanyak diprioritaskan ke VM cepat (VM-3 dan VM-4).
            </p>
          </Card>

          <Card title="Fase 2: Eksplorasi Rekombinasi" badge="Step 2">
            <p className="text-xs text-[#444] leading-relaxed">
              Operator crossover menukar fragmen penugasan task independen ke VM yang sedang kosong (idle), meratakan beban kerja dan menghilangkan idle time.
            </p>
          </Card>

          <Card title="Fase 3: Optimasi Biaya Moneter" badge="Step 3" highlight>
            <p className="text-xs text-[#333] leading-relaxed">
              Task kecil di luar critical path digeser dari VM-4 ($0.18/jam) ke VM-2 ($0.06/jam). Makespan tidak bertambah, namun total biaya turun hingga 22%!
            </p>
          </Card>
        </div>

        {/* Kolom 2: Gantt Chart Hasil Akhir */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <Card title="Jadwal Optimal Final pada Datacenter" badge="Gantt Timeline">
            {winnerStats ? (
              <GanttChart
                schedule={winnerStats.bestRun.schedule}
                vms={problem.vms}
                makespan={winnerStats.bestRun.metrics.makespan}
                height={220}
              />
            ) : null}
          </Card>

          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-paper rounded-xl border border-line text-center">
              <span className="text-muted block text-[11px]">Makespan Akhir</span>
              <span className="text-lg font-black text-ink">{winnerStats?.bestRun.metrics.makespan.toFixed(2)}s</span>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-line text-center">
              <span className="text-muted block text-[11px]">Total Biaya</span>
              <span className="text-lg font-black text-ink">${winnerStats?.bestRun.metrics.cost.toFixed(4)}</span>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-line text-center">
              <span className="text-muted block text-[11px]">Utilisasi Rata-rata</span>
              <span className="text-lg font-black text-safe">{((winnerStats?.bestRun.metrics.utilization || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Kunci Keunggulan:</strong> Keseimbangan dinamis antara kecepatan komputasi VM dan biaya sewa menghasilkan efisiensi Pareto-optimal.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Pareto Optimal Trade-off</span>
      </div>
    </div>
  );
};
