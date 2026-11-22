import React, { useState } from 'react';
import { getReference } from '../data/references';
import { BookOpen, ExternalLink, X } from 'lucide-react';

interface CitationProps {
  id: string;
  inline?: boolean;
}

export const Citation: React.FC<CitationProps> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const ref = getReference(id);

  if (!ref) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full border border-its-blue-light/40 bg-its-navy/80 text-its-silver hover:bg-its-blue hover:text-white transition-all cursor-pointer shadow-sm"
        title="Klik untuk melihat sitasi dan abstrak paper"
      >
        <BookOpen className="w-3 h-3 text-its-gold" />
        <span>{ref.authors.split(',')[0]} et al. ({ref.year})</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="its-glass border border-its-blue-light/50 shadow-its-glow rounded-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-its-silver">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-its-gold text-its-navy border border-its-gold">
                REFERENSI ILMIAH RESMI
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-its-blue-light hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h4 className="font-extrabold text-lg text-white leading-snug mb-2">{ref.title}</h4>
            <p className="text-sm font-semibold text-its-blue-light mb-3">
              {ref.authors} ({ref.year}). <em>{ref.journal}</em>, {ref.volume}
              {ref.issue ? `(${ref.issue})` : ''}, {ref.pages}.
            </p>

            <div className="p-3 bg-its-navy/70 rounded-xl border border-its-blue-light/30 text-xs font-mono text-its-gold mb-4">
              <strong>Klasifikasi Pola:</strong> {ref.pattern}
            </div>

            <div className="text-sm text-its-silver/90 mb-5 leading-relaxed bg-its-navy/50 p-3 rounded-lg border border-its-blue-light/20">
              <strong className="text-white block mb-1">Ringkasan Kontribusi:</strong> {ref.summary}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-its-blue-light/20">
              <a
                href={ref.doi}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-its-gold hover:underline"
              >
                <span>Buka via DOI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setOpen(false)}
                className="its-btn-primary font-mono text-xs font-bold px-4 py-2 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
