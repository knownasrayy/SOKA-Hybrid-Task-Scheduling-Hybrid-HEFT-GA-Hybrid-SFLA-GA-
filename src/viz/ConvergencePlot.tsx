import React from 'react';

interface SeriesData {
  id: string;
  name: string;
  color: string;
  points: { eval: number; val: number }[];
}

interface ConvergencePlotProps {
  series: SeriesData[];
  yLabel?: string;
  width?: number;
  height?: number;
}

export const ConvergencePlot: React.FC<ConvergencePlotProps> = ({
  series,
  yLabel = 'Makespan (detik)',
  width = 600,
  height = 240
}) => {
  if (series.length === 0 || series.every((s) => s.points.length === 0)) {
    return (
      <div className="its-glass rounded-2xl p-4 text-center font-mono text-sm text-its-silver/80 border border-its-blue/20">
        Tidak ada data kurva konvergensi.
      </div>
    );
  }

  // Find min/max across all points
  const allX = series.flatMap((s) => s.points.map((p) => p.eval));
  const allY = series.flatMap((s) => s.points.map((p) => p.val));

  const minX = Math.min(...allX, 0);
  const maxX = Math.max(...allX, 100);

  const minY = Math.min(...allY, 0) * 0.95;
  const maxY = Math.max(...allY, 10) * 1.05;

  const padL = 55;
  const padR = 25;
  const padT = 20;
  const padB = 40;

  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const scaleX = (x: number) => padL + ((x - minX) / (maxX - minX || 1)) * plotW;
  const scaleY = (y: number) => padT + (1 - (y - minY) / (maxY - minY || 1)) * plotH;

  return (
    <div className="its-glass rounded-2xl p-4 border border-its-blue/30 shadow-its-card">
      <div className="flex items-center justify-between text-xs font-mono text-its-silver mb-2 border-b border-its-blue/20 pb-2">
        <span className="font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-its-gold animate-pulse" />
          Kurva Konvergensi Multi-Algoritma
        </span>
        <span className="text-its-blue-light">Evaluasi vs {yLabel}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[260px]">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const yVal = minY + ratio * (maxY - minY);
          const yPos = scaleY(yVal);
          return (
            <g key={idx}>
              <line
                x1={padL}
                y1={yPos}
                x2={width - padR}
                y2={yPos}
                stroke="rgba(117,189,224,0.18)"
                strokeDasharray="3 3"
              />
              <text
                x={padL - 8}
                y={yPos + 4}
                textAnchor="end"
                className="font-mono text-[10px] fill-its-silver/80"
              >
                {yVal.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* X Axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const xVal = minX + ratio * (maxX - minX);
          const xPos = scaleX(xVal);
          return (
            <g key={idx}>
              <line x1={xPos} y1={height - padB} x2={xPos} y2={height - padB + 5} stroke="#75BDE0" />
              <text
                x={xPos}
                y={height - padB + 18}
                textAnchor="middle"
                className="font-mono text-[10px] fill-its-silver/80"
              >
                {Math.round(xVal)}
              </text>
            </g>
          );
        })}

        {/* Series Lines */}
        {series.map((s) => {
          if (s.points.length === 0) return null;
          const d = s.points
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.eval)} ${scaleY(p.val)}`)
            .join(' ');

          return (
            <g key={s.id}>
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${s.color}66)` }}
              />
              {/* Endpoint marker */}
              {s.points.length > 0 && (
                <circle
                  cx={scaleX(s.points[s.points.length - 1].eval)}
                  cy={scaleY(s.points[s.points.length - 1].val)}
                  r={4.5}
                  fill={s.color}
                  stroke="#0B132B"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2 pt-2 border-t border-its-blue/20 text-xs font-mono">
        {series.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-its-darkNavy/60 border border-its-blue/30 text-its-silver">
            <span className="w-2.5 h-2.5 rounded-full shadow-its-glow" style={{ backgroundColor: s.color }} />
            <span className="font-semibold text-white">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
