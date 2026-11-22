import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { CheckCircle2, ArrowRight, Server, Shield, Sparkles } from 'lucide-react';

export const Slide25RekomendasiIndustri: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="25 · REKOMENDASI PENERAPAN INDUSTRI" color="yellow" />
          <span className="font-mono text-xs text-muted">Konteks Praktik di Production</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Kapan Menggunakan <Highlight color="blue">Heuristik</Highlight> vs <Highlight color="green">Hybrid Scheduler</Highlight>?
        </h2>
        <p className="text-sm text-muted font-medium">
          Menghubungkan temuan riset dengan arsitektur production modern (Kubernetes, AWS Batch, GCP Cloud Composer).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="Gunakan Heuristik Murni (HEFT) Jika:" badge="Skenario Cepat" className="border-t-4 border-t-heft">
          <ul className="space-y-2 text-xs text-[#333] leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-heft flex-none mt-0.5" />
              <span><strong>Latency-Critical Tasks:</strong> Penjadwalan mikro (&lt; 10 ms) di mana overhead komputasi algoritma metaheuristik tidak dapat ditoleransi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-heft flex-none mt-0.5" />
              <span><strong>Default Container Schedulers:</strong> Seperti kube-scheduler standar Kubernetes yang mengevaluasi ribuan pod secara streaming.</span>
            </li>
          </ul>
        </Card>

        <Card title="Gunakan Hybrid (HEFT-GA / SFLA-GA) Jika:" badge="Skenario Batch" highlight className="border-t-4 border-t-now">
          <ul className="space-y-2 text-xs text-[#333] leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-safe flex-none mt-0.5" />
              <span><strong>Scientific Workflows & ETL:</strong> Pipeline data besar (Montage, genome sequencing, model training) yang berjalan berjam-jam.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-safe flex-none mt-0.5" />
              <span><strong>Penghematan Biaya Finansial:</strong> Menghabiskan waktu 2 detik untuk optimasi jadwal sebanding dengan penghematan $1.000+ tagihan cloud!</span>
            </li>
          </ul>
        </Card>

        <Card title="Rangkuman Akhir Kuliah SOKA" badge="Key Takeaway" className="border-t-4 border-t-ink">
          <p className="text-xs text-[#333] leading-relaxed mb-3">
            <strong>Tidak ada algoritma tunggal yang terbaik di segala situasi</strong> (No Free Lunch Theorem).
          </p>
          <div className="p-3 bg-paper rounded-xl border border-line text-xs font-mono leading-relaxed text-ink">
            "Kombinasi cerdas antara kecepatan heuristik dan daya jelajah metaheuristik memberikan kendali optimal atas trade-off performa, biaya, dan ketahanan di cloud."
          </div>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Tugas Selesai:</strong> Presentasi siap digunakan untuk sesi Demo 1 (Minggu 13) dan Demo 2 (Minggu 14).</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">100% Demo Ready</span>
      </div>
    </div>
  );
};
