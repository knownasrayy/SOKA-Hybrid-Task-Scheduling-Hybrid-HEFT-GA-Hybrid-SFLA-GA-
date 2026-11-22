import React from 'react';
import { Problem } from '../sim/model';
import { computeUpwardRanks } from '../sim/algorithms/heft';

interface DagViewProps {
  problem: Problem;
  activeTaskId?: number;
  scheduledTasks?: Set<number>;
  width?: number;
  height?: number;
}

export const DagView: React.FC<DagViewProps> = ({
  problem,
  activeTaskId,
  scheduledTasks = new Set(),
  width = 640,
  height = 300
}) => {
  const { tasks, edges = [] } = problem;
  const n = tasks.length;
  const { ranks } = computeUpwardRanks(problem);

  // Compute levels
  const levels = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (const p of tasks[i].deps || []) {
      if (levels[p] + 1 > levels[i]) {
        levels[i] = levels[p] + 1;
      }
    }
  }

  const maxLevel = Math.max(...levels, 0);
  const nodesPerLevel: number[][] = Array.from({ length: maxLevel + 1 }, () => []);
  tasks.forEach((t, i) => nodesPerLevel[levels[i]].push(i));

  const nodePositions: { x: number; y: number }[] = new Array(n);
  const padX = 50;
  const padY = 40;
  const availW = width - padX * 2;
  const availH = height - padY * 2;

  nodesPerLevel.forEach((lvlNodes, l) => {
    const x = padX + (maxLevel > 0 ? (l / maxLevel) * availW : availW / 2);
    lvlNodes.forEach((nodeIdx, rankInLvl) => {
      const y =
        lvlNodes.length === 1
          ? height / 2
          : padY + (rankInLvl / (lvlNodes.length - 1)) * availH;
      nodePositions[nodeIdx] = { x, y };
    });
  });

  return (
    <div className="relative its-glass border border-its-blue-light/30 rounded-xl p-3 shadow-its-card overflow-hidden">
      <div className="flex items-center justify-between text-xs font-mono text-its-blue-light mb-2 border-b border-its-blue-light/20 pb-1">
        <span>Struktur Workflow DAG ({n} Task, {edges.length} Dependency)</span>
        <span className="text-[11px] font-bold text-its-gold">Aliran: Entry (Kiri) → Exit (Kanan)</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px]">
        <defs>
          <marker
            id="dag-arrow-its"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#75BDE0" />
          </marker>
        </defs>

        {/* Directed Edges */}
        {edges.map((e, idx) => {
          const from = nodePositions[e.from];
          const to = nodePositions[e.to];
          if (!from || !to) return null;

          const isEdgeActive = activeTaskId === e.to;
          return (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isEdgeActive ? '#FDBB16' : '#233F7C'}
                strokeWidth={isEdgeActive ? 2.5 : 1.5}
                strokeDasharray={isEdgeActive ? '4 2' : undefined}
                markerEnd="url(#dag-arrow-its)"
              />
              {e.dataKb && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 4}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-its-blue-light select-none"
                >
                  {e.dataKb}KB
                </text>
              )}
            </g>
          );
        })}

        {/* Task Nodes */}
        {tasks.map((task, idx) => {
          const pos = nodePositions[idx];
          if (!pos) return null;

          const isActive = activeTaskId === idx;
          const isDone = scheduledTasks.has(idx);

          let fill = '#192841';
          let stroke = '#127BBE';
          let textColor = '#F3F4F6';

          if (isActive) {
            fill = '#FDBB16';
            stroke = '#FFFFFF';
            textColor = '#0B132B';
          } else if (isDone) {
            fill = '#12B0A2';
            stroke = '#75BDE0';
          }

          return (
            <g key={task.id} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 18 : 15}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 3 : 2}
                className="transition-all duration-200"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className="font-mono text-[11px] font-black pointer-events-none"
                fill={textColor}
              >
                T{task.id + 1}
              </text>
              <text
                x={pos.x}
                y={pos.y + 26}
                textAnchor="middle"
                className="font-mono text-[9px] fill-its-gold font-bold"
              >
                r:{ranks[idx]?.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
