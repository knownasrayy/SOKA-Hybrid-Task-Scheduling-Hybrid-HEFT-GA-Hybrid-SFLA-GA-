import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';
import { ConvergencePlot } from '../viz/ConvergencePlot';
import { heftSolver } from '../sim/algorithms/heft';
import { gaSolver } from '../sim/algorithms/ga';
import { heftGaSolver } from '../sim/algorithms/heftGa';
import { MINGGU3_PROBLEM } from '../data/defaultDatasets';
import { createRNG } from '../sim/rng';

export const Slide09HeftGaIntegration: React.FC = () => {
  // Compute comparison curves on Minggu 3 dataset
  const seriesData = React.useMemo(() => {
    const rng1 = createRNG(42);
    const rng2 = createRNG(42);
    const rng3 = createRNG(42);

    const heft = heftSolver.run(MINGGU3_PROBLEM, {}, rng1);
    const ga = gaSolver.run(MINGGU3_PROBLEM, { evaluationBudget: 2000, populationSize: 20 }, rng2);
    const heftGa = heftGaSolver.run(MINGGU3_PROBLEM, { evaluationBudget: 2000, populationSize: 20 }, rng3);

    return [
      {
        id: 'heft_line',
        name: `HEFT Deterministik (${heft.metrics.makespan.toFixed(1)}s)`,
        color: '#2563eb',
        points: [
          { eval: 0, val: heft.metrics.makespan },
          { eval: 2000, val: heft.metrics.makespan }
        ]
      },
      {
        id: 'ga_pure',
        name: `GA Murni (Akhir: ${ga.metrics.makespan.toFixed(1)}s)`,
        color: '#141414',
        points: ga.history.map((h) => ({ eval: h.eval, val: h.bestMakespan }))
      },
      {
        id: 'heft_ga',
        name: `Hybrid HEFT-GA (Akhir: ${heftGa.metrics.makespan.toFixed(1)}s)`,
        color: '#ff7a00',
        points: heftGa.history.map((h) => ({ eval: h.eval, val: h.bestMakespan }))
      }
    ];
  }, []);

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="09 · INTEGRASI HEFT → GA" color="blue" />
          <Citation id="aziza2020" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Seeding Relay: <Highlight color="yellow">Generasi-0 HEFT-GA</Highlight> Langsung Unggul.
        </h2>
        <p className="text-sm text-muted font-medium">
          Melihat bukti empiris dari kurva konvergensi: GA murni butuh ratusan iterasi hanya untuk menyamai titik awal HEFT-GA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        <div>
          <ConvergencePlot series={seriesData} yLabel="Makespan (s)" height={220} />
        </div>

        <div className="flex flex-col gap-3">
          <Card title="Mekanisme Inisialisasi Populasi" badge="Algoritma 1 Paper">
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#333] font-mono leading-relaxed">
              <li>Jalankan algoritma HEFT pada DAG untuk memperoleh jadwal <span className="bg-now px-1 font-bold">s_HEFT</span>.</li>
              <li>Suntikkan <span className="font-bold text-heft">s_HEFT</span> ke populasi sebagai <span className="font-bold">Kromosom 0</span>.</li>
              <li>Bangkitkan varian perturbasi di sekitar s_HEFT (mutasi ringan).</li>
              <li>Lengkapi sisa populasi (P-k individu) secara acak untuk diversitas.</li>
            </ol>
          </Card>

          <Card title="Dampak pada Kecepatan Konvergensi" badge="Temuan Kunci" highlight>
            <p className="text-xs text-[#333] leading-relaxed">
              Karena dimulai dari batas bawah HEFT yang sudah baik, GA tidak membuang-buang evaluasi di wilayah solusi buruk. Crossover dua-titik dan seleksi turnamen langsung fokus memperbaiki penempatan task pada VM yang menjadi bottleneck.
            </p>
          </Card>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Bukti Data:</strong> Garis oranye (HEFT-GA) langsung dimulai dari titik optimal HEFT dan terus turun lebih rendah daripada GA murni!</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Empirically Verified</span>
      </div>
    </div>
  );
};
