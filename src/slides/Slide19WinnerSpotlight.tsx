import React, { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { simManager } from '../store/simulationStore';
import { Crown, Sparkles, Award, ArrowUpRight, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Slide19WinnerSpotlight: React.FC = () => {
  const [, setTick] = useState(0);
  const winner = simManager.getWinner();
  const aggregates = simManager.getAggregates();

  useEffect(() => {
    return simManager.subscribe(() => setTick((t) => t + 1));
  }, []);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, [winner?.winnerId]);

  if (!winner) {
    return (
      <div className="flex flex-col items-center justify-center h-full font-mono text-muted">
        Memuat kalkulasi pemenang berbasis data...
      </div>
    );
  }

  const isHeftWinner = winner.winnerId.includes('heft_ga');

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="19 · 🏆 WINNER SPOTLIGHT" color="yellow" />
          <span className="font-mono text-xs text-muted">Dihitung Otomatis Berbasis Data Skor Komposit</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Pemenang Komparasi: <Highlight color={isHeftWinner ? 'blue' : 'green'}>{winner.winnerName}</Highlight>!
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        {/* Winner Hero Card */}
        <Card highlight className="border-4 border-now flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-xl bg-now border border-ink text-ink">
                <Crown className="w-8 h-8 fill-current" />
              </span>
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-ink text-paper">
                SKOR: {winner.winnerScore.toFixed(3)}
              </span>
            </div>

            <h3 className="text-2xl font-black text-ink mb-2">{winner.winnerName}</h3>
            <p className="text-xs text-[#333] leading-relaxed mb-4">
              {winner.takeawaySentence}
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-ink font-mono text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-muted">Runner-up:</span>
              <span className="font-bold text-ink">{winner.runnerUpName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Margin Keunggulan:</span>
              <span className="font-bold text-safe">+{winner.scoreMarginPercent.toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* Breakdown Keunggulan per Metrik */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {winner.metricComparison.map((m) => (
            <Card key={m.metric} className="flex flex-col justify-between p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-muted">{m.label}</span>
                <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded border ${
                  m.winnerIsBetter ? 'bg-[#dcf3e1] text-[#2f9e44] border-safe' : 'bg-paper text-muted border-line'
                }`}>
                  {m.winnerIsBetter ? `Lebih Baik +${m.diffPercent.toFixed(1)}%` : `Selisih ${m.diffPercent.toFixed(1)}%`}
                </span>
              </div>

              <div className="flex items-baseline justify-between my-2">
                <div>
                  <span className="text-xs font-mono text-muted block">Pemenang:</span>
                  <span className="text-xl font-black text-ink">
                    {m.winnerValue.toFixed(m.metric === 'cost' ? 4 : 2)} <span className="text-xs font-normal text-muted">{m.unit}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-muted block">Runner-up:</span>
                  <span className="text-sm font-mono text-muted">
                    {m.runnerUpValue.toFixed(m.metric === 'cost' ? 4 : 2)} {m.unit}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-muted font-mono pt-2 border-t border-line">
                Bobot Komposit: {m.metric === 'makespan' ? '35%' : m.metric === 'cost' ? '25%' : '15%'}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Kepatuhan Ketentuan 5:</strong> Algoritma pemenang inilah yang dianalisis secara mendalam cara kerjanya di slide berikutnya.</span>
        <span className="bg-safe text-white px-2 py-0.5 rounded font-bold">Winner Spotlight Active</span>
      </div>
    </div>
  );
};
