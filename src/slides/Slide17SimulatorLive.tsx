import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { GanttChart } from '../viz/GanttChart';
import { ConvergencePlot } from '../viz/ConvergencePlot';
import { simManager } from '../store/simulationStore';
import { Play, RotateCw } from 'lucide-react';

export const Slide17SimulatorLive: React.FC = () => {
  const [, setTick] = useState(0);
  const aggregates = simManager.getAggregates();
  const problem = simManager.getProblem();
  const isRunning = simManager.getIsRunning();
  const progress = simManager.getProgress();

  React.useEffect(() => {
    return simManager.subscribe(() => setTick((t) => t + 1));
  }, []);

  const heftGaStats = aggregates.find((a) => a.solverId === 'heft_ga');
  const sflaGaStats = aggregates.find((a) => a.solverId === 'sfla_ga');

  const seriesData = [
    ...(heftGaStats
      ? [
          {
            id: 'heft_ga',
            name: `HEFT-GA (Mean: ${heftGaStats.makespan.mean.toFixed(2)}s)`,
            color: '#2563eb',
            points: heftGaStats.convergenceAverage.map((p) => ({ eval: p.eval, val: p.bestMakespan }))
          }
        ]
      : []),
    ...(sflaGaStats
      ? [
          {
            id: 'sfla_ga',
            name: `SFLA-GA (Mean: ${sflaGaStats.makespan.mean.toFixed(2)}s)`,
            color: '#059669',
            points: sflaGaStats.convergenceAverage.map((p) => ({ eval: p.eval, val: p.bestMakespan }))
          }
        ]
      : [])
  ];

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="17 · SIMULATOR LIVE" color="yellow" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => simManager.run(problem, 30)}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 bg-now border border-ink rounded-lg font-mono text-xs font-bold hover:bg-[#ffe17d] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? `Menghitung (${progress.percent}%)` : 'Hitung Ulang 30 Run'}</span>
            </button>
            <span className="font-mono text-xs text-muted">Dataset: {problem.name}</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Simulasi Nyata: <Highlight color="blue">HEFT-GA</Highlight> vs <Highlight color="green">SFLA-GA</Highlight> di Browser.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Kolom 1: Jadwal Gantt HEFT-GA */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs font-bold">
            <span className="text-heft">HEFT-GA (Jadwal Terbaik)</span>
            <span>Makespan: {heftGaStats?.bestRun.metrics.makespan.toFixed(2)}s · Biaya: ${heftGaStats?.bestRun.metrics.cost.toFixed(4)}</span>
          </div>
          {heftGaStats ? (
            <GanttChart
              schedule={heftGaStats.bestRun.schedule}
              vms={problem.vms}
              makespan={heftGaStats.bestRun.metrics.makespan}
              height={140}
            />
          ) : (
            <div className="p-8 text-center text-xs font-mono text-muted bg-paper rounded border border-line">Memuat data...</div>
          )}

          {/* Kolom 2: Jadwal Gantt SFLA-GA */}
          <div className="flex items-center justify-between font-mono text-xs font-bold mt-1">
            <span className="text-sfla">SFLA-GA (Jadwal Terbaik)</span>
            <span>Makespan: {sflaGaStats?.bestRun.metrics.makespan.toFixed(2)}s · Biaya: ${sflaGaStats?.bestRun.metrics.cost.toFixed(4)}</span>
          </div>
          {sflaGaStats ? (
            <GanttChart
              schedule={sflaGaStats.bestRun.schedule}
              vms={problem.vms}
              makespan={sflaGaStats.bestRun.metrics.makespan}
              height={140}
            />
          ) : (
            <div className="p-8 text-center text-xs font-mono text-muted bg-paper rounded border border-line">Memuat data...</div>
          )}
        </div>

        {/* Kolom 2: Kurva Konvergensi Berdampingan */}
        <div>
          <ConvergencePlot
            series={seriesData}
            yLabel="Makespan Rata-rata (s)"
            height={280}
          />
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Bukan Hardcode:</strong> Hasil dihitung secara live di browser dengan Web Worker/asinkron tanpa membekukan antarmuka.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Live Computed</span>
      </div>
    </div>
  );
};
