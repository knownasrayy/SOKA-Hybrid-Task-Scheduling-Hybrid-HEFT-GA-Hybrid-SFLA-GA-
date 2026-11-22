import { Problem, Result } from '../sim/model';
import { AggregateStats, WinnerDecision } from '../sim/stats';
import { runSimulation, SimulationSummary } from '../sim/runner';
import { MINGGU3_PROBLEM, AVAILABLE_DATASETS } from '../data/defaultDatasets';

const CACHE_KEY = 'hybridlab_sim_results_v1';

export class SimulationManager {
  private currentProblem: Problem = MINGGU3_PROBLEM;
  private summary: SimulationSummary | null = null;
  private isRunning: boolean = false;
  private progress: { current: number; total: number; currentSolver: string; percent: number } = {
    current: 0,
    total: 0,
    currentSolver: '',
    percent: 0
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromCache();
    // Auto-run if no cache found to ensure instant presentation availability
    if (!this.summary) {
      this.runDefault();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getProblem(): Problem {
    return this.currentProblem;
  }

  setProblem(p: Problem) {
    this.currentProblem = p;
    this.run(p);
  }

  setProblemById(id: string) {
    const p = AVAILABLE_DATASETS[id];
    if (p) this.setProblem(p);
  }

  getSummary(): SimulationSummary | null {
    return this.summary;
  }

  getAggregates(): AggregateStats[] {
    return this.summary?.aggregates || [];
  }

  getWinner(): WinnerDecision | null {
    return this.summary?.winner || null;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getProgress() {
    return this.progress;
  }

  async run(problem: Problem = this.currentProblem, runs: number = 30) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.progress = { current: 0, total: 1, currentSolver: 'Memulai...', percent: 0 };
    this.notify();

    try {
      const summary = await runSimulation(problem, {
        runs,
        baseSeed: 2026,
        evaluationBudget: 10000,
        solvers: ['heft_ga', 'sfla_ga', 'heft_pure', 'ga_pure', 'sfla_pure', 'wca_pure'],
        recordSteps: true,
        onProgress: (p) => {
          this.progress = p;
          this.notify();
        }
      });

      this.summary = summary;
      this.saveToCache(summary);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      this.isRunning = false;
      this.notify();
    }
  }

  private async runDefault() {
    // Quick initial run (10 runs) to be fast on first load, user can click "Hitung 30 Run"
    await this.run(this.currentProblem, 10);
  }

  private saveToCache(summary: SimulationSummary) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(summary));
    } catch (e) {
      console.warn('Could not cache to localStorage', e);
    }
  }

  private loadFromCache() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        this.summary = JSON.parse(raw);
        if (this.summary?.problem) {
          this.currentProblem = this.summary.problem;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached simulation results', e);
    }
  }
}

export const simManager = new SimulationManager();
