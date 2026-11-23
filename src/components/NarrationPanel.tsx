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
    <div className={`p-3.5 its-glass-blue rounded-xl flex items-start gap-3 ${className}`}>
      <div className="p-2 bg-its-blue text-white rounded-lg flex-none mt-0.5 shadow-sm">
        <Info className="w-4 h-4 text-its-gold" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-its-blue">
            {phase}
          </span>
          <span className="text-its-blue/40 text-xs">·</span>
          <h4 className="font-extrabold text-sm text-its-navy">{title}</h4>
        </div>
        <p className="text-sm text-its-silver leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};
