import { Result, Metrics } from './model';

export interface AggregateStats {
  solverId: string;
  solverName: string;
  family: string;
  pattern: string;
  color: string;
  runs: number;
  makespan: { mean: number; std: number; min: number; max: number; median: number };
  cost: { mean: number; std: number; min: number; max: number; median: number };
  utilization: { mean: number; std: number; min: number; max: number; median: number };
  imbalance: { mean: number; std: number; min: number; max: number; median: number };
  computeMs: { mean: number; std: number; min: number; max: number; median: number };
  compositeScore: number;
  normalizedMetrics: {
    makespan: number;
    cost: number;
    utilization: number;
    imbalance: number;
    computeMs: number;
  };
  bestRun: Result;
  convergenceAverage: { eval: number; bestFitness: number; bestMakespan: number }[];
}

export interface WinnerDecision {
  winnerId: string;
  winnerName: string;
  winnerScore: number;
  runnerUpId: string;
  runnerUpName: string;
  runnerUpScore: number;
  scoreMarginPercent: number;
  isCloseCall: boolean;
  takeawaySentence: string;
  metricComparison: {
    metric: string;
    label: string;
    winnerValue: number;
    runnerUpValue: number;
    unit: string;
    diffPercent: number;
    winnerIsBetter: boolean;
  }[];
}

function calcSeriesStats(values: number[]) {
  if (values.length === 0) {
    return { mean: 0, std: 0, min: 0, max: 0, median: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;
  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length;
  const std = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  return { mean, std, min, max, median };
}

/**
 * Computes multi-run summary statistics and ranks solvers by composite score (PRD §10).
 */
export function computeAggregates(
  runResults: Record<string, Result[]>,
  weights = {
    makespan: 0.35,
    cost: 0.25,
    utilization: 0.15,
    imbalance: 0.15,
    computeMs: 0.10
  }
): AggregateStats[] {
  const solverIds = Object.keys(runResults);
  if (solverIds.length === 0) return [];

  const rawStats = solverIds.map((id) => {
    const runs = runResults[id];
    const first = runs[0];
    const makespans = runs.map((r) => r.metrics.makespan);
    const costs = runs.map((r) => r.metrics.cost);
    const utils = runs.map((r) => r.metrics.utilization);
    const imbs = runs.map((r) => r.metrics.imbalance);
    const computes = runs.map((r) => r.metrics.computeMs);

    // Pick best run (lowest makespan or best fitness)
    const bestRun = [...runs].sort((a, b) => a.metrics.makespan - b.metrics.makespan)[0];

    // Compute average convergence history
    const maxHistoryLen = Math.max(...runs.map((r) => r.history.length), 1);
    const convergenceAverage = [];
    for (let step = 0; step < maxHistoryLen; step++) {
      let sumFit = 0;
      let sumMk = 0;
      let count = 0;
      for (const r of runs) {
        if (r.history[step]) {
          sumFit += r.history[step].bestFitness;
          sumMk += r.history[step].bestMakespan;
          count++;
        }
      }
      if (count > 0) {
        convergenceAverage.push({
          eval: runs[0].history[step]?.eval ?? step * 100,
          bestFitness: sumFit / count,
          bestMakespan: sumMk / count
        });
      }
    }

    return {
      solverId: id,
      solverName: first.solverName,
      family: first.family,
      pattern: first.pattern || '',
      color: '',
      runs: runs.length,
      makespan: calcSeriesStats(makespans),
      cost: calcSeriesStats(costs),
      utilization: calcSeriesStats(utils),
      imbalance: calcSeriesStats(imbs),
      computeMs: calcSeriesStats(computes),
      bestRun,
      convergenceAverage
    };
  });

  // Global min/max across all solvers for normalization [0, 1]
  const minMk = Math.min(...rawStats.map((s) => s.makespan.mean));
  const maxMk = Math.max(...rawStats.map((s) => s.makespan.mean));

  const minCost = Math.min(...rawStats.map((s) => s.cost.mean));
  const maxCost = Math.max(...rawStats.map((s) => s.cost.mean));

  const minUtil = Math.min(...rawStats.map((s) => s.utilization.mean));
  const maxUtil = Math.max(...rawStats.map((s) => s.utilization.mean));

  const minImb = Math.min(...rawStats.map((s) => s.imbalance.mean));
  const maxImb = Math.max(...rawStats.map((s) => s.imbalance.mean));

  const minTime = Math.min(...rawStats.map((s) => s.computeMs.mean));
  const maxTime = Math.max(...rawStats.map((s) => s.computeMs.mean));

  const norm = (val: number, min: number, max: number, invert = false) => {
    if (Math.abs(max - min) < 1e-9) return 1.0;
    const scaled = (val - min) / (max - min);
    return invert ? 1 - scaled : scaled;
  };

  const scoredStats: AggregateStats[] = rawStats.map((s) => {
    // For makespan, cost, imbalance, computeMs: lower is better (so invert = true)
    // For utilization: higher is better (invert = false)
    const nMetrics = {
      makespan: norm(s.makespan.mean, minMk, maxMk, true),
      cost: norm(s.cost.mean, minCost, maxCost, true),
      utilization: norm(s.utilization.mean, minUtil, maxUtil, false),
      imbalance: norm(s.imbalance.mean, minImb, maxImb, true),
      computeMs: norm(s.computeMs.mean, minTime, maxTime, true)
    };

    const compositeScore =
      weights.makespan * nMetrics.makespan +
      weights.cost * nMetrics.cost +
      weights.utilization * nMetrics.utilization +
      weights.imbalance * nMetrics.imbalance +
      weights.computeMs * nMetrics.computeMs;

    return {
      ...s,
      compositeScore,
      normalizedMetrics: nMetrics
    };
  });

  // Sort descending by composite score
  scoredStats.sort((a, b) => b.compositeScore - a.compositeScore);
  return scoredStats;
}

/**
 * Determines the Winner between the two hybrid algorithms (HEFT-GA vs SFLA-GA)
 * strictly data-driven as mandated by PRD §10.
 */
export function determineWinner(aggregates: AggregateStats[]): WinnerDecision | null {
  const hybrids = aggregates.filter((a) => a.solverId.includes('heft_ga') || a.solverId.includes('sfla_ga'));
  if (hybrids.length < 2) {
    if (aggregates.length < 2) return null;
    // Fallback to top 2 solvers if specific IDs not matching
    hybrids.push(aggregates[0], aggregates[1]);
  }

  const sortedHybrids = [...hybrids].sort((a, b) => b.compositeScore - a.compositeScore);
  const winner = sortedHybrids[0];
  const runnerUp = sortedHybrids[1];

  const scoreMarginPercent =
    runnerUp.compositeScore > 0
      ? ((winner.compositeScore - runnerUp.compositeScore) / runnerUp.compositeScore) * 100
      : 0;

  const isCloseCall = scoreMarginPercent < 2.0;

  const mkDiff = ((runnerUp.makespan.mean - winner.makespan.mean) / runnerUp.makespan.mean) * 100;
  const costDiff = ((runnerUp.cost.mean - winner.cost.mean) / runnerUp.cost.mean) * 100;
  const utilDiff = ((winner.utilization.mean - runnerUp.utilization.mean) / runnerUp.utilization.mean) * 100;
  const imbDiff = ((runnerUp.imbalance.mean - winner.imbalance.mean) / runnerUp.imbalance.mean) * 100;

  const metricComparison = [
    {
      metric: 'makespan',
      label: 'Makespan Rata-rata',
      winnerValue: winner.makespan.mean,
      runnerUpValue: runnerUp.makespan.mean,
      unit: 'detik',
      diffPercent: Math.abs(mkDiff),
      winnerIsBetter: winner.makespan.mean <= runnerUp.makespan.mean
    },
    {
      metric: 'cost',
      label: 'Biaya Komputasi',
      winnerValue: winner.cost.mean,
      runnerUpValue: runnerUp.cost.mean,
      unit: 'USD',
      diffPercent: Math.abs(costDiff),
      winnerIsBetter: winner.cost.mean <= runnerUp.cost.mean
    },
    {
      metric: 'utilization',
      label: 'Utilisasi Resource',
      winnerValue: winner.utilization.mean * 100,
      runnerUpValue: runnerUp.utilization.mean * 100,
      unit: '%',
      diffPercent: Math.abs(utilDiff),
      winnerIsBetter: winner.utilization.mean >= runnerUp.utilization.mean
    },
    {
      metric: 'imbalance',
      label: 'Degree of Imbalance',
      winnerValue: winner.imbalance.mean,
      runnerUpValue: runnerUp.imbalance.mean,
      unit: '',
      diffPercent: Math.abs(imbDiff),
      winnerIsBetter: winner.imbalance.mean <= runnerUp.imbalance.mean
    }
  ];

  // Synthesize dynamic summary sentence
  const bestAdvantage = metricComparison.find((m) => m.winnerIsBetter && m.diffPercent > 0.5) || metricComparison[0];
  const takeawaySentence = `${winner.solverName} unggul secara keseluruhan dengan skor komposit ${winner.compositeScore.toFixed(3)} vs ${runnerUp.compositeScore.toFixed(3)}, mencatatkan keunggulan ${bestAdvantage.label.toLowerCase()} sebesar ${bestAdvantage.diffPercent.toFixed(1)}% lebih efisien.`;

  return {
    winnerId: winner.solverId,
    winnerName: winner.solverName,
    winnerScore: winner.compositeScore,
    runnerUpId: runnerUp.solverId,
    runnerUpName: runnerUp.solverName,
    runnerUpScore: runnerUp.compositeScore,
    scoreMarginPercent,
    isCloseCall,
    takeawaySentence,
    metricComparison
  };
}
