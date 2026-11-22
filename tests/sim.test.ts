import { describe, it, expect } from 'vitest';
import { createRNG } from '../src/sim/rng';
import { Problem, evaluateSchedule } from '../src/sim/model';
import { heftSolver, computeUpwardRanks } from '../src/sim/algorithms/heft';
import { gaSolver } from '../src/sim/algorithms/ga';
import { heftGaSolver } from '../src/sim/algorithms/heftGa';
import { sflaSolver } from '../src/sim/algorithms/sfla';
import { sflaGaSolver } from '../src/sim/algorithms/sflaGa';
import { wcaSolver } from '../src/sim/algorithms/baselines/wca';
import { computeAggregates, determineWinner } from '../src/sim/stats';

const mockProblem: Problem = {
  id: 'test_prob',
  name: 'Test 6 Tasks 3 VMs',
  description: 'Small verification case',
  vms: [
    { id: 0, name: 'VM-1', mips: 1000, ram: 1024, bw: 1000, pricePerHour: 0.05 },
    { id: 1, name: 'VM-2', mips: 500, ram: 1024, bw: 500, pricePerHour: 0.03 },
    { id: 2, name: 'VM-3', mips: 1500, ram: 2048, bw: 1500, pricePerHour: 0.08 }
  ],
  tasks: [
    { id: 0, name: 'T1', length: 3000, fileSize: 100, outputSize: 100, deps: [] },
    { id: 1, name: 'T2', length: 5000, fileSize: 100, outputSize: 100, deps: [0] },
    { id: 2, name: 'T3', length: 2000, fileSize: 100, outputSize: 100, deps: [0] },
    { id: 3, name: 'T4', length: 9000, fileSize: 100, outputSize: 100, deps: [1, 2] },
    { id: 4, name: 'T5', length: 4000, fileSize: 100, outputSize: 100, deps: [2] },
    { id: 5, name: 'T6', length: 6000, fileSize: 100, outputSize: 100, deps: [3, 4] }
  ]
};

describe('Sim Core & RNG Tests', () => {
  it('RNG should produce identical sequence with same seed', () => {
    const rng1 = createRNG(42);
    const rng2 = createRNG(42);
    const seq1 = Array.from({ length: 10 }, () => rng1.random());
    const seq2 = Array.from({ length: 10 }, () => rng2.random());
    expect(seq1).toEqual(seq2);
  });

  it('evaluateSchedule should calculate valid makespan and cost', () => {
    const assignment = [2, 0, 1, 2, 0, 2];
    const res = evaluateSchedule(assignment, mockProblem);
    expect(res.makespan).toBeGreaterThan(0);
    expect(res.cost).toBeGreaterThan(0);
    expect(res.utilization).toBeGreaterThan(0);
    expect(res.utilization).toBeLessThanOrEqual(1.0);
    expect(res.schedule).toHaveLength(6);
  });

  it('computeUpwardRanks should assign higher rank to entry tasks with dependencies', () => {
    const { ranks, sortedOrder } = computeUpwardRanks(mockProblem);
    expect(ranks[0]).toBeGreaterThan(ranks[5]); // T1 (entry) > T6 (exit)
    expect(sortedOrder[0]).toBe(0); // T1 scheduled first
    expect(sortedOrder[sortedOrder.length - 1]).toBe(5); // T6 scheduled last
  });
});

describe('Algorithms Verification', () => {
  const solvers = [
    heftSolver,
    gaSolver,
    heftGaSolver,
    sflaSolver,
    sflaGaSolver,
    wcaSolver
  ];

  for (const solver of solvers) {
    it(`${solver.name} should return valid result structure`, () => {
      const rng = createRNG(101);
      const res = solver.run(mockProblem, { evaluationBudget: 200, populationSize: 6 }, rng);
      expect(res.assignment).toHaveLength(mockProblem.tasks.length);
      expect(res.metrics.makespan).toBeGreaterThan(0);
      expect(res.metrics.cost).toBeGreaterThan(0);
      expect(res.metrics.evals).toBeGreaterThan(0);
      expect(res.history.length).toBeGreaterThan(0);

      // Check all task assignments are valid VM IDs
      for (const vmId of res.assignment) {
        expect(vmId).toBeGreaterThanOrEqual(0);
        expect(vmId).toBeLessThan(mockProblem.vms.length);
      }
    });
  }

  it('HEFT-GA should seed HEFT and achieve competitive or superior fitness compared to random GA', () => {
    const rng1 = createRNG(2026);
    const rng2 = createRNG(2026);
    const gaRes = gaSolver.run(mockProblem, { evaluationBudget: 150, populationSize: 10 }, rng1);
    const heftGaRes = heftGaSolver.run(mockProblem, { evaluationBudget: 150, populationSize: 10 }, rng2);

    // HEFT-GA should have better or equal fitness because it starts seeded with HEFT
    expect(heftGaRes.metrics.fitness).toBeLessThanOrEqual(gaRes.metrics.fitness);
  });

  it('Winner determination should pick winner strictly based on composite score', () => {
    const rng = createRNG(1);
    const h1 = heftGaSolver.run(mockProblem, { evaluationBudget: 200, populationSize: 6 }, rng);
    const h2 = sflaGaSolver.run(mockProblem, { evaluationBudget: 200, populationSize: 6 }, rng);

    const aggregates = computeAggregates({
      heft_ga: [h1],
      sfla_ga: [h2]
    });

    const winner = determineWinner(aggregates);
    expect(winner).not.toBeNull();
    expect(['heft_ga', 'sfla_ga']).toContain(winner?.winnerId);
    expect(winner?.metricComparison.length).toBeGreaterThan(0);
  });
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Slide01Cover } from '../src/slides/Slide01Cover';
import { Slide02Ketentuan } from '../src/slides/Slide02Ketentuan';
import { Slide03MasalahCloud } from '../src/slides/Slide03MasalahCloud';
import { Slide04TaksonomiPola } from '../src/slides/Slide04TaksonomiPola';
import { Slide05PetaPilihan } from '../src/slides/Slide05PetaPilihan';
import { Slide06HeftGaOverview } from '../src/slides/Slide06HeftGaOverview';
import { Slide07HeftInteractive } from '../src/slides/Slide07HeftInteractive';
import { Slide08GaInteractive } from '../src/slides/Slide08GaInteractive';
import { Slide09HeftGaIntegration } from '../src/slides/Slide09HeftGaIntegration';
import { Slide10HeftGaSpec } from '../src/slides/Slide10HeftGaSpec';
import { Slide11SflaGaOverview } from '../src/slides/Slide11SflaGaOverview';
import { Slide12SflaInteractive } from '../src/slides/Slide12SflaInteractive';
import { Slide13SflaGaMemeplex } from '../src/slides/Slide13SflaGaMemeplex';
import { Slide14SflaGaShuffle } from '../src/slides/Slide14SflaGaShuffle';
import { Slide15SflaGaSpec } from '../src/slides/Slide15SflaGaSpec';
import { Slide16SetupEksperimen } from '../src/slides/Slide16SetupEksperimen';
import { Slide17SimulatorLive } from '../src/slides/Slide17SimulatorLive';
import { Slide18HasilStatistik } from '../src/slides/Slide18HasilStatistik';
import { Slide19WinnerSpotlight } from '../src/slides/Slide19WinnerSpotlight';
import { Slide20WinnerDeepDive } from '../src/slides/Slide20WinnerDeepDive';
import { Slide21Perbandingan3Arah } from '../src/slides/Slide21Perbandingan3Arah';
import { Slide22KesimpulanDaftarPustaka } from '../src/slides/Slide22KesimpulanDaftarPustaka';
import { Slide23RealWorldScenario } from '../src/slides/Slide23RealWorldScenario';
import { Slide24WhatIfDashboard } from '../src/slides/Slide24WhatIfDashboard';
import { Slide25RekomendasiIndustri } from '../src/slides/Slide25RekomendasiIndustri';
import { StorylineModal } from '../src/storyline/StorylineModal';
import { WorldScene } from '../src/three/WorldScene';
import { WAYPOINTS } from '../src/three/camera/waypoints';

describe('Full UI, 25 Slides, Storyline & 3D World Scene Verification', () => {
  const allSlides = [
    { id: 1, comp: Slide01Cover },
    { id: 2, comp: Slide02Ketentuan },
    { id: 3, comp: Slide03MasalahCloud },
    { id: 4, comp: Slide04TaksonomiPola },
    { id: 5, comp: Slide05PetaPilihan },
    { id: 6, comp: Slide06HeftGaOverview },
    { id: 7, comp: Slide07HeftInteractive },
    { id: 8, comp: Slide08GaInteractive },
    { id: 9, comp: Slide09HeftGaIntegration },
    { id: 10, comp: Slide10HeftGaSpec },
    { id: 11, comp: Slide11SflaGaOverview },
    { id: 12, comp: Slide12SflaInteractive },
    { id: 13, comp: Slide13SflaGaMemeplex },
    { id: 14, comp: Slide14SflaGaShuffle },
    { id: 15, comp: Slide15SflaGaSpec },
    { id: 16, comp: Slide16SetupEksperimen },
    { id: 17, comp: Slide17SimulatorLive },
    { id: 18, comp: Slide18HasilStatistik },
    { id: 19, comp: Slide19WinnerSpotlight },
    { id: 20, comp: Slide20WinnerDeepDive },
    { id: 21, comp: Slide21Perbandingan3Arah },
    { id: 22, comp: Slide22KesimpulanDaftarPustaka },
    { id: 23, comp: Slide23RealWorldScenario },
    { id: 24, comp: Slide24WhatIfDashboard },
    { id: 25, comp: Slide25RekomendasiIndustri }
  ];

  for (const s of allSlides) {
    it(`Slide ${s.id} should render without runtime errors and have a valid 3D camera waypoint`, () => {
      const html = renderToString(React.createElement(s.comp));
      expect(html.length).toBeGreaterThan(50);
      expect(WAYPOINTS[s.id]).toBeDefined();
      expect(WAYPOINTS[s.id].position).toHaveLength(3);
      expect(WAYPOINTS[s.id].target).toHaveLength(3);
    });
  }

  it('StorylineModal should render cleanly when open', () => {
    const html = renderToString(
      React.createElement(StorylineModal, {
        isOpen: true,
        onClose: () => {},
        onWaypointChange: () => {}
      })
    );
    expect(html).toContain('BIOSKOP SOKA');
  });

  it('WorldScene 3D should initialize all zones and update animations without error', () => {
    const world = new WorldScene();
    expect(world.scene).toBeDefined();
    expect(world.getIntersectables().length).toBeGreaterThan(0);
    // Run animation ticks
    world.update(0.5);
    world.update(1.5);
  });
});
