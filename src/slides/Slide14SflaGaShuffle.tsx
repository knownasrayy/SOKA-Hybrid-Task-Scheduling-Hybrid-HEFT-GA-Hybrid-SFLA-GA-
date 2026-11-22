import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';
import { Shuffle, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';

export const Slide14SflaGaShuffle: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="14 · GLOBAL SHUFFLE SFLA-GA" color="green" />
          <Citation id="kayalvili2019" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Fase <Highlight color="green">Global Shuffle</Highlight>: Pertukaran Informasi Antar-Kelompok.
        </h2>
        <p className="text-sm text-muted font-medium">
          Menyatukan kembali semua katak dari seluruh memeplex, menyortir ulang secara global, dan membaginya kembali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="Pencarian Lokal Memeplex" badge="Tahap 1">
          <div className="flex items-center justify-center p-4 bg-paper rounded-xl border border-line my-2">
            <span className="font-mono text-sm font-bold text-muted">
              Memeplex 1 · 2 · 3 · 4 (Terisolasi)
            </span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Masing-masing kelompok mengevolusikan solusinya secara independen tanpa saling mengganggu. Variasi terjaga di masing-masing habitat.
          </p>
        </Card>

        <Card title="Global Pooling & Sort" badge="Tahap 2" highlight>
          <div className="flex items-center justify-center gap-2 p-4 bg-now/30 rounded-xl border border-ink my-2 text-ink font-mono font-bold text-sm">
            <Shuffle className="w-5 h-5 text-ink animate-spin" />
            <span>Pool Semua Katak → Urutkan Fitness</span>
          </div>
          <p className="text-xs text-[#333] leading-relaxed">
            Seluruh katak dikumpulkan menjadi satu populasi besar. Katak terbaik dari Memeplex 1 kini dapat bertemu dan berpasangan dengan katak terbaik dari Memeplex 3!
          </p>
        </Card>

        <Card title="Redistribusi Baru" badge="Tahap 3">
          <div className="flex items-center justify-center p-4 bg-[#dcf3e1] rounded-xl border border-safe my-2 text-safe font-mono font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Habitat Baru Terbentuk</span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Katak-katak dibagikan kembali ke memeplex baru dengan komposisi anggota berbeda. Siklus berulang hingga anggaran evaluasi tercapai.
          </p>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Manfaat Besar Shuffle:</strong> Mencegah terbentuknya "kelompok eksklusif yang mandek" (inbreeding) dan mempercepat penyebaran gen unggul ke seluruh kolam.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Global Information Exchange</span>
      </div>
    </div>
  );
};
