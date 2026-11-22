import { Solver } from '../model';
import { heftSolver } from './heft';
import { gaSolver } from './ga';
import { heftGaSolver } from './heftGa';
import { sflaSolver } from './sfla';
import { sflaGaSolver } from './sflaGa';
import { wcaSolver } from './baselines/wca';

export const ALL_SOLVERS: Solver[] = [
  heftGaSolver,
  sflaGaSolver,
  heftSolver,
  gaSolver,
  sflaSolver,
  wcaSolver
];

export const SOLVER_MAP: Record<string, Solver> = {
  heft_ga: heftGaSolver,
  sfla_ga: sflaGaSolver,
  heft_pure: heftSolver,
  ga_pure: gaSolver,
  sfla_pure: sflaSolver,
  wca_pure: wcaSolver
};

export function getSolver(id: string): Solver | undefined {
  return SOLVER_MAP[id];
}
