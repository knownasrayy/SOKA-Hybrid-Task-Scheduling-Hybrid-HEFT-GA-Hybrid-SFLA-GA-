import React, { useState } from 'react';
import { TaskAssignment, VM } from '../sim/model';

interface GanttChartProps {
  schedule: TaskAssignment[];
  vms: VM[];
  makespan?: number;
  highlightTaskId?: number;
  height?: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  schedule,
  vms,
  makespan: propMakespan,
  highlightTaskId,
  height = 200
}) => {
  const [hoveredTask, setHoveredTask] = useState<TaskAssignment | null>(null);

  const calcMakespan = propMakespan || Math.max(...schedule.map((s) => s.finishTime), 1);

  const getLeftPct = (time: number) => Math.min(100, Math.max(0, (time / calcMakespan) * 100));
  const getWidthPct = (dur: number) => Math.max(1.5, Math.min(100, (dur / calcMakespan) * 100));

  // ITS VM Color Tiers
  const vmColors = ['#127BBE', '#26AEE4', '#12B0A2', '#75BDE0'];

  return (
    <div className="relative its-glass border border-its-blue-light/30 rounded-xl p-4 shadow-its-card overflow-hidden">
      {/* Header axis */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-its-blue-light/20 text-xs font-mono text-its-blue-light">
        <span>Timeline Virtual Machine (Datacenter)</span>
        <span className="font-bold text-its-gold">Makespan: {calcMakespan.toFixed(2)} detik</span>
      </div>

      {/* Main Gantt Area */}
      <div className="flex flex-col gap-2.5 relative" style={{ minHeight: height }}>
        {vms.map((vm, vmIdx) => {
          const vmTasks = schedule.filter((s) => s.vmId === vm.id);
          const vmBusyTime = vmTasks.reduce((acc, t) => acc + t.executionTime, 0);
          const vmLoadPercent = Math.min(100, Math.round((vmBusyTime / calcMakespan) * 100));

          return (
            <div key={vm.id} className="flex items-center gap-3">
              {/* VM Label */}
              <div className="w-28 flex-none font-mono text-xs">
                <div className="font-extrabold text-its-silver truncate">{vm.name}</div>
                <div className="text-[10px] text-its-blue-light flex items-center justify-between">
                  <span>{vm.mips} MIPS</span>
                  <span className="font-bold text-its-gold">{vmLoadPercent}%</span>
                </div>
              </div>

              {/* VM Lane */}
              <div className="relative flex-1 h-9 bg-its-dark/80 rounded-lg border border-its-blue-light/20 overflow-hidden">
                {vmTasks.map((t) => {
                  const left = getLeftPct(t.startTime);
                  const width = getWidthPct(t.executionTime);
                  const isHighlighted = highlightTaskId !== undefined && t.taskId === highlightTaskId;

                  return (
                    <div
                      key={t.taskId}
                      onMouseEnter={() => setHoveredTask(t)}
                      onMouseLeave={() => setHoveredTask(null)}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: isHighlighted ? '#FDBB16' : vmColors[vmIdx % vmColors.length]
                      }}
                      className={`absolute top-1 bottom-1 rounded border border-white/20 flex items-center justify-center font-mono text-[11px] font-bold text-white transition-all cursor-pointer truncate px-1 ${
                        isHighlighted ? 'text-its-navy ring-2 ring-white z-20 scale-105' : 'hover:brightness-125 z-10'
                      }`}
                    >
                      T{t.taskId + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Vertical Makespan Marker Line */}
        <div
          className="absolute top-0 bottom-4 w-0 border-r-2 border-dashed border-its-gold z-30 pointer-events-none"
          style={{ left: `calc(112px + 12px + ${(100 - (124 / 800) * 100) * 0.99}%)` }}
        />
      </div>

      {/* Axis ruler */}
      <div className="ml-31 flex justify-between text-[10px] font-mono text-its-blue-light/70 pt-2 border-t border-its-blue-light/20">
        <span>0s</span>
        <span>{(calcMakespan * 0.25).toFixed(1)}s</span>
        <span>{(calcMakespan * 0.5).toFixed(1)}s</span>
        <span>{(calcMakespan * 0.75).toFixed(1)}s</span>
        <span className="font-bold text-its-gold">{calcMakespan.toFixed(1)}s</span>
      </div>

      {/* Hover Tooltip */}
      {hoveredTask && (
        <div className="absolute top-2 right-4 bg-its-navy/95 text-its-silver text-xs font-mono px-3 py-1.5 rounded-lg border border-its-gold shadow-its-glow z-40 pointer-events-none">
          <div className="font-bold text-its-gold">Task T{hoveredTask.taskId + 1}</div>
          <div>Mulai: {hoveredTask.startTime.toFixed(2)}s · Selesai: {hoveredTask.finishTime.toFixed(2)}s</div>
          <div>Durasi: {hoveredTask.executionTime.toFixed(2)}s · Comm Transfer: {hoveredTask.commCost.toFixed(3)}s</div>
        </div>
      )}
    </div>
  );
};
