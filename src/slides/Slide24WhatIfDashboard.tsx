import React, { useState, useMemo } from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { GanttChart } from '../viz/GanttChart';
import { Problem, Task, VM, evaluateSchedule } from '../sim/model';
import { heftGaSolver } from '../sim/algorithms/heftGa';
import { createRNG } from '../sim/rng';
import { Sliders, RefreshCw, DollarSign, Clock } from 'lucide-react';

export const Slide24WhatIfDashboard: React.FC = () => {
  const [taskCount, setTaskCount] = useState(24);
  const [vmTierSpeed, setVmTierSpeed] = useState(1.0); // Multiplier
  const [timeWeight, setTimeWeight] = useState(0.5); // Trade-off weight

  // Dynamically generate problem based on sliders
  const dynamicProblem: Problem = useMemo(() => {
    const rng = createRNG(777);
    const tasks: Task[] = Array.from({ length: taskCount }, (_, i) => ({
      id: i,
      name: `T${i + 1}`,
      length: rng.int(4000, 18000),
      fileSize: rng.int(150, 400),
      outputSize: rng.int(150, 400),
      deps: i > 0 && rng.random() < 0.35 ? [rng.int(0, i - 1)] : []
    }));

    const vms: VM[] = [
      { id: 0, name: 't3.medium', mips: Math.round(600 * vmTierSpeed), ram: 2048, bw: 600, pricePerHour: 0.04, color: '#2f6fdb' },
      { id: 1, name: 'c5.large',  mips: Math.round(1200 * vmTierSpeed), ram: 4096, bw: 1200, pricePerHour: 0.08, color: '#8b5cf6' },
      { id: 2, name: 'm5.xlarge', mips: Math.round(1800 * vmTierSpeed), ram: 8192, bw: 1800, pricePerHour: 0.16, color: '#0e9f9e' },
      { id: 3, name: 'c5.2xlarge', mips: Math.round(2800 * vmTierSpeed), ram: 16384, bw: 2800, pricePerHour: 0.32, color: '#64748b' }
    ];

    return {
      id: 'what_if_problem',
      name: `What-If Scenario (${taskCount} Tasks)`,
      description: 'Dynamic Cloud Configuration',
      tasks,
      vms
    };
  }, [taskCount, vmTierSpeed]);

  // Solve with HEFT-GA
  const solution = useMemo(() => {
    return heftGaSolver.run(
      dynamicProblem,
      {
        evaluationBudget: 1500,
        populationSize: 16
      },
      createRNG(42)
    );
  }, [dynamicProblem, timeWeight]);

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="24 · DASHBOARD WHAT-IF INTERAKTIF" color="yellow" />
          <span className="font-mono text-xs text-muted">Simulasi Kebutuhan Beban & Kapasitas Dinamis</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight mb-2">
          Eksplorasi Skenario: <Highlight>Ubah Slider, Lihat Hasil Langsung</Highlight>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        {/* Sliders Panel */}
        <Card title="Parameter Kontrol Skenario" badge="Sliders Kontrol" className="flex flex-col justify-between">
          <div className="space-y-4 font-mono text-xs my-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Jumlah Task:</span>
                <span className="font-bold text-ink">{taskCount} Task</span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="6"
                value={taskCount}
                onChange={(e) => setTaskCount(parseInt(e.target.value, 10))}
                className="w-full accent-ink cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Skala Kecepatan VM:</span>
                <span className="font-bold text-ink">{vmTierSpeed.toFixed(1)}x Kapasitas</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={vmTierSpeed}
                onChange={(e) => setVmTierSpeed(parseFloat(e.target.value))}
                className="w-full accent-heft cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Bobot Prioritas:</span>
                <span className="font-bold text-hot">
                  {timeWeight === 0.5 ? 'Seimbang' : timeWeight > 0.5 ? 'Prioritas Cepat' : 'Prioritas Hemat'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={timeWeight}
                onChange={(e) => setTimeWeight(parseFloat(e.target.value))}
                className="w-full accent-hot cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>0.1 (Hemat Biaya)</span>
                <span>0.9 (Cepat Selesai)</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-paper rounded border border-line text-[11px] font-mono text-muted text-center">
            Perhitungan real-time instan diperbarui di browser!
          </div>
        </Card>

        {/* Live Gantt Chart Output */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <GanttChart
            schedule={solution.schedule}
            vms={dynamicProblem.vms}
            makespan={solution.metrics.makespan}
            height={160}
          />

          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-white border-neo rounded-xl text-center">
              <span className="text-muted block text-[11px] flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-heft" /> Makespan Dinamis
              </span>
              <span className="text-lg font-black text-ink">{solution.metrics.makespan.toFixed(2)} detik</span>
            </div>
            <div className="p-3 bg-white border-neo rounded-xl text-center">
              <span className="text-muted block text-[11px] flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3 text-hot" /> Perkiraan Biaya Sewa
              </span>
              <span className="text-lg font-black text-ink">${solution.metrics.cost.toFixed(4)} USD</span>
            </div>
            <div className="p-3 bg-white border-neo rounded-xl text-center">
              <span className="text-muted block text-[11px]">Utilisasi Rata-rata</span>
              <span className="text-lg font-black text-safe">{(solution.metrics.utilization * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Fleksibilitas Sistem:</strong> Scheduler hybrid dapat disetel secara dinamis menyesuaikan lonjakan workload harian atau keterbatasan budget cloud.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Live What-If Engine</span>
      </div>
    </div>
  );
};
