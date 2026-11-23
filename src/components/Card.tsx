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
      className={`rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
        highlight
          ? 'bg-gradient-to-br from-amber-50/95 via-white to-sky-50/70 border border-amber-300/80 border-t-[3px] border-t-its-gold shadow-its-gold-glow'
          : 'bg-white/90 backdrop-blur-md border border-its-blue/15 border-t-[3px] border-t-its-blue shadow-its-card hover:border-its-blue/35'
      } ${className}`}
    >
      {(badge || title) && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-2.5 border-b ${
            highlight
              ? 'bg-amber-50/80 border-amber-200/70'
              : 'bg-gradient-to-r from-sky-50/80 to-white/60 border-its-blue/10'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h3 className="font-extrabold text-sm md:text-base text-its-navy tracking-tight truncate">
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {subtitle && <span className="text-[11px] font-mono text-its-blue font-semibold">{subtitle}</span>}
            {badge && (
              <span
                className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  highlight
                    ? 'bg-its-gold/25 text-its-navy border border-its-gold/60'
                    : 'bg-its-cover/10 text-its-cover border border-its-blue/20'
                }`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};
