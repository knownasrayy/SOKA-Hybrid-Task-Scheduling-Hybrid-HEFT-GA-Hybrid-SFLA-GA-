import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../../model';
import { RNG } from '../../rng';

/**
 * Pure Water Cycle Algorithm (Eskandar et al., 2012)
 * Baseline 2 from Previous SFLA & WCA Presentation
 */
export const wcaSolver: Solver = {
  id: 'wca_pure',
  name: 'WCA Murni (Water Cycle Algorithm)',
  family: 'metaheuristic',
  pattern: 'Metaheuristik Murni (Baseline 2)',
  color: '#7c3aed',
  citationId: 'eskandar2012',
  description: 'Metaheuristik berbasis siklus hidrologi air. Mengatur aliran anak sungai (streams) dan sungai (rivers) menuju laut (sea). Dilengkapi mekanisme evaporasi dan hujan buatan saat jarak aliran menyempit untuk meloloskan solusi dari jebakan optimum lokal.',

  run(problem: Problem, params: any, rng: RNG, onStep?: (s: StepEvent) => void): Result {
    const t0 = performance.now();
    const { tasks, vms } = problem;
    const n = tasks.length;
    const m = vms.length;

    const Npop = params.populationSize || 28;
    const Nsr = 4; // 1 Sea + 3 Rivers
    const Nstreams = Npop - Nsr;
    const budget = params.evaluationBudget || 10000;
    const maxIter = params.maxGenerations || Math.ceil(budget / Npop);

    let dmax = 1.0;
    const dmaxMin = 1e-4;

    // Initialize raindrops
    let raindrops: number[][] = Array.from({ length: Npop }, () =>
      Array.from({ length: n }, () => rng.int(0, m - 1))
    );

    let evals = 0;
    let fitnesses = raindrops.map((r) => {
      evals++;
      return evaluateSchedule(r, problem).fitness;
    });

    const sortIdx = Array.from({ length: Npop }, (_, i) => i).sort((a, b) => fitnesses[a] - fitnesses[b]);
    raindrops = sortIdx.map((i) => raindrops[i]);
    fitnesses = sortIdx.map((i) => fitnesses[i]);

    let sea = [...raindrops[0]];
    let seaFit = fitnesses[0];
    let seaEval = evaluateSchedule(sea, problem);

    const history = [
      {
        eval: evals,
        bestFitness: seaFit,
        bestMakespan: seaEval.makespan,
        bestCost: seaEval.cost
      }
    ];

    for (let it = 0; it < maxIter && evals < budget; it++) {
      // Stream movement towards rivers and sea
      for (let i = Nsr; i < Npop && evals < budget; i++) {
        const target = i % Nsr === 0 ? sea : raindrops[i % Nsr];
        const stream = [...raindrops[i]];

        // Flow towards target (swap genes towards target with random component)
        for (let d = 0; d < n; d++) {
          if (rng.random() < 0.35) {
            stream[d] = target[d];
          } else if (rng.random() < 0.08) {
            stream[d] = rng.int(0, m - 1);
          }
        }

        evals++;
        const streamFit = evaluateSchedule(stream, problem).fitness;

        // Exchange positions if stream found better location than target
        const riverIdx = i % Nsr;
        if (streamFit < fitnesses[riverIdx]) {
          raindrops[i] = [...raindrops[riverIdx]];
          fitnesses[i] = fitnesses[riverIdx];
          raindrops[riverIdx] = stream;
          fitnesses[riverIdx] = streamFit;
        } else {
          raindrops[i] = stream;
          fitnesses[i] = streamFit;
        }
      }

      // Check if any river is better than sea
      for (let r = 1; r < Nsr; r++) {
        if (fitnesses[r] < seaFit) {
          const temp = [...sea];
          const tempFit = seaFit;
          sea = [...raindrops[r]];
          seaFit = fitnesses[r];
          raindrops[r] = temp;
          fitnesses[r] = tempFit;
          seaEval = evaluateSchedule(sea, problem);
        }
      }

      // Evaporation & Raining Condition
      for (let r = 1; r < Nsr && evals < budget; r++) {
        // Distance between river and sea (Hamming distance on discrete assignments)
        let dist = 0;
        for (let d = 0; d < n; d++) {
          if (sea[d] !== raindrops[r][d]) dist++;
        }
        const normDist = dist / n;

        if (normDist < dmax) {
          // Raining: generate new stream around sea or random
          const newStream = [...sea];
          for (let d = 0; d < n; d++) {
            if (rng.random() < 0.25) newStream[d] = rng.int(0, m - 1);
          }
          evals++;
          const newFit = evaluateSchedule(newStream, problem).fitness;
          const replaceIdx = Nsr + rng.int(0, Nstreams - 1);
          raindrops[replaceIdx] = newStream;
          fitnesses[replaceIdx] = newFit;
        }
      }

      dmax = Math.max(dmaxMin, dmax - dmax / maxIter);

      history.push({
        eval: evals,
        bestFitness: seaFit,
        bestMakespan: seaEval.makespan,
        bestCost: seaEval.cost
      });
    }

    const computeMs = performance.now() - t0;
    return {
      solverId: this.id,
      solverName: this.name,
      family: this.family,
      pattern: this.pattern,
      schedule: seaEval.schedule,
      assignment: sea,
      metrics: {
        makespan: seaEval.makespan,
        cost: seaEval.cost,
        utilization: seaEval.utilization,
        imbalance: seaEval.imbalance,
        computeMs,
        evals,
        fitness: seaFit
      },
      history
    };
  }
};
