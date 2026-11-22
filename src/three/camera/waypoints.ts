export interface Waypoint {
  slideId: number;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number; // in seconds
}

/**
 * Camera Waypoints for all 25 slides in the unified 3D World (PRD 3D §5 & §6.1)
 */
export const WAYPOINTS: Record<number, Waypoint> = {
  // Bagian A: Hub & Datacenter Overview (Slides 1-5)
  1: { slideId: 1, name: 'Cover Hub', position: [0, 14, 26], target: [0, 2, 0], fov: 45, duration: 1.2 },
  2: { slideId: 2, name: 'Ketentuan Hub', position: [0, 18, 30], target: [0, 2, 0], fov: 48, duration: 1.0 },
  3: { slideId: 3, name: 'Datacenter Problem', position: [-8, 9, 14], target: [-3, 2, 0], fov: 45, duration: 1.1 },
  4: { slideId: 4, name: 'Pattern Monoliths', position: [0, 8, 18], target: [0, 1.5, -2], fov: 45, duration: 1.1 },
  5: { slideId: 5, name: 'Peta Pilihan', position: [0, 10, 20], target: [0, 2, -2], fov: 46, duration: 1.0 },

  // Bagian B: Hybrid HEFT-GA (Slides 6-10)
  6: { slideId: 6, name: 'HEFT-GA Overview', position: [-18, 10, 12], target: [-14, 2, 0], fov: 42, duration: 1.2 },
  7: { slideId: 7, name: 'DAG Space & EFT', position: [-16, 12, 10], target: [-14, 3, -4], fov: 44, duration: 1.0 },
  8: { slideId: 8, name: 'Chromosome Lab', position: [-14, 7, 8], target: [-14, 2, 0], fov: 40, duration: 1.0 },
  9: { slideId: 9, name: 'HEFT Seeding Relay', position: [-14, 9, 12], target: [-14, 2, -2], fov: 42, duration: 1.0 },
  10: { slideId: 10, name: 'HEFT-GA Spec', position: [-14, 8, 14], target: [-14, 2, 0], fov: 44, duration: 1.0 },

  // Bagian C: Hybrid SFLA-GA (Slides 11-15)
  11: { slideId: 11, name: 'SFLA-GA Overview', position: [18, 12, 14], target: [14, 1.5, 0], fov: 44, duration: 1.2 },
  12: { slideId: 12, name: 'Lotus Pond 3D', position: [14, 16, 12], target: [14, 0.5, 0], fov: 46, duration: 1.0 },
  13: { slideId: 13, name: 'GA in Memeplex', position: [13, 8, 7], target: [13, 0.5, 0], fov: 38, duration: 1.0 },
  14: { slideId: 14, name: 'Global Shuffle', position: [14, 18, 14], target: [14, 0.5, 0], fov: 48, duration: 1.0 },
  15: { slideId: 15, name: 'SFLA-GA Spec', position: [14, 10, 15], target: [14, 1, 0], fov: 44, duration: 1.0 },

  // Bagian D: Eksperimen & Pemenang (Slides 16-22)
  16: { slideId: 16, name: 'Experiment Datacenter', position: [0, 16, 24], target: [0, 3, 0], fov: 46, duration: 1.2 },
  17: { slideId: 17, name: 'Dual-Lane Arena', position: [0, 14, 22], target: [0, 2, -2], fov: 48, duration: 1.1 },
  18: { slideId: 18, name: 'Results Stage', position: [0, 11, 16], target: [0, 2.5, 0], fov: 44, duration: 1.0 },
  19: { slideId: 19, name: 'Winner Podium 3D', position: [0, 9, 13], target: [0, 3.2, 0], fov: 40, duration: 1.1 },
  20: { slideId: 20, name: 'Winner Deep Dive', position: [-4, 7, 10], target: [-2, 2, 0], fov: 42, duration: 1.0 },
  21: { slideId: 21, name: '3-Way Stage', position: [0, 12, 18], target: [0, 2, 0], fov: 45, duration: 1.1 },
  22: { slideId: 22, name: 'Conclusion Hub', position: [0, 15, 26], target: [0, 2, 0], fov: 46, duration: 1.2 },

  // Bagian E: Demo 2 Real World (Slides 23-25)
  23: { slideId: 23, name: 'Real World Cloud', position: [0, 14, 22], target: [0, 3, 0], fov: 45, duration: 1.1 },
  24: { slideId: 24, name: 'What-If Dynamic Stage', position: [0, 10, 15], target: [0, 2, 0], fov: 44, duration: 1.0 },
  25: { slideId: 25, name: 'Industry Wrap-up', position: [0, 16, 26], target: [0, 2, 0], fov: 46, duration: 1.1 }
};
