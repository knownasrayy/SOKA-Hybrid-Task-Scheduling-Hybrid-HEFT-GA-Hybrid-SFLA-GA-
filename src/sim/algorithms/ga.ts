import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../model';
import { RNG } from '../rng';

export const gaSolver: Solver = {
  id: 'ga_pure',
  name: 'GA Murni (Genetic Algorithm)',
  family: 'metaheuristic',
  pattern: 'Metaheuristik Murni (Baseline)',
  color: '#141414',
  citationId: 'aziza2020',
  description: 'Algoritma genetika murni dengan inisialisasi populasi acak 100%, seleksi turnamen, crossover 2-titik, dan mutasi integer. Mengalami kelemahan konvergensi lambat di awal karena ketiadaan benih solusi berkualitas.',

  run(problem: Problem, params: any, rng: RNG, onStep?: (s: StepEvent) => void): Result {
    const t0 = performance.now();
    const { tasks, vms } = problem;
    const n = tasks.length;
    const m = vms.length;

    const popSize = params.populationSize || 20;
    const budget = params.evaluationBudget || 10000;
    const maxGen = params.maxGenerations || Math.ceil(budget / popSize);
    const pc = params.crossoverRate ?? 0.8;
    const pm = params.mutationRate ?? 0.1;
    const tourSize = params.tournamentSize || 4;

    // Generate random initial population
    let population: number[][] = Array.from({ length: popSize }, () =>
      Array.from({ length: n }, () => rng.int(0, m - 1))
    );

    let evals = 0;
    let fitnesses = population.map((ind) => {
      evals++;
      return evaluateSchedule(ind, problem).fitness;
    });

    let bestIdx = 0;
    for (let i = 1; i < popSize; i++) {
      if (fitnesses[i] < fitnesses[bestIdx]) bestIdx = i;
    }

    let bestInd = [...population[bestIdx]];
    let bestFit = fitnesses[bestIdx];
    let bestEvalResult = evaluateSchedule(bestInd, problem);

    const history = [
      {
        eval: evals,
        bestFitness: bestFit,
        bestMakespan: bestEvalResult.makespan,
        bestCost: bestEvalResult.cost
      }
    ];

    const steps: StepEvent[] = [];

    // Tournament selection
    function tournamentSelect(): number[] {
      let b = rng.int(0, popSize - 1);
      for (let k = 1; k < tourSize; k++) {
        const c = rng.int(0, popSize - 1);
        if (fitnesses[c] < fitnesses[b]) b = c;
      }
      return population[b];
    }

    // Two-point crossover
    function crossover(p1: number[], p2: number[]): [number[], number[]] {
      if (rng.random() > pc) return [[...p1], [...p2]];
      let pt1 = rng.int(0, n - 2);
      let pt2 = rng.int(pt1 + 1, n - 1);

      const c1 = [...p1];
      const c2 = [...p2];
      for (let i = pt1; i <= pt2; i++) {
        c1[i] = p2[i];
        c2[i] = p1[i];
      }
      return [c1, c2];
    }

    // Integer mutation
    function mutate(ind: number[]): number[] {
      const child = [...ind];
      for (let i = 0; i < n; i++) {
        if (rng.random() < pm) {
          child[i] = rng.int(0, m - 1);
        }
      }
      return child;
    }

    for (let gen = 0; gen < maxGen && evals < budget; gen++) {
      const newPop: number[][] = [];
      // Elitism: keep best
      newPop.push([...bestInd]);

      while (newPop.length < popSize && evals < budget) {
        const p1 = tournamentSelect();
        const p2 = tournamentSelect();
        const [c1, c2] = crossover(p1, p2);
        newPop.push(mutate(c1));
        if (newPop.length < popSize) {
          newPop.push(mutate(c2));
        }
      }

      population = newPop;
      fitnesses = population.map((ind) => {
        evals++;
        return evaluateSchedule(ind, problem).fitness;
      });

      for (let i = 0; i < popSize; i++) {
        if (fitnesses[i] < bestFit) {
          bestFit = fitnesses[i];
          bestInd = [...population[i]];
          bestEvalResult = evaluateSchedule(bestInd, problem);
        }
      }

      history.push({
        eval: evals,
        bestFitness: bestFit,
        bestMakespan: bestEvalResult.makespan,
        bestCost: bestEvalResult.cost
      });

      if (params.recordSteps && onStep && (gen < 5 || gen === maxGen - 1)) {
        const evt: StepEvent = {
          step: gen + 1,
          phase: 'GA Evolution',
          title: `Generasi ${gen + 1}`,
          description: `Seleksi turnamen & crossover 2-titik menghasilkan generasi baru. Makespan terbaik saat ini = ${bestEvalResult.makespan.toFixed(2)} detik.`,
          populationSnapshot: population.slice(0, 5).map((ind, idx) => ({
            id: idx,
            assignment: ind,
            fitness: fitnesses[idx],
            tag: idx === 0 ? 'Elite' : undefined
          }))
        };
        steps.push(evt);
        onStep(evt);
      }
    }

    const computeMs = performance.now() - t0;
    return {
      solverId: this.id,
      solverName: this.name,
      family: this.family,
      pattern: this.pattern,
      schedule: bestEvalResult.schedule,
      assignment: bestInd,
      metrics: {
        makespan: bestEvalResult.makespan,
        cost: bestEvalResult.cost,
        utilization: bestEvalResult.utilization,
        imbalance: bestEvalResult.imbalance,
        computeMs,
        evals,
        fitness: bestFit
      },
      history,
      steps
    };
  }
};
