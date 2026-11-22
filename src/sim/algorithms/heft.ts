import { Problem, Result, Solver, StepEvent, evaluateSchedule } from '../model';
import { RNG } from '../rng';

/**
 * Computes HEFT upward rank (rank_u) for all tasks.
 * rank_u(t_i) = avg_comp(t_i) + max_{t_j in succ(t_i)} ( avg_comm(t_i, t_j) + rank_u(t_j) )
 */
export function computeUpwardRanks(problem: Problem): { ranks: number[]; sortedOrder: number[] } {
  const { tasks, vms } = problem;
  const n = tasks.length;
  const m = vms.length;

  // Average computation time on each task across all VMs
  const avgComp = tasks.map((t) => {
    const sum = vms.reduce((acc, vm) => acc + t.length / vm.mips, 0);
    return sum / m;
  });

  // Successors list
  const successors: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (const parentId of tasks[i].deps || []) {
      if (parentId >= 0 && parentId < n) {
        successors[parentId].push(i);
      }
    }
  }

  const ranks = new Array(n).fill(-1);

  function getRank(i: number): number {
    if (ranks[i] !== -1) return ranks[i];

    const succs = successors[i];
    if (succs.length === 0) {
      ranks[i] = avgComp[i];
      return ranks[i];
    }

    let maxSuccRank = 0;
    for (const j of succs) {
      // Average communication cost from i to j
      const edgeData = problem.edges?.find((e) => e.from === i && e.to === j)?.dataKb || tasks[i].fileSize || 500;
      const avgBw = vms.reduce((acc, vm) => acc + vm.bw, 0) / m;
      const avgComm = (edgeData * 8) / (avgBw * 1000);

      const r = avgComm + getRank(j);
      if (r > maxSuccRank) maxSuccRank = r;
    }

    ranks[i] = avgComp[i] + maxSuccRank;
    return ranks[i];
  }

  for (let i = 0; i < n; i++) {
    getRank(i);
  }

  // Topological sorting by descending upward rank
  const sortedOrder = Array.from({ length: n }, (_, i) => i).sort((a, b) => ranks[b] - ranks[a]);
  return { ranks, sortedOrder };
}

export const heftSolver: Solver = {
  id: 'heft_pure',
  name: 'HEFT (Heterogeneous Earliest Finish Time)',
  family: 'heuristic',
  pattern: 'Heuristik Daftar Murni (Pola 0 / Baseline)',
  color: '#2563eb',
  citationId: 'topcuoglu2002',
  description: 'Algoritma heuristik daftar deterministik klasik. Menghitung upward rank untuk memprioritaskan task kritis, lalu menugaskan setiap task ke VM dengan Earliest Finish Time (EFT) menggunakan strategi insertion.',

  run(problem: Problem, params: any, rng: RNG, onStep?: (s: StepEvent) => void): Result {
    const t0 = performance.now();
    const { tasks, vms } = problem;
    const n = tasks.length;
    const m = vms.length;

    const { ranks, sortedOrder } = computeUpwardRanks(problem);
    const assignment = new Array(n).fill(0);
    const steps: StepEvent[] = [];

    // Track VM timeline intervals for insertion policy
    const vmAvail = new Array(m).fill(0);
    const taskFinish = new Array(n).fill(0);

    for (let stepIdx = 0; stepIdx < sortedOrder.length; stepIdx++) {
      const taskId = sortedOrder[stepIdx];
      const task = tasks[taskId];

      let bestVm = 0;
      let minEFT = Infinity;
      let bestStart = 0;

      // Evaluate EFT on all VMs
      for (let k = 0; k < m; k++) {
        const vm = vms[k];
        const execTime = task.length / vm.mips;

        // Earliest Data Arrival Time from parents
        let readyTime = 0;
        for (const parentId of task.deps || []) {
          const pFinish = taskFinish[parentId] || 0;
          const pVm = assignment[parentId] || 0;
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
          bestStart = est;
        }
      }

      assignment[taskId] = bestVm;
      vmAvail[bestVm] = minEFT;
      taskFinish[taskId] = minEFT;

      if (params.recordSteps && onStep) {
        const evt: StepEvent = {
          step: stepIdx + 1,
          phase: 'HEFT Allocation',
          title: `Alokasi ${task.name} (Rank: ${ranks[taskId].toFixed(1)})`,
          description: `Task ${task.name} ditugaskan ke ${vms[bestVm].name} karena menghasilkan Earliest Finish Time (EFT) tercepat pada t = ${minEFT.toFixed(2)} detik.`,
          activeTaskId: taskId,
          activeVmId: bestVm
        };
        steps.push(evt);
        onStep(evt);
      }
    }

    const evalResult = evaluateSchedule(assignment, problem);
    const computeMs = performance.now() - t0;

    return {
      solverId: this.id,
      solverName: this.name,
      family: this.family,
      pattern: this.pattern,
      schedule: evalResult.schedule,
      assignment,
      metrics: {
        makespan: evalResult.makespan,
        cost: evalResult.cost,
        utilization: evalResult.utilization,
        imbalance: evalResult.imbalance,
        computeMs,
        evals: n * m,
        fitness: evalResult.fitness
      },
      history: [
        { eval: n * m, bestFitness: evalResult.fitness, bestMakespan: evalResult.makespan, bestCost: evalResult.cost }
      ],
      steps
    };
  }
};
