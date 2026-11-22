import React from 'react';
import { Badge } from '../components/Badge';
import { Highlight } from '../components/Highlight';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

export const Slide01Cover: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div className="flex items-center justify-between">
        <Badge label="SOKA · DEPARTEMEN TEKNOLOGI INFORMASI ITS" color="yellow" />
        <span className="font-mono text-xs font-bold text-muted uppercase">Tugas Minggu 13–14</span>
      </div>

      <div className="max-w-4xl my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-ink text-xs font-mono font-bold mb-4">
          <Layers className="w-3.5 h-3.5 text-heft" />
          <span>Presentasi Web Interaktif Algoritma Hybrid</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-ink leading-tight tracking-tight mb-6">
          Hybrid <Highlight color="blue">HEFT-GA</Highlight> vs Hybrid <Highlight color="green">SFLA-GA</Highlight> untuk Cloud Task Scheduling.
        </h1>

        <p className="text-xl text-muted font-medium leading-relaxed max-w-2xl mb-8">
          Eksplorasi mendalam, simulasi berbasis browser tanpa hardcode, penentuan pemenang berbasis data, dan perbandingan 3 arah dengan baseline.
        </p>

        <div className="flex items-center gap-4">
          <div className="border-neo rounded-xl px-4 py-2.5 bg-white shadow-neo-sm font-mono text-sm">
            <span className="text-muted text-xs block">Presenter</span>
            <span className="font-bold text-ink">Rayhan (5027221019)</span>
          </div>
          <div className="border-neo rounded-xl px-4 py-2.5 bg-white shadow-neo-sm font-mono text-sm">
            <span className="text-muted text-xs block">Mata Kuliah</span>
            <span className="font-bold text-ink">Strategi Optimasi Komputasi Awan (SOKA)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line text-xs font-mono text-muted">
        <span>Tekan <kbd className="px-2 py-0.5 rounded bg-white border border-ink font-bold text-ink">Spasi</kbd> atau <kbd className="px-2 py-0.5 rounded bg-white border border-ink font-bold text-ink">→</kbd> untuk mulai</span>
        <span>Demo 1 (Minggu 13) & Demo 2 (Minggu 14)</span>
      </div>
    </div>
  );
};
