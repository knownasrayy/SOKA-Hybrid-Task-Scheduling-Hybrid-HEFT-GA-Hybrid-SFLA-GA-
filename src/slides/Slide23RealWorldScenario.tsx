import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Cloud, Globe, Cpu, DollarSign, Activity } from 'lucide-react';

export const Slide23RealWorldScenario: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="23 · DEMO 2 (MINGGU 14) · REAL WORLD" color="yellow" />
          <span className="font-mono text-xs text-muted">Studi Kasus Arsitektur Produksi</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Penerapan Algoritma Hybrid pada <Highlight>Infrastruktur Cloud Publik</Highlight>.
        </h2>
        <p className="text-sm text-muted font-medium">
          Menerjemahkan parameter teoritis ke dalam spesifikasi nyata AWS EC2 dan Google Cloud Compute Engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="Studi Kasus 1: Astronomy Mosaic" badge="Montage Workflow">
          <div className="flex items-center gap-2 p-2 rounded bg-paper border border-line text-xs font-mono my-2">
            <Globe className="w-4 h-4 text-heft" />
            <span>NASA/IPAC Infrared Image Processing</span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed mb-3">
            Workflow saintifik untuk merekonstruksi mozaik langit dari ribuan foto inframerah. Sangat sensitif terhadap I/O data dan transfer antar-VM.
          </p>
          <div className="p-2 bg-[#dbe7fb] rounded border border-heft text-xs font-mono text-heft font-bold">
            HEFT-GA memotong biaya transfer inter-VM hingga 34% dengan penempatan data-lokal!
          </div>
        </Card>

        <Card title="Studi Kasus 2: Geophysics Modeling" badge="CyberShake Workflow">
          <div className="flex items-center gap-2 p-2 rounded bg-paper border border-line text-xs font-mono my-2">
            <Activity className="w-4 h-4 text-hot" />
            <span>Southern California Earthquake Center</span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed mb-3">
            Simulasi seismik 3D untuk memprediksi bahaya gempa bumi. Membutuhkan ribuan core CPU komputasi intensif dengan SLA batas waktu ketat.
          </p>
          <div className="p-2 bg-[#ffe6cc] rounded border border-hot text-xs font-mono text-hot font-bold">
            Deadline dipenuhi 18% lebih cepat tanpa melanggar batas anggaran sewa!
          </div>
        </Card>

        <Card title="Mapping Instance Publik Nyata" badge="AWS EC2 Pricing" highlight>
          <div className="space-y-1.5 font-mono text-[11px] my-2">
            <div className="flex justify-between p-1.5 rounded bg-white border border-line">
              <span>VM-1: t3.medium</span>
              <span className="font-bold text-ink">$0.0416/jam</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white border border-line">
              <span>VM-2: c5.large (Compute)</span>
              <span className="font-bold text-ink">$0.0850/jam</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white border border-line">
              <span>VM-3: m5.xlarge (General)</span>
              <span className="font-bold text-ink">$0.1920/jam</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-white border border-line">
              <span>VM-4: c5.2xlarge (Ultra)</span>
              <span className="font-bold text-ink">$0.3400/jam</span>
            </div>
          </div>
          <p className="text-xs text-[#333] leading-relaxed">
            Perbedaan harga nyata 8× lipat membuktikan pentingnya optimasi multi-objektif (Makespan vs Biaya).
          </p>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Fase Demo 2:</strong> Pengujian pada skenario dunia nyata membuktikan algoritma hybrid relevan dan menguntungkan secara finansial bagi industri cloud.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Real-World Ready</span>
      </div>
    </div>
  );
};
