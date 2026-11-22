import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';
import { ArrowDown, GitFork, RefreshCw, Zap } from 'lucide-react';

export const Slide13SflaGaMemeplex: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="13 · GA DI DALAM MEMEPLEX SFLA" color="green" />
          <Citation id="kayalvili2019" />
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Pencarian Lokal dengan <Highlight color="green">Operator GA</Highlight> dalam Memeplex.
        </h2>
        <p className="text-sm text-muted font-medium">
          Di titik mana GA bergabung dalam siklus SFLA? (Jawaban: Menggantikan update formula vektor matematis).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        <Card title="1. Partisi Memeplex" badge="Siklus SFLA">
          <p className="text-xs text-[#444] leading-relaxed mb-3">
            Populasi katak diurutkan menurun berdasarkan nilai fitness, lalu didistribusikan ke <span className="font-mono font-bold">m memeplex</span> secara interleaving (katak i masuk memeplex i mod m).
          </p>
          <div className="p-2 bg-paper rounded-lg border border-line text-[11px] font-mono text-center">
            Memeplex 1, Memeplex 2, ..., Memeplex m
          </div>
        </Card>

        <Card title="2. GA Local Search (Inti Hybrid)" badge="Kontribusi Paper" highlight className="border-t-4 border-t-now">
          <p className="text-xs text-[#333] leading-relaxed mb-2">
            Di dalam setiap memeplex terisolasi, katak bertindak sebagai kromosom GA:
          </p>
          <ul className="list-disc list-inside text-xs text-[#333] space-y-1 font-mono">
            <li>Pilih 2 orang tua dari memeplex</li>
            <li>Lakukan Crossover 2-Titik</li>
            <li>Mutasi integer pada offspring</li>
            <li>Ganti katak terburuk jika offspring lebih baik</li>
          </ul>
        </Card>

        <Card title="3. Meloloskan Diri dari Jebakan" badge="Keunggulan">
          <p className="text-xs text-[#444] leading-relaxed mb-3">
            Pada SFLA murni, jika katak terbaik memeplex adalah lokal optimum, katak terburuk akan terjebak mendekatinya.
          </p>
          <div className="p-2.5 bg-[#dcf3e1] text-sfla rounded-lg border border-sfla text-xs font-mono font-bold">
            Mutasi GA memasukkan alel VM baru secara acak, meloloskan katak dari cekungan lokal optimum!
          </div>
        </Card>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Perbedaan Inti:</strong> SFLA murni menggeser vektor; Hybrid SFLA-GA merekayasa ulang susunan genetik jadwal di dalam subpopulasi.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Local Evolutionary Power</span>
      </div>
    </div>
  );
};
