import { RNG } from './rng';

export interface Task {
  id: number;
  name: string;
  length: number;      // Instructions in Million Instructions (MI)
  fileSize: number;    // Input data size in KB
  outputSize: number;  // Output data size in KB
  deps: number[];      // Predecessor task IDs
}

export interface VM {
  id: number;
  name: string;
  mips: number;          // Computational capacity in MIPS
  ram: number;           // RAM in MB
  bw: number;            // Bandwidth in Mbps
  pricePerHour: number;  // Rental cost per hour ($)
  color?: string;
}

export interface Edge {
  from: number;
  to: number;
  dataKb: number;
}

export interface Problem {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  vms: VM[];
  edges?: Edge[];
  networkBw?: number;       // Global network BW in Mbps (default 1000)
  internalLatency?: number; // Internal latency penalty in s
  deadline?: number;        // Optional QoS deadline constraint in seconds
  budget?: number;          // Optional QoS budget constraint in USD
}

export interface TaskAssignment {
  taskId: number;
  vmId: number;
  startTime: number;
  finishTime: number;
  executionTime: number;
  commCost: number;
}

export interface Metrics {
  makespan: number;          // Seconds: max finish time
  cost: number;              // Total cost in USD: sum(active hours * pricePerHour)
  utilization: number;       // Average VM utilization [0, 1]
  imbalance: number;         // Degree of imbalance (DI) = (Lmax - Lmin) / Lavg
  computeMs: number;         // Algorithm execution overhead in ms
  evals: number;             // Total fitness evaluations performed
  fitness: number;           // Normalized weighted objective value
}

export interface HistoryPoint {
  eval: number;
  bestFitness: number;
  bestMakespan: number;
  bestCost: number;
}

export interface StepEvent {
  step: number;
  phase: string;
  title: string;
  description: string;
  activeTaskId?: number;
  activeVmId?: number;
  populationSnapshot?: { id: number; assignment: number[]; fitness: number; tag?: string }[];
  scheduleSnapshot?: TaskAssignment[];
  frogs?: { id: number; memeplex: number; position: number[]; fitness: number; isBest?: boolean; isWorst?: boolean }[];
  currentMemeplex?: number;
}

export interface Result {
  solverId: string;
  solverName: string;
  family: 'heuristic' | 'metaheuristic' | 'hybrid';
  pattern?: string;
  schedule: TaskAssignment[];
  assignment: number[];      // Direct chromosome: task i -> vm assignment[i]
  metrics: Metrics;
  history: HistoryPoint[];
  steps?: StepEvent[];
}

export interface Params {
  populationSize?: number;
  maxGenerations?: number;
  evaluationBudget?: number;
  crossoverRate?: number;    // pc (default 0.8)
  mutationRate?: number;     // pm (default 0.1)
  memeplexCount?: number;    // m for SFLA (default 4)
  tournamentSize?: number;   // default 4
  recordSteps?: boolean;     // whether to record educational step events
}

export interface Solver {
  id: string;
  name: string;
  family: 'heuristic' | 'metaheuristic' | 'hybrid';
  pattern: string;
  color: string;
  citationId: string;
  description: string;
  run(problem: Problem, params: Params, rng: RNG, onStep?: (s: StepEvent) => void): Result;
}

export interface FitnessWeights {
  timeWeight: number; // default 0.5
  costWeight: number; // default 0.5
}

/**
 * Evaluates a candidate assignment vector [vm_0, vm_1, ..., vm_n-1]
 * Correctly accounts for DAG precedence, heterogeneous execution speeds,
 * inter-VM communication transfer times (free if same VM), and monetary costs.
 */
export function evaluateSchedule(
  assignment: number[],
  problem: Problem,
  weights: FitnessWeights = { timeWeight: 0.5, costWeight: 0.5 }
): {
  schedule: TaskAssignment[];
  makespan: number;
  cost: number;
  utilization: number;
  imbalance: number;
  fitness: number;
} {
  const { tasks, vms } = problem;
  const n = tasks.length;
  const m = vms.length;

  const vmAvailableTime = new Array(m).fill(0);
  const taskFinishTime = new Array(n).fill(0);
  const taskStartTime = new Array(n).fill(0);
  const vmBusyTime = new Array(m).fill(0);
  const schedule: TaskAssignment[] = [];

  // Build dependency map
  // To evaluate correctly under DAG, determine ready time based on parents
  // If task has parents, it can only start after all parents finished + transfer time
  for (let i = 0; i < n; i++) {
    const task = tasks[i];
    const vmId = Math.min(Math.max(0, assignment[i] ?? 0), m - 1);
    const vm = vms[vmId];

    // Compute execution time on this VM
    const executionTime = task.length / vm.mips;

    // Compute Earliest Data Arrival Time from all predecessors
    let readyTime = 0;
    let commCost = 0;

    if (task.deps && task.deps.length > 0) {
      for (const parentId of task.deps) {
        const parentFinish = taskFinishTime[parentId] ?? 0;
        const parentVmId = assignment[parentId] ?? 0;
        let transTime = 0;

        // Data transfer is free if both tasks are scheduled on the same VM!
        if (parentVmId !== vmId) {
          const edgeData = problem.edges?.find(e => e.from === parentId && e.to === task.id)?.dataKb || task.fileSize || 500;
          const bw = Math.min(vms[parentVmId].bw, vm.bw);
          // Transfer time = (data in KB * 8 / 1000) / BW in Mbps
          transTime = (edgeData * 8) / (bw * 1000);
          commCost += transTime;
        }

        const arrival = parentFinish + transTime;
        if (arrival > readyTime) {
          readyTime = arrival;
        }
      }
    }

    // Task starts when both VM is free and all predecessor data has arrived
    const startTime = Math.max(vmAvailableTime[vmId], readyTime);
    const finishTime = startTime + executionTime;

    vmAvailableTime[vmId] = finishTime;
    taskStartTime[i] = startTime;
    taskFinishTime[i] = finishTime;
    vmBusyTime[vmId] += executionTime;

    schedule.push({
      taskId: task.id,
      vmId,
      startTime,
      finishTime,
      executionTime,
      commCost
    });
  }

  // Makespan is the maximum finish time across all VMs
  const makespan = Math.max(...vmAvailableTime, 0.001);

  // Total Monetary Cost = Sum of (VM busy duration * price per hour)
  // Quantum model: billed per hour or second fraction (Aziza & Krichen Eq. 4)
  let totalCost = 0;
  for (let k = 0; k < m; k++) {
    const hours = vmBusyTime[k] / 3600;
    totalCost += hours * vms[k].pricePerHour;
  }
  // Ensure non-zero cost for scaling
  const cost = Math.max(totalCost, 0.0001);

  // Average VM Utilization = Total Work Done / (Total VMs * Makespan)
  const totalBusy = vmBusyTime.reduce((sum, b) => sum + b, 0);
  const utilization = Math.min(1.0, totalBusy / (m * makespan));

  // Degree of Imbalance (DI) = (Lmax - Lmin) / Lavg
  const maxLoad = Math.max(...vmBusyTime);
  const minLoad = Math.min(...vmBusyTime);
  const avgLoad = totalBusy / m || 0.001;
  const imbalance = (maxLoad - minLoad) / avgLoad;

  // Normalized Fitness (Aziza Eq. 8)
  // Reference baselines for normalization
  const refMakespan = problem.deadline || (totalBusy / m) * 2.5;
  const refCost = problem.budget || (totalBusy / 3600) * 0.15;

  const f1 = makespan / Math.max(refMakespan, 1);
  const f2 = cost / Math.max(refCost, 0.0001);
  const fitness = weights.timeWeight * f1 + weights.costWeight * f2;

  return {
    schedule,
    makespan,
    cost,
    utilization,
    imbalance,
    fitness
  };
}
