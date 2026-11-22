import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { CheckCircle2, Calendar } from 'lucide-react';

export const Slide02Ketentuan: React.FC = () => {
  const rules = [
    { num: '01', title: 'Pola B–E Wajib', desc: 'Minimal kombinasi heuristik + metaheuristik. Pola A (heuristik + heuristik) tidak memenuhi syarat.' },
    { num: '02', title: 'Sumber Paper Ilmiah', desc: 'Wajib dari paper/jurnal bereputasi (Springer). Cantumkan sitasi lengkap dan DOI.' },
    { num: '03', title: 'Orisinalitas Antarkelas', desc: 'Kombinasi algoritma terpilih tidak boleh sama persis untuk ketiga kelas SOKA.' },
    { num: '04', title: 'Implementasi & Dataset Minggu 3', desc: 'Kedua hybrid benar-benar diuji pada simulator cloud menggunakan dataset Minggu 3.' },
    { num: '05', title: 'Presentasikan 1 Hybrid Unggul', desc: 'Kaji dan visualisasikan cara kerja hybrid yang memiliki skor komposit superior.' },
    { num: '06', title: 'Bandingkan dengan 2 Metode Lama', desc: 'Bandingkan hybrid unggul dengan 2 baseline sebelumnya (SFLA & WCA).' }
  ];

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="02 · KETENTUAN TUGAS" color="yellow" />
          <span className="font-mono text-xs text-muted">Acuan Dosen Minggu 13–14</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-4">
          Pilih <Highlight>Dua Hybrid</Highlight>, Presentasikan <Highlight>Satu yang Unggul</Highlight>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-auto">
        {rules.map((r) => (
          <Card key={r.num} className="flex flex-col justify-between hover:translate-y-[-2px]">
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-now border border-ink">
                {r.num}
              </span>
              <CheckCircle2 className="w-4 h-4 text-safe" />
            </div>
            <div>
              <h4 className="font-extrabold text-ink text-base mb-1">{r.title}</h4>
              <p className="text-xs text-[#444] leading-relaxed">{r.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 bg-paper border-neo rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-hot" />
          <span className="font-bold text-ink">Timeline Presentasi:</span>
          <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Minggu 13 · Demo 1</span> (Cara Kerja & Hasil Simulator)
          <span>→</span>
          <span className="bg-white px-2 py-0.5 rounded border border-ink font-bold">Minggu 14 · Demo 2</span> (Penerapan di Real World)
        </div>
        <span className="text-muted">Status: 6/6 Kriteria Terpenuhi</span>
      </div>
    </div>
  );
};
