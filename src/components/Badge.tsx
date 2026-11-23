import React from 'react';

interface BadgeProps {
  label: string;
  sublabel?: string;
  color?: 'yellow' | 'blue' | 'green' | 'orange' | 'ink';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  sublabel,
  color = 'yellow'
}) => {
  const styleMap = {
    yellow: {
      wrap: 'bg-its-cover text-white border-its-cover/80 shadow-sm',
      dot: 'bg-its-gold'
    },
    blue: {
      wrap: 'bg-sky-50 text-its-cover border-its-blue/30',
      dot: 'bg-its-blue'
    },
    green: {
      wrap: 'bg-teal-50 text-teal-900 border-teal-300/70',
      dot: 'bg-teal-500'
    },
    orange: {
      wrap: 'bg-amber-50 text-amber-900 border-amber-300/80',
      dot: 'bg-amber-500'
    },
    ink: {
      wrap: 'bg-slate-100 text-its-navy border-slate-300/80',
      dot: 'bg-its-navy'
    }
  };

  const s = styleMap[color];

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-2 font-mono text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${s.wrap}`}
      >
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span>{label}</span>
      </span>
      {sublabel && <span className="font-mono text-xs text-its-blue font-semibold">{sublabel}</span>}
    </div>
  );
};
