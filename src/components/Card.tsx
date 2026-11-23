import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  badge,
  title,
  subtitle,
  highlight = false
}) => {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-200 ${
        highlight
          ? 'its-glass-gold border-its-gold/60 shadow-its-gold-glow'
          : 'its-glass border-its-blue-light/25 hover:border-its-blue-light/50'
      } ${className}`}
    >
      {(badge || title) && (
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-its-blue-light/20">
          <div className="flex items-center gap-2">
            {badge && (
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-its-gold text-its-navy border border-its-gold">
                {badge}
              </span>
            )}
            {title && <h3 className="font-extrabold text-lg text-its-navy tracking-tight">{title}</h3>}
          </div>
          {subtitle && <span className="text-xs font-mono text-its-blue font-semibold">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
};
