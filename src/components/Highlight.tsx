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
    yellow: 'text-its-gold bg-its-gold/15 border border-its-gold/30',
    orange: 'text-its-crusta bg-its-crusta/15 border border-its-crusta/30',
    green: 'text-its-tosca bg-its-tosca/15 border border-its-tosca/30',
    blue: 'text-its-blue-light bg-its-blue/20 border border-its-blue-light/30'
  };

  return (
    <span
      className={`font-extrabold px-1.5 py-0.5 rounded-md inline-block tracking-tight ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};
