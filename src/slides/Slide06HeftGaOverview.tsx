import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';
import { Zap, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Slide06HeftGaOverview: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="06 · HYBRID HEFT-GA" color="blue" />
          <Citation id="aziza2020" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Mengapa Menggabungkan <Highlight color="blue">HEFT</Highlight> dan <Highlight color="yellow">GA</Highlight>?
        </h2>
        <p className="text-sm text-muted font-medium">
          Dua algoritma dengan karakteristik yang saling menutupi kelemahan fundamental masing-masing (Pola B: Seeding Relay).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="HEFT: Cepat tapi Greedy" badge="Komponen 1" className="border-t-4 border-t-heft">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <Zap className="w-4 h-4" /> Kelebihan: Sangat Cepat & Terarah
          </div>
          <p className="text-xs text-[#444] mb-3 leading-relaxed">
            Menghitung jalur kritis (critical path) melalui upward rank. Memberikan alokasi jadwal yang sangat baik dalam hitungan milidetik deterministik.
          </p>
          <div className="flex items-center gap-2 text-hot text-xs font-mono font-bold mb-2">
            <AlertTriangle className="w-4 h-4" /> Kelemahan: Terjebak Lokal Greedy
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Tidak memiliki mekanisme revisi: sekali keputusan penugasan task dibuat di awal, jadwal tidak dapat dieksplorasi ulang jika timbul bottleneck di belakang.
          </p>
        </Card>

        <Card title="GA: Global tapi Lambat" badge="Komponen 2" className="border-t-4 border-t-ink">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <Zap className="w-4 h-4" /> Kelebihan: Eksplorasi Luas
          </div>
          <p className="text-xs text-[#444] mb-3 leading-relaxed">
            Mencari di seluruh ruang solusi multidimensi secara stokastik menggunakan crossover dan mutasi acak.
          </p>
          <div className="flex items-center gap-2 text-hot text-xs font-mono font-bold mb-2">
            <AlertTriangle className="w-4 h-4" /> Kelemahan: Titik Awal Buta
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Dimulai dari populasi acak 100%. Membutuhkan ribuan generasi hanya untuk mengejar kualitas solusi yang bisa didapat heuristik dalam sekejap.
          </p>
        </Card>

        <Card title="Sinergi Hybrid HEFT-GA" badge="Solusi Aziza 2020" highlight className="border-t-4 border-t-now">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-safe" /> Yang Terbaik dari Dua Dunia
          </div>
          <p className="text-xs text-[#333] mb-3 leading-relaxed">
            <strong>HEFT</strong> memberikan satu jadwal deterministik berkualitas tinggi yang disuntikkan ke populasi generasi ke-0.
          </p>
          <p className="text-xs text-[#333] leading-relaxed">
            <strong>GA</strong> tidak lagi meraba dalam kegelapan: operator turnamen dan crossover langsung memperbaiki solusi elite tersebut, menghemat 80%+ evaluasi pencarian!
          </p>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Golden Insight:</strong> Fitness generasi ke-0 HEFT-GA sudah lebih unggul daripada generasi ke-30 GA murni!</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Fast Seeding Convergence</span>
      </div>
    </div>
  );
};
