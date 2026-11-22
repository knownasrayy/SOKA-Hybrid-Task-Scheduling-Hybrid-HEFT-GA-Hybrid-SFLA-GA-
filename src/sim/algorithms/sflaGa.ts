import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../model';
import { RNG } from '../rng';

/**
 * Hybrid SFLA-GA (Kayalvili & Selvam, 2019)
 * Pola C: Metaheuristik + Metaheuristik (Teamwork / Memeplex GA Search)
 *
 * Paper: Kayalvili, S., & Selvam, M. (2019). Hybrid SFLA-GA algorithm for an
 * optimal resource allocation in cloud. Cluster Computing, 22(Suppl 2), 3165–3173.
 */
export const sflaGaSolver: Solver = {
  id: 'sfla_ga',
  name: 'Hybrid SFLA-GA (Kayalvili & Selvam, 2019)',
  family: 'hybrid',
  pattern: 'Pola C (Metaheuristik SFLA + Metaheuristik GA / Teamwork)',
  color: '#059669',
  citationId: 'kayalvili2019',
  description: 'Mengkombinasikan struktur partisi memeplex SFLA dengan operator rekombinasi GA (crossover dan mutasi) di dalam setiap memeplex. GA bertindak sebagai mesin pencari lokal yang lebih beragam dan tahan jebakan lokal optima dibandingkan formula lompatan SFLA biasa.',

  run(problem: Problem, params: any, rng: RNG, onStep?: (s: StepEvent) => void): Result {
    const t0 = performance.now();
    const { tasks, vms } = problem;
    const n = tasks.length;
    const m = vms.length;

    const F = params.populationSize || 24; // total frogs
    const memCount = params.memeplexCount || 4; // number of memeplexes
    const frogsPerMem = Math.floor(F / memCount);
    const budget = params.evaluationBudget || 10000;
    const localGaIters = 4; // GA evolution steps per memeplex before shuffle
    const pc = params.crossoverRate ?? 0.8;
    const pm = params.mutationRate ?? 0.12;

    const steps: StepEvent[] = [];

    // Initialize frog population
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

      // Sort all frogs globally descending by fitness (best to worst)
      const indices = Array.from({ length: F }, (_, i) => i).sort((a, b) => fitnesses[a] - fitnesses[b]);
      frogs = indices.map((i) => frogs[i]);
      fitnesses = indices.map((i) => fitnesses[i]);

      // Partition into memeplexes (modulo interleaving: frog i goes to memeplex (i % memCount))
      const memeplexes: number[][][] = Array.from({ length: memCount }, () => []);
      const memFitness: number[][] = Array.from({ length: memCount }, () => []);

      for (let i = 0; i < F; i++) {
        const memIdx = i % memCount;
        memeplexes[memIdx].push(frogs[i]);
        memFitness[memIdx].push(fitnesses[i]);
      }

      // Inside each memeplex: Apply GA Local Search Operators (Crossover + Mutation)
      for (let memIdx = 0; memIdx < memCount && evals < budget; memIdx++) {
        const memFrogs = memeplexes[memIdx];
        const memFits = memFitness[memIdx];
        const pSize = memFrogs.length;

        for (let it = 0; it < localGaIters && evals < budget; it++) {
          // Select parents using linear rank-weighted or tournament selection within memeplex
          const p1Idx = rng.int(0, Math.floor(pSize / 2)); // bias towards upper half
          const p2Idx = rng.int(0, pSize - 1);
          const p1 = memFrogs[p1Idx];
          const p2 = memFrogs[p2Idx];

          // Two-point crossover between memeplex frogs
          let c1 = [...p1];
          let c2 = [...p2];
          if (rng.random() < pc) {
            const pt1 = rng.int(0, n - 2);
            const pt2 = rng.int(pt1 + 1, n - 1);
            for (let d = pt1; d <= pt2; d++) {
              c1[d] = p2[d];
              c2[d] = p1[d];
            }
          }

          // Integer mutation on offspring
          for (let d = 0; d < n; d++) {
            if (rng.random() < pm) c1[d] = rng.int(0, m - 1);
            if (rng.random() < pm) c2[d] = rng.int(0, m - 1);
          }

          evals += 2;
          const fitC1 = evaluateSchedule(c1, problem).fitness;
          const fitC2 = evaluateSchedule(c2, problem).fitness;

          // Replace worst frogs in this memeplex if offspring is superior
          const worstIdx = pSize - 1;
          const secondWorstIdx = pSize - 2;

          if (fitC1 < memFits[worstIdx]) {
            memFrogs[worstIdx] = c1;
            memFits[worstIdx] = fitC1;
          }
          if (fitC2 < memFits[secondWorstIdx]) {
            memFrogs[secondWorstIdx] = c2;
            memFits[secondWorstIdx] = fitC2;
          }

          // Re-sort memeplex after replacement
          const memSort = Array.from({ length: pSize }, (_, i) => i).sort((a, b) => memFits[a] - memFits[b]);
          const sortedF = memSort.map((i) => memFrogs[i]);
          const sortedFit = memSort.map((i) => memFits[i]);
          for (let k = 0; k < pSize; k++) {
            memFrogs[k] = sortedF[k];
            memFits[k] = sortedFit[k];
          }

          // Update global best
          if (memFits[0] < bestFit) {
            bestFit = memFits[0];
            bestGlobal = [...memFrogs[0]];
            bestEval = evaluateSchedule(bestGlobal, problem);
          }
        }
      }

      // Global Shuffling: gather all memeplexes back into single population
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
          phase: 'Hybrid SFLA-GA Memeplex Search',
          title: `Siklus ${cycle}: GA Crossover dalam Memeplex + Shuffle`,
          description: `Setiap memeplex berevolusi lokal menggunakan crossover & mutasi GA, kemudian dikocok kembali untuk pertukaran genetik global. Makespan terbaik = ${bestEval.makespan.toFixed(2)} detik.`,
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
