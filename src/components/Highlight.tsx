import React from 'react';

interface HighlightProps {
  children: React.ReactNode;
  color?: 'yellow' | 'orange' | 'green' | 'blue';
  className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({
  children,
  color = 'yellow',
  className = ''
}) => {
  const colorMap = {
    yellow: 'bg-gradient-to-r from-its-cover via-its-blue to-sky-500 bg-clip-text text-transparent border-b-2 border-its-gold/80',
    orange: 'bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent border-b-2 border-amber-400/80',
    green: 'bg-gradient-to-r from-teal-700 to-emerald-500 bg-clip-text text-transparent border-b-2 border-teal-400/80',
    blue: 'bg-gradient-to-r from-its-cover to-its-blue bg-clip-text text-transparent border-b-2 border-its-blue/50'
  };

  return (
    <span
      className={`font-black pb-0.5 inline-block tracking-tight ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};
