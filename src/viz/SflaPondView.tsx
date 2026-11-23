import React from 'react';

interface Frog {
  id: number;
  memeplex: number;
  position: number[];
  fitness: number;
  isBest?: boolean;
  isWorst?: boolean;
}

interface SflaPondViewProps {
  frogs: Frog[];
  memeplexCount?: number;
  activeMemeplex?: number;
}

export const SflaPondView: React.FC<SflaPondViewProps> = ({
  frogs,
  memeplexCount = 4,
  activeMemeplex
}) => {
  const memColors = ['#127BBE', '#12B0A2', '#F47D52', '#7C3AED'];

  const memGroups: Frog[][] = Array.from({ length: memeplexCount }, () => []);
  frogs.forEach((f) => {
    const mem = f.memeplex % memeplexCount;
    memGroups[mem].push(f);
  });

  return (
    <div className="its-glass rounded-xl p-4">
      <div className="flex items-center justify-between text-xs font-mono text-its-blue mb-3 border-b border-its-blue/15 pb-2">
        <span className="font-bold text-its-navy">Kolam Katak SFLA (Partisi {memeplexCount} Memeplex)</span>
        <span>Evolusi Lokal dalam Memeplex → Pertukaran Global (Shuffle)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {memGroups.map((group, memIdx) => {
          const isActive = activeMemeplex === undefined || activeMemeplex === memIdx;

          return (
            <div
              key={memIdx}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-white border-its-blue/40 shadow-sm'
                  : 'opacity-50 bg-its-slate border-its-blue/15'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-2 pb-1 border-b border-its-blue/15">
                <span style={{ color: memColors[memIdx % memColors.length] }}>
                  Memeplex #{memIdx + 1}
                </span>
                <span className="text-[10px] text-its-silver">{group.length} Katak</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {group.map((frog, idx) => {
                  const isMemBest = idx === 0;
                  const isMemWorst = idx === group.length - 1;

                  return (
                    <div
                      key={frog.id}
                      className={`flex items-center justify-between px-2 py-1 rounded border text-xs font-mono ${
                        isMemBest
                          ? 'bg-teal-50 border-its-tosca text-its-tosca font-black'
                          : isMemWorst
                          ? 'bg-orange-50 border-its-crusta text-its-crusta font-bold'
                          : 'bg-its-slate border-its-blue/15 text-its-navy'
                      }`}
                    >
                      <span>
                        🐸 K-{frog.id + 1}
                        {isMemBest ? ' (Xb)' : isMemWorst ? ' (Xw)' : ''}
                      </span>
                      <span>{frog.fitness.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
