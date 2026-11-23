import React from 'react';

interface RadarEntity {
  name: string;
  color: string;
  scores: {
    makespan: number;     // Normalized [0, 1] (higher = better)
    cost: number;
    utilization: number;
    imbalance: number;
    speed: number;
  };
}

interface RadarChartProps {
  entities: RadarEntity[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ entities, size = 320 }) => {
  const axes = [
    { key: 'makespan', label: 'Makespan (Cepat)' },
    { key: 'cost', label: 'Hemat Biaya' },
    { key: 'utilization', label: 'Utilisasi VM' },
    { key: 'imbalance', label: 'Load Balance' },
    { key: 'speed', label: 'Waktu Scheduler' }
  ];

  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (Math.PI * 2) / axes.length;

  const getCoord = (axisIndex: number, value: number) => {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = radius * Math.max(0, Math.min(1, value));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  return (
    <div className="its-glass rounded-2xl p-4 border border-its-blue/25 shadow-its-card flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-xs font-mono text-its-silver mb-1 pb-1 border-b border-its-blue/15">
        <span className="font-bold text-its-navy flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-its-gold" />
          Perbandingan Multi-Dimensi (Radar)
        </span>
        <span className="text-its-blue font-semibold">Nilai Ternormalisasi [0..1]</span>
      </div>

      <svg width={size} height={size} className="overflow-visible my-2">
        {/* Background concentric polygons */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, lIdx) => {
          const pts = axes
            .map((_, aIdx) => {
              const c = getCoord(aIdx, level);
              return `${c.x},${c.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={lIdx}
              points={pts}
              fill="none"
              stroke="rgba(18,123,190,0.18)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((axis, aIdx) => {
          const edge = getCoord(aIdx, 1.0);
          const labelAngle = aIdx * angleStep - Math.PI / 2;
          const labelR = radius + 22;
          const lx = center + labelR * Math.cos(labelAngle);
          const ly = center + labelR * Math.sin(labelAngle);

          return (
            <g key={axis.key}>
              <line x1={center} y1={center} x2={edge.x} y2={edge.y} stroke="rgba(18,123,190,0.25)" strokeWidth={1} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-[10px] font-bold fill-its-navy"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Polygons per Entity */}
        {entities.map((entity, eIdx) => {
          const pts = axes
            .map((axis, aIdx) => {
              const val = entity.scores[axis.key as keyof typeof entity.scores] ?? 0.5;
              const c = getCoord(aIdx, val);
              return `${c.x},${c.y}`;
            })
            .join(' ');

          return (
            <polygon
              key={eIdx}
              points={pts}
              fill={entity.color}
              fillOpacity={0.22}
              stroke={entity.color}
              strokeWidth={2.5}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-its-blue/15 text-xs font-mono">
        {entities.map((e, idx) => (
          <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-its-slate border border-its-blue/20 text-its-navy">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
            <span className="font-semibold text-its-navy">{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
