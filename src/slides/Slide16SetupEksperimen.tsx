import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { simManager } from '../store/simulationStore';
import { Server, Cpu, Database, Check } from 'lucide-react';

export const Slide16SetupEksperimen: React.FC = () => {
  const problem = simManager.getProblem();

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="16 · SETUP EKSPERIMEN" color="yellow" />
          <span className="font-mono text-xs text-muted">Dataset Minggu 3 & Lingkungan Simulasi Cloud</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Parameter Uji yang <Highlight>Adil, Terstandar, & Reproduksibel</Highlight>.
        </h2>
        <p className="text-sm text-muted font-medium">
          Semua algoritma diuji pada dataset dan lingkungan cloud yang sama persis dengan seed terkontrol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="Dataset Minggu 3" badge="Beban Kerja">
          <div className="flex flex-col gap-2 font-mono text-xs my-2">
            <div className="flex justify-between p-2 rounded bg-paper border border-line">
              <span>Jumlah Task:</span>
              <span className="font-bold text-ink">{problem.tasks.length} task</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-paper border border-line">
              <span>Beban Instruksi:</span>
              <span className="font-bold text-ink">4.500 – 19.700 MI</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-paper border border-line">
              <span>Ukuran File:</span>
              <span className="font-bold text-ink">100 – 500 KB</span>
            </div>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Meniru heterogenitas tugas saintifik dan batch processing di cloud.
          </p>
        </Card>

        <Card title="Arsitektur Datacenter" badge="Resource Heterogen">
          <div className="flex flex-col gap-1.5 font-mono text-[11px] my-2">
            {problem.vms.map((vm) => (
              <div key={vm.id} className="flex justify-between p-1.5 rounded border border-line bg-paper">
                <span className="font-bold" style={{ color: vm.color }}>{vm.name}</span>
                <span>{vm.mips} MIPS · ${vm.pricePerHour}/jam</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Rasio kecepatan 1:5 antara VM-1 dan VM-4 menciptakan trade-off nyata antara waktu eksekusi dan biaya sewa.
          </p>
        </Card>

        <Card title="Aturan Keadilan Evaluasi" badge="Methodology" highlight>
          <ul className="space-y-2 text-xs font-mono text-[#333]">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-safe flex-none" />
              <span><strong>Anggaran Sama:</strong> 10.000 evaluasi fitness per run.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-safe flex-none" />
              <span><strong>Pengulangan N=30 Run:</strong> Menguji signifikansi statistik.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-safe flex-none" />
              <span><strong>PRNG Ber-Seed:</strong> Seed r = 2026 + r * 97 (100% reproducible).</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Fungsi Objektif Fitness:</strong> f(s) = 0.5 × (Makespan / RefMakespan) + 0.5 × (Cost / RefCost).</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Dual QoS Evaluation</span>
      </div>
    </div>
  );
};
