import React, { useState } from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { BoxPlotChart } from '../viz/BoxPlotChart';
import { simManager } from '../store/simulationStore';

export const Slide18HasilStatistik: React.FC = () => {
  const [, setTick] = useState(0);
  const aggregates = simManager.getAggregates();

  React.useEffect(() => {
    return simManager.subscribe(() => setTick((t) => t + 1));
  }, []);

  const [activeMetric, setActiveMetric] = useState<'makespan' | 'cost' | 'utilization' | 'imbalance'>('makespan');

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="18 · HASIL & UJI STATISTIK" color="yellow" />
          <span className="font-mono text-xs text-muted">Ringkasan N=30 Run Terkontrol</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Tabel Metrik Lengkap & <Highlight>Sebaran Boxplot</Highlight>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Tabel Ringkasan Statistik */}
        <Card title="Ringkasan Statistik (Mean ± Std)" badge="Semua Algoritma" className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-ink text-muted pb-1">
                <th className="py-1">Algoritma</th>
                <th className="py-1">Makespan (s)</th>
                <th className="py-1">Biaya ($)</th>
                <th className="py-1">Utilisasi</th>
                <th className="py-1">DI</th>
              </tr>
            </thead>
            <tbody>
              {aggregates.map((s) => {
                const isHybrid = s.solverId.includes('heft_ga') || s.solverId.includes('sfla_ga');
                return (
                  <tr
                    key={s.solverId}
                    className={`border-b border-line ${isHybrid ? 'font-bold bg-[#fafafa]' : ''}`}
                  >
                    <td className="py-2 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-ink" style={{ backgroundColor: s.color || '#2563eb' }} />
                      <span className="truncate max-w-[130px]">{s.solverName.split('(')[0].trim()}</span>
                    </td>
                    <td className="py-2">{s.makespan.mean.toFixed(2)} ± {s.makespan.std.toFixed(1)}</td>
                    <td className="py-2">${s.cost.mean.toFixed(4)}</td>
                    <td className="py-2">{(s.utilization.mean * 100).toFixed(1)}%</td>
                    <td className="py-2">{s.imbalance.mean.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Boxplot Sebaran */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted font-bold">Pilih Metrik Boxplot:</span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {(['makespan', 'cost', 'utilization', 'imbalance'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-2 py-0.5 rounded border capitalize cursor-pointer ${
                    activeMetric === m ? 'bg-ink text-paper border-ink font-bold' : 'bg-white border-line text-muted hover:border-ink'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <BoxPlotChart
            statsList={aggregates}
            metricKey={activeMetric}
            yLabel={activeMetric.toUpperCase()}
            height={220}
          />
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Reliabilitas:</strong> Nilai standard deviasi yang kecil menunjukkan algoritma hybrid stabil dan konsisten di seluruh variasi random seed.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Low Variance Stability</span>
      </div>
    </div>
  );
};
