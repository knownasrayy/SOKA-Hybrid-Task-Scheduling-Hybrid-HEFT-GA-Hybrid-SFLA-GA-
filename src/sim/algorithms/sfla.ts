import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../model';
import { RNG } from '../rng';

/**
 * Pure Shuffled Frog Leaping Algorithm (Eusuff & Lansey, 2003 / 2006)
 * Baseline 1 from Previous SFLA Presentation
 */
export const sflaSolver: Solver = {
  id: 'sfla_pure',
  name: 'SFLA Murni (Shuffled Frog Leaping Algorithm)',
  family: 'metaheuristic',
  pattern: 'Metaheuristik Murni (Baseline 1)',
  color: '#d97706',
  citationId: 'eusuff2006',
  description: 'Metaheuristik terinspirasi perilaku katak mencari makan di kolam. Populasi dibagi ke dalam memeplex; katak terburuk di tiap memeplex melompat ke arah katak terbaik memeplex atau global best, lalu dikocok (shuffle) secara berkala.',

  run(problem: Problem, params: any, rng: RNG, onStep?: (s: StepEvent) => void): Result {
    const t0 = performance.now();
    const { tasks, vms } = problem;
    const n = tasks.length;
    const m = vms.length;

    const F = params.populationSize || 24; // total frogs
    const memCount = params.memeplexCount || 4; // number of memeplexes
    const frogsPerMem = Math.floor(F / memCount);
    const budget = params.evaluationBudget || 10000;
    const localIters = 5; // local search iterations per memeplex

    const steps: StepEvent[] = [];

    // Initialize random frogs
    let frogs: number[][] = Array.from({ length: F }, () =>
      Array.from({ length: n }, () => rng.int(0, m - 1))
    );

    let evals = 0;
    let fitnesses = frogs.map((f) => {
      evals++;
      return evaluateSchedule(f, problem).fitness;
    });

    let bestGlobal = [...frogs[0]];
    let bestFit = fitnesses[0];
    let bestEval = evaluateSchedule(bestGlobal, problem);

    for (let i = 1; i < F; i++) {
      if (fitnesses[i] < bestFit) {
        bestFit = fitnesses[i];
        bestGlobal = [...frogs[i]];
        bestEval = evaluateSchedule(bestGlobal, problem);
      }
    }

    const history = [
      {
        eval: evals,
        bestFitness: bestFit,
        bestMakespan: bestEval.makespan,
        bestCost: bestEval.cost
      }
    ];

    let cycle = 0;
    while (evals < budget) {
      cycle++;

      // Sort all frogs descending by fitness (best to worst)
      const indices = Array.from({ length: F }, (_, i) => i).sort((a, b) => fitnesses[a] - fitnesses[b]);
      frogs = indices.map((i) => frogs[i]);
      fitnesses = indices.map((i) => fitnesses[i]);

      // Partition into memeplexes (modulo interleaving)
      const memeplexes: number[][][] = Array.from({ length: memCount }, () => []);
      const memFitness: number[][] = Array.from({ length: memCount }, () => []);

      for (let i = 0; i < F; i++) {
        const memIdx = i % memCount;
        memeplexes[memIdx].push(frogs[i]);
        memFitness[memIdx].push(fitnesses[i]);
      }

      // Local leap in each memeplex
      for (let memIdx = 0; memIdx < memCount && evals < budget; memIdx++) {
        const memFrogs = memeplexes[memIdx];
        const memFits = memFitness[memIdx];
        const kBest = memFrogs[0]; // best in memeplex
        const kWorstIdx = memFrogs.length - 1;
        let kWorst = memFrogs[kWorstIdx];
        let worstFit = memFits[kWorstIdx];

        for (let it = 0; it < localIters && evals < budget; it++) {
          // Leap towards best in memeplex: partially copy genes from kBest
          const candidate = [...kWorst];
          const crossoverMask = Array.from({ length: n }, () => rng.random() < 0.4);
          for (let d = 0; d < n; d++) {
            if (crossoverMask[d]) {
              candidate[d] = kBest[d];
            }
          }

          evals++;
          const candFit = evaluateSchedule(candidate, problem).fitness;

          if (candFit < worstFit) {
            memFrogs[kWorstIdx] = candidate;
            memFits[kWorstIdx] = candFit;
            kWorst = candidate;
            worstFit = candFit;
          } else {
            // Leap towards global best
            const candidateGlobal = [...kWorst];
            for (let d = 0; d < n; d++) {
              if (rng.random() < 0.4) {
                candidateGlobal[d] = bestGlobal[d];
              }
            }
            evals++;
            const candGlobalFit = evaluateSchedule(candidateGlobal, problem).fitness;

            if (candGlobalFit < worstFit) {
              memFrogs[kWorstIdx] = candidateGlobal;
              memFits[kWorstIdx] = candGlobalFit;
              kWorst = candidateGlobal;
              worstFit = candGlobalFit;
            } else {
              // Random frog replacement
              const randomFrog = Array.from({ length: n }, () => rng.int(0, m - 1));
              evals++;
              const randFit = evaluateSchedule(randomFrog, problem).fitness;
              memFrogs[kWorstIdx] = randomFrog;
              memFits[kWorstIdx] = randFit;
              kWorst = randomFrog;
              worstFit = randFit;
            }
          }

          // Check if better than global
          if (worstFit < bestFit) {
            bestFit = worstFit;
            bestGlobal = [...kWorst];
            bestEval = evaluateSchedule(bestGlobal, problem);
          }
        }
      }

      // Recombine back into population (global shuffle)
      frogs = memeplexes.flat();
      fitnesses = memFitness.flat();

      history.push({
        eval: evals,
        bestFitness: bestFit,
        bestMakespan: bestEval.makespan,
        bestCost: bestEval.cost
      });

      if (params.recordSteps && onStep && (cycle <= 4 || evals >= budget)) {
        const evt: StepEvent = {
          step: cycle,
          phase: 'SFLA Memeplex Leap & Shuffle',
          title: `Siklus ${cycle}: Shuffle Memeplex`,
          description: `Katak melompat di ${memCount} memeplex terpisah lalu dikocok secara global. Makespan terbaik = ${bestEval.makespan.toFixed(2)} detik.`,
          frogs: frogs.slice(0, 12).map((f, idx) => ({
            id: idx,
            memeplex: idx % memCount,
            position: f,
            fitness: fitnesses[idx],
            isBest: idx === 0
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
      schedule: bestEval.schedule,
      assignment: bestGlobal,
      metrics: {
        makespan: bestEval.makespan,
        cost: bestEval.cost,
        utilization: bestEval.utilization,
        imbalance: bestEval.imbalance,
        computeMs,
        evals,
        fitness: bestFit
      },
      history,
      steps
    };
  }
};
