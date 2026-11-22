import React from 'react';
import { AggregateStats } from '../sim/stats';

interface BoxPlotChartProps {
  statsList: AggregateStats[];
  metricKey?: 'makespan' | 'cost' | 'utilization' | 'imbalance';
  yLabel?: string;
  width?: number;
  height?: number;
}

export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  statsList,
  metricKey = 'makespan',
  yLabel = 'Makespan (detik)',
  width = 600,
  height = 240
}) => {
  if (statsList.length === 0) return null;

  const data = statsList.map((s) => ({
    name: s.solverName.split('(')[0].trim(),
    color: s.color || '#2563eb',
    stats: s[metricKey]
  }));

  const allMin = Math.min(...data.map((d) => d.stats.min));
  const allMax = Math.max(...data.map((d) => d.stats.max));
  const padY = (allMax - allMin) * 0.1 || 1;
  const minY = Math.max(0, allMin - padY);
  const maxY = allMax + padY;

  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 40;

  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const scaleY = (val: number) => padT + (1 - (val - minY) / (maxY - minY)) * plotH;
  const colWidth = plotW / data.length;

  return (
    <div className="its-glass rounded-2xl p-4 border border-its-blue/30 shadow-its-card">
      <div className="flex items-center justify-between text-xs font-mono text-its-silver mb-2 border-b border-its-blue/20 pb-2">
        <span className="font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-its-gold animate-pulse" />
          Sebaran Statistik {yLabel} (N=30 Run)
        </span>
        <span className="text-its-blue-light">Whisker: Min/Max · Box: Mean ± Std</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[240px]">
        {/* Y Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const yVal = minY + r * (maxY - minY);
          const yPos = scaleY(yVal);
          return (
            <g key={i}>
              <line x1={padL} y1={yPos} x2={width - padR} y2={yPos} stroke="rgba(117,189,224,0.18)" strokeDasharray="3 3" />
              <text x={padL - 8} y={yPos + 4} textAnchor="end" className="font-mono text-[10px] fill-its-silver/80">
                {yVal.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Boxplots per algorithm */}
        {data.map((item, idx) => {
          const cx = padL + idx * colWidth + colWidth / 2;
          const { mean, std, min, max, median } = item.stats;

          const yMin = scaleY(min);
          const yMax = scaleY(max);
          const yMeanTop = scaleY(mean + std);
          const yMeanBottom = scaleY(Math.max(minY, mean - std));
          const yMedian = scaleY(median);

          return (
            <g key={idx}>
              {/* Vertical Whisker Line */}
              <line x1={cx} y1={yMin} x2={cx} y2={yMax} stroke="#75BDE0" strokeWidth={1.5} />
              {/* Min & Max Whisker Caps */}
              <line x1={cx - 10} y1={yMin} x2={cx + 10} y2={yMin} stroke="#75BDE0" strokeWidth={1.5} />
              <line x1={cx - 10} y1={yMax} x2={cx + 10} y2={yMax} stroke="#75BDE0" strokeWidth={1.5} />

              {/* Box (Mean +- Std) */}
              <rect
                x={cx - 20}
                y={yMeanTop}
                width={40}
                height={Math.max(4, yMeanBottom - yMeanTop)}
                fill={item.color}
                fillOpacity={0.35}
                stroke={item.color}
                strokeWidth={2}
                rx={6}
                style={{ filter: `drop-shadow(0 0 6px ${item.color}55)` }}
              />

              {/* Median Line */}
              <line x1={cx - 20} y1={yMedian} x2={cx + 20} y2={yMedian} stroke="#FDBB16" strokeWidth={2.5} />

              {/* X Label */}
              <text
                x={cx}
                y={height - padB + 16}
                textAnchor="middle"
                className="font-mono text-[10px] font-bold fill-white"
              >
                {item.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
