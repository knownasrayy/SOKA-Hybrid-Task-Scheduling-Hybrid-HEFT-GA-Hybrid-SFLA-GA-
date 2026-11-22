import { Problem, Result, Solver, Params, StepEvent } from './model';
import { ALL_SOLVERS, SOLVER_MAP } from './algorithms/registry';
import { createRNG } from './rng';
import { computeAggregates, determineWinner, AggregateStats, WinnerDecision } from './stats';

export interface MultiRunOptions {
  runs?: number;
  baseSeed?: number;
  evaluationBudget?: number;
  solvers?: string[];
  recordSteps?: boolean;
  onProgress?: (progress: { current: number; total: number; currentSolver: string; percent: number }) => void;
}

export interface SimulationSummary {
  problem: Problem;
  runsPerSolver: number;
  evaluationBudget: number;
  timestamp: string;
  aggregates: AggregateStats[];
  winner: WinnerDecision | null;
  rawResults: Record<string, Result[]>;
}

/**
 * Runs multi-run experiments for specified algorithms with controlled random seeds.
 * Deterministic and reproducible: Seed r = baseSeed + r * 97.
 */
export async function runSimulation(
  problem: Problem,
  options: MultiRunOptions = {}
): Promise<SimulationSummary> {
  const runs = options.runs || 30;
  const baseSeed = options.baseSeed || 2026;
  const evaluationBudget = options.evaluationBudget || 10000;
  const solverIds = options.solvers || ['heft_ga', 'sfla_ga', 'heft_pure', 'ga_pure', 'sfla_pure', 'wca_pure'];

  const rawResults: Record<string, Result[]> = {};
  const activeSolvers = solverIds.map((id) => SOLVER_MAP[id]).filter((s): s is Solver => Boolean(s));

  const totalSteps = activeSolvers.reduce((acc, s) => acc + (s.family === 'heuristic' ? 1 : runs), 0);
  let completedSteps = 0;

  for (const solver of activeSolvers) {
    rawResults[solver.id] = [];

    // Deterministic heuristic (HEFT) only needs 1 run
    const effectiveRuns = solver.family === 'heuristic' ? 1 : runs;

    for (let r = 0; r < effectiveRuns; r++) {
      const seed = baseSeed + r * 97;
      const rng = createRNG(seed);

      const params: Params = {
        evaluationBudget,
        populationSize: 24,
        maxGenerations: Math.ceil(evaluationBudget / 24),
        crossoverRate: 0.8,
        mutationRate: 0.1,
        memeplexCount: 4,
        tournamentSize: 4,
        recordSteps: r === 0 && options.recordSteps
      };

      const result = solver.run(problem, params, rng);
      rawResults[solver.id].push(result);

      completedSteps++;
      if (options.onProgress) {
        options.onProgress({
          current: completedSteps,
          total: totalSteps,
          currentSolver: solver.name,
          percent: Math.round((completedSteps / totalSteps) * 100)
        });
      }

      // Small tick to keep browser UI responsive
      if (r % 5 === 0) {
        await new Promise((res) => setTimeout(res, 0));
      }
    }
  }

  const aggregates = computeAggregates(rawResults);
  const winner = determineWinner(aggregates);

  return {
    problem,
    runsPerSolver: runs,
    evaluationBudget,
    timestamp: new Date().toISOString(),
    aggregates,
    winner,
    rawResults
  };
}
