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
  const colorMap = {
    yellow: 'bg-its-gold text-its-navy border-its-gold font-black',
    blue: 'bg-its-blue text-white border-its-blue-light',
    green: 'bg-its-tosca text-its-navy border-its-tosca font-bold',
    orange: 'bg-its-crusta text-white border-its-crusta',
    ink: 'bg-its-navy text-its-silver border-its-blue-light/40'
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`font-mono text-xs px-2.5 py-1 rounded-lg border tracking-wider shadow-sm ${colorMap[color]}`}
      >
        {label}
      </span>
      {sublabel && <span className="font-mono text-xs text-its-blue-light font-medium">{sublabel}</span>}
    </div>
  );
};
