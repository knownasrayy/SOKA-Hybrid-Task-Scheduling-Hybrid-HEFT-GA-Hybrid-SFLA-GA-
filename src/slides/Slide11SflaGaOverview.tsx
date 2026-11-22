import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';
import { Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Slide11SflaGaOverview: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="11 · HYBRID SFLA-GA" color="green" />
          <Citation id="kayalvili2019" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Mengapa Menggabungkan <Highlight color="green">SFLA</Highlight> dan <Highlight color="yellow">GA</Highlight>?
        </h2>
        <p className="text-sm text-muted font-medium">
          Mengatasi keterbatasan formula lompatan SFLA konvensional dengan operator rekombinasi genetik GA (Pola C: Teamwork).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="SFLA: Cepat tapi Rentan Macet" badge="Komponen 1" className="border-t-4 border-t-sfla">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <Zap className="w-4 h-4" /> Kelebihan: Partisi Memeplex
          </div>
          <p className="text-xs text-[#444] mb-3 leading-relaxed">
            Membagi populasi katak ke beberapa kelompok paralel (memeplex) untuk mencari makan di berbagai area kolam secara serentak.
          </p>
          <div className="flex items-center gap-2 text-hot text-xs font-mono font-bold mb-2">
            <AlertTriangle className="w-4 h-4" /> Kelemahan: Premature Convergence
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            Formula lompatan katak konvensional hanya menggeser katak terburuk menuju yang terbaik. Jika katak terbaik terjebak di lokal optimum, seluruh memeplex ikut terseret macet.
          </p>
        </Card>

        <Card title="GA: Mesin Rekombinasi Kaya" badge="Komponen 2" className="border-t-4 border-t-ink">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <Zap className="w-4 h-4" /> Kelebihan: Variasi Genetik
          </div>
          <p className="text-xs text-[#444] mb-3 leading-relaxed">
            Operator crossover dan mutasi mampu menciptakan kombinasi solusi baru yang melompat keluar dari cekungan lokal optimum.
          </p>
          <div className="flex items-center gap-2 text-hot text-xs font-mono font-bold mb-2">
            <AlertTriangle className="w-4 h-4" /> Kelemahan: Bebas Struktur
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            GA konvensional mengaduk seluruh populasi sekaligus, sehingga solusi terbaik lokal di satu sudut dapat tereliminasi terlalu dini sebelum dieksploitasi tuntas.
          </p>
        </Card>

        <Card title="Sinergi Hybrid SFLA-GA" badge="Solusi Kayalvili 2019" highlight className="border-t-4 border-t-now">
          <div className="flex items-center gap-2 text-safe text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-safe" /> Local GA Search + Global Shuffle
          </div>
          <p className="text-xs text-[#333] mb-3 leading-relaxed">
            <strong>Di dalam memeplex:</strong> Alih-alih formula lompatan biasa, GA melakukan pencarian lokal dengan seleksi turnamen dan crossover antar-katak se-kelompok.
          </p>
          <p className="text-xs text-[#333] leading-relaxed">
            <strong>Di tingkat global:</strong> SFLA mengocok (shuffle) seluruh katak antar-memeplex secara berkala untuk membagikan temuan terbaik ke seluruh kolam!
          </p>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Pola C (Teamwork):</strong> Dua metaheuristik beroperasi secara komplementer: SFLA mengatur struktur kolam, GA menggerakkan evolusi lokal.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Pola C Terpenuhi</span>
      </div>
    </div>
  );
};
