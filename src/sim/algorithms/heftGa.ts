import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../model';
import { computeUpwardRanks } from './heft';
import { RNG } from '../rng';

/**
 * Hybrid HEFT-GA (Aziza & Krichen, 2020)
 * Pola B: Heuristik + Metaheuristik (Seeding Relay)
 *
 * Paper: Aziza, H., & Krichen, S. (2020). A hybrid genetic algorithm for scientific
 * workflow scheduling in cloud environment. Neural Computing and Applications, 32(18), 15263–15278.
 */
export const heftGaSolver: Solver = {
  id: 'heft_ga',
  name: 'Hybrid HEFT-GA (Aziza & Krichen, 2020)',
  family: 'hybrid',
  pattern: 'Pola B (Heuristik HEFT + Metaheuristik GA / Seeding Relay)',
  color: '#2563eb',
  citationId: 'aziza2020',
  description: 'Mengintegrasikan solusi deterministik dari HEFT ke dalam populasi awal GA sebagai benih berkualitas tinggi. Evolusi GA dengan seleksi turnamen, crossover 2-titik, dan mutasi integer kemudian menjelajahi ruang pencarian untuk memperbaiki solusi dan meloloskannya dari keputusan greedy lokal.',

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

    const steps: StepEvent[] = [];

    // Step 1: Run HEFT to obtain the seeded high-quality schedule
    const { sortedOrder } = computeUpwardRanks(problem);
    const heftAssignment = new Array(n).fill(0);
    const vmAvail = new Array(m).fill(0);
    const taskFinish = new Array(n).fill(0);

    for (const taskId of sortedOrder) {
      const task = tasks[taskId];
      let bestVm = 0;
      let minEFT = Infinity;

      for (let k = 0; k < m; k++) {
        const vm = vms[k];
        const execTime = task.length / vm.mips;
        let readyTime = 0;
        for (const parentId of task.deps || []) {
          const pFinish = taskFinish[parentId] || 0;
          const pVm = heftAssignment[parentId] || 0;
          let transferTime = 0;
          if (pVm !== k) {
            const edgeData = problem.edges?.find((e) => e.from === parentId && e.to === taskId)?.dataKb || task.fileSize || 500;
            const bw = Math.min(vms[pVm].bw, vm.bw);
            transferTime = (edgeData * 8) / (bw * 1000);
          }
          const arr = pFinish + transferTime;
          if (arr > readyTime) readyTime = arr;
        }
        const est = Math.max(vmAvail[k], readyTime);
        const eft = est + execTime;
        if (eft < minEFT) {
          minEFT = eft;
          bestVm = k;
        }
      }
      heftAssignment[taskId] = bestVm;
      vmAvail[bestVm] = minEFT;
      taskFinish[taskId] = minEFT;
    }

    if (params.recordSteps && onStep) {
      const evt: StepEvent = {
        step: 1,
        phase: 'HEFT Seeding',
        title: 'Langkah 1: Inisialisasi Benih HEFT',
        description: 'Solusi deterministik HEFT dihitung terlebih dahulu dan disuntikkan ke populasi awal sebagai Individu 0 (Elite Seed).',
        activeTaskId: sortedOrder[0],
        activeVmId: heftAssignment[sortedOrder[0]]
      };
      steps.push(evt);
      onStep(evt);
    }

    // Step 2: Initialize Population (1 HEFT seed + popSize - 1 diversified/random individuals)
    let population: number[][] = [];
    population.push([...heftAssignment]); // Individual 0 is HEFT!

    // Add mutated variations of HEFT to explore neighboring high-quality regions
    for (let i = 1; i < Math.min(5, popSize); i++) {
      const variant = [...heftAssignment];
      for (let j = 0; j < n; j++) {
        if (rng.random() < 0.15) {
          variant[j] = rng.int(0, m - 1);
        }
      }
      population.push(variant);
    }

    // Fill remaining with random chromosomes
    while (population.length < popSize) {
      population.push(Array.from({ length: n }, () => rng.int(0, m - 1)));
    }

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

    // Tournament selection
    function tournamentSelect(): number[] {
      let b = rng.int(0, popSize - 1);
      for (let k = 1; k < tourSize; k++) {
        const c = rng.int(0, popSize - 1);
        if (fitnesses[c] < fitnesses[b]) b = c;
      }
      return population[b];
    }

    // Two-point crossover (Swapping alternating segments)
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

    // Integer Mutation (reassigning random tasks to random VMs)
    function mutate(ind: number[]): number[] {
      const child = [...ind];
      for (let i = 0; i < n; i++) {
        if (rng.random() < pm) {
          child[i] = rng.int(0, m - 1);
        }
      }
      return child;
    }

    // Evolution loop
    for (let gen = 0; gen < maxGen && evals < budget; gen++) {
      const newPop: number[][] = [];
      // Elitism: Preserve the best chromosome
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

      if (params.recordSteps && onStep && (gen < 6 || gen === maxGen - 1)) {
        const evt: StepEvent = {
          step: gen + 2,
          phase: 'HEFT-GA Evolution',
          title: `Generasi ${gen + 1}: Perbaikan Solusi`,
          description: `Kombinasi gen benih HEFT dan individu hasil crossover berhasil menemukan jadwal dengan makespan ${bestEvalResult.makespan.toFixed(2)} detik (biaya: $${bestEvalResult.cost.toFixed(4)}).`,
          populationSnapshot: population.slice(0, 5).map((ind, idx) => ({
            id: idx,
            assignment: ind,
            fitness: fitnesses[idx],
            tag: idx === 0 ? 'Best Seed' : undefined
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
