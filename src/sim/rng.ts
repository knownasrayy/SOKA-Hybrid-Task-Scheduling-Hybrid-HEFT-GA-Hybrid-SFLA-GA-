/**
 * Seeded Pseudo-Random Number Generator (Mulberry32)
 * Ensures 100% reproducible experiments across runs.
 */
export class RNG {
  private s: number;

  constructor(seed: number) {
    this.s = seed | 0;
  }

  /** Returns pseudo-random float in [0, 1) */
  random(): number {
    this.s |= 0;
    this.s = (this.s + 0x6d2b79f5) | 0;
    let t = Math.imul(this.s ^ (this.s >>> 15), 1 | this.s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns random integer in [min, max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /** Returns random float in [min, max) */
  range(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  /** Shuffles array in-place using Fisher-Yates */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /** Creates an independent sub-RNG with a deterministic derived seed */
  fork(salt: number): RNG {
    return new RNG(Math.imul(this.s ^ salt, 0x5bd1e995));
  }
}

export function createRNG(seed: number = 2026): RNG {
  return new RNG(seed);
}
