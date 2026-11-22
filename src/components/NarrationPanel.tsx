import React from 'react';
import { Info } from 'lucide-react';

interface NarrationPanelProps {
  title: string;
  description: string;
  phase?: string;
  className?: string;
}

export const NarrationPanel: React.FC<NarrationPanelProps> = ({
  title,
  description,
  phase = 'Apa yang terjadi sekarang?',
  className = ''
}) => {
  return (
    <div className={`p-4 its-glass border border-its-blue-light/30 rounded-xl flex items-start gap-3 shadow-its-card ${className}`}>
      <div className="p-2 bg-its-blue text-white rounded-lg flex-none mt-0.5 border border-its-blue-light/50">
        <Info className="w-4 h-4 text-its-gold" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-its-gold">
            {phase}
          </span>
          <span className="text-its-blue-light text-xs">·</span>
          <h4 className="font-extrabold text-sm text-its-silver">{title}</h4>
        </div>
        <p className="text-sm text-its-silver/90 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};
