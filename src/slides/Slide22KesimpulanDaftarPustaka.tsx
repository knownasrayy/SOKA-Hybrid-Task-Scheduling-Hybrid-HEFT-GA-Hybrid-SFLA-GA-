import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { REFERENCES } from '../data/references';
import { ExternalLink, CheckCircle } from 'lucide-react';

export const Slide22KesimpulanDaftarPustaka: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="22 · KESIMPULAN & DAFTAR PUSTAKA" color="yellow" />
          <span className="font-mono text-xs text-muted">Akhir Sesi Demo 1 (Minggu 13)</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Kesimpulan Utama & <Highlight>Daftar Pustaka</Highlight> Ilmiah.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Ringkasan Takeaway */}
        <Card title="Kesimpulan Inti Demo 1" badge="Takeaways">
          <ul className="space-y-2.5 text-xs text-[#333] leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-safe flex-none mt-0.5" />
              <span><strong>Pola B & C Memenuhi Syarat:</strong> Kombinasi heuristik + metaheuristik berhasil mengatasi jebakan lokal greedy dan mempercepat konvergensi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-safe flex-none mt-0.5" />
              <span><strong>Seeding Relay HEFT-GA Sangat Efektif:</strong> Memulai populasi dari jadwal HEFT menghemat ribuan evaluasi awal dibanding populasi acak murni.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-safe flex-none mt-0.5" />
              <span><strong>Evaluasi Adil Berbasis Data:</strong> Dengan kuota 10.000 evaluasi dan seed identik, hasil menunjukkan keunggulan hybrid dapat direproduksi 100%.</span>
            </li>
          </ul>
        </Card>

        {/* Daftar Pustaka Format APA */}
        <Card title="Daftar Pustaka Ilmiah" badge="APA 7th + DOI" className="overflow-y-auto max-h-[300px]">
          <div className="flex flex-col gap-3 font-mono text-[11px] text-[#444]">
            {REFERENCES.map((ref) => (
              <div key={ref.id} className="pb-2 border-b border-line last:border-none">
                <div className="font-bold text-ink">{ref.authors} ({ref.year}).</div>
                <div className="text-muted">{ref.title}. <em>{ref.journal}</em>, {ref.volume}{ref.issue ? `(${ref.issue})` : ''}, {ref.pages}.</div>
                <a
                  href={ref.doi}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-heft hover:underline mt-0.5"
                >
                  <span>{ref.doi}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Lanjut ke Demo 2 (Minggu 14):</strong> Tekan Next untuk masuk ke modul studi kasus real-world dan dashboard What-If.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Siap Demo 2 →</span>
      </div>
    </div>
  );
};
