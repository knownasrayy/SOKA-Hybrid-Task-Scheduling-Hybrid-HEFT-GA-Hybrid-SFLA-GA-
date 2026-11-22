import React from 'react';

interface GaPopulationViewProps {
  population: { id: number; assignment: number[]; fitness: number; tag?: string }[];
  crossoverPoints?: [number, number];
  mutatedGenes?: [number, number][];
  vmCount?: number;
}

export const GaPopulationView: React.FC<GaPopulationViewProps> = ({
  population,
  crossoverPoints,
  mutatedGenes = [],
  vmCount = 4
}) => {
  const vmColors = ['#127BBE', '#26AEE4', '#12B0A2', '#75BDE0'];

  return (
    <div className="its-glass border border-its-blue-light/30 rounded-xl p-4 shadow-its-card overflow-x-auto">
      <div className="flex items-center justify-between text-xs font-mono text-its-blue-light mb-3 border-b border-its-blue-light/20 pb-2">
        <span className="font-bold text-its-silver">Representasi Kromosom GA dalam Memori</span>
        <span>Gen = VM Alokasi (0..{vmCount - 1}) per Task</span>
      </div>

      <div className="flex flex-col gap-2">
        {population.map((chrom, chIdx) => {
          const isElite = chrom.tag === 'Best Seed' || chrom.tag === 'Elite';

          return (
            <div
              key={chrom.id}
              className={`flex items-center gap-3 p-1.5 rounded-lg border transition-all ${
                isElite
                  ? 'its-glass-gold border-its-gold'
                  : 'bg-its-dark/60 border-its-blue-light/20'
              }`}
            >
              <div className="w-20 font-mono text-xs flex-none flex items-center justify-between">
                <span className="text-its-silver font-bold">Chr-{chIdx + 1}</span>
                {chrom.tag && (
                  <span className="text-[10px] bg-its-gold text-its-navy px-1 py-0.2 rounded font-black">
                    {chrom.tag}
                  </span>
                )}
              </div>

              {/* Genes */}
              <div className="flex items-center gap-1 flex-1">
                {chrom.assignment.slice(0, 16).map((vmId, geneIdx) => {
                  const isCrossOverZone =
                    crossoverPoints &&
                    geneIdx >= crossoverPoints[0] &&
                    geneIdx <= crossoverPoints[1];
                  const isMutated = mutatedGenes.some(
                    ([c, g]) => c === chIdx && g === geneIdx
                  );

                  return (
                    <div
                      key={geneIdx}
                      style={{ backgroundColor: vmColors[vmId % vmColors.length] }}
                      className={`w-7 h-7 rounded border border-white/20 flex items-center justify-center font-mono text-xs font-black text-white transition-all ${
                        isCrossOverZone ? 'ring-2 ring-its-gold scale-105' : ''
                      } ${isMutated ? 'animate-pulse scale-110 ring-2 ring-red-400' : ''}`}
                      title={`Task T${geneIdx + 1} -> VM-${vmId + 1}`}
                    >
                      {vmId + 1}
                    </div>
                  );
                })}
                {chrom.assignment.length > 16 && (
                  <span className="font-mono text-xs text-its-blue-light">+{chrom.assignment.length - 16}</span>
                )}
              </div>

              {/* Fitness */}
              <div className="w-24 text-right font-mono text-xs font-bold text-its-gold">
                fit: {chrom.fitness.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
