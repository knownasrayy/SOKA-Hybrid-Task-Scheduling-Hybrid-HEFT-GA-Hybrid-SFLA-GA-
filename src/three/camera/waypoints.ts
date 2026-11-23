export interface Waypoint {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  label: string;
}

/**
 * 25 Camera Waypoints synchronized to the 3 Floating Sky Islands:
 * - Central Hub Island: (0, 0, 0)
 * - Left Island (HEFT-GA Architect Drone + Server Towers + DNA Helix): (-17, 0.4, 2)
 * - Right Island (SFLA-GA Jade Lotus Pond + Leaping 3D Frogs): (+17, 0.4, 2)
 * - Winner Podium Island: (0, 0.8, -15)
 */
export const WAYPOINTS: Record<number, Waypoint> = {
  // Part A: Opening & Cloud Context (Panorama of all 3 Floating Islands)
  1: { position: [0, 17, 36], target: [0, 2.5, 0], fov: 46, label: 'Panorama Kepulauan Cloud ITS' },
  2: { position: [10, 15, 28], target: [0, 3.5, 0], fov: 45, label: 'Gerbang Cloud ITS' },
  3: { position: [0, 11, 21], target: [0, 4.2, 0], fov: 44, label: 'Dispatcher Alur Kerja Cloud' },
  4: { position: [-10, 18, 32], target: [0, 2, 1], fov: 48, label: 'Peta Dua Pulau Algoritma' },
  5: { position: [10, 18, 32], target: [0, 2, 1], fov: 48, label: 'Pilihan HEFT-GA vs SFLA-GA' },

  // Part B: Hybrid HEFT-GA (Left Floating Island: x = -17, z = 2)
  6: { position: [-26, 13, 18], target: [-17, 3.2, 2], fov: 44, label: 'Pulau Arsitek & DNA (HEFT-GA)' },
  7: { position: [-21, 9.5, 9.5], target: [-17.5, 5.2, 0.5], fov: 42, label: 'Kristal DAG & Menara VM' },
  8: { position: [-10, 7.2, 11], target: [-14, 4.5, 1], fov: 40, label: 'Reaktor DNA Double-Helix GA' },
  9: { position: [-13, 8.8, 14.5], target: [-15.5, 4.8, 1.5], fov: 42, label: 'Drone Estafet HEFT → DNA GA' },
  10: { position: [-28, 11, 12], target: [-17, 3.5, 2], fov: 44, label: 'Spesifikasi Pulau HEFT-GA' },

  // Part C: Hybrid SFLA-GA (Right Floating Island: x = +17, z = 2)
  11: { position: [26, 13, 18], target: [17, 2.2, 2], fov: 44, label: 'Pulau Kolam Teratai (SFLA-GA)' },
  12: { position: [17, 11.5, 13.5], target: [17, 1.5, 2], fov: 42, label: 'Kolam Teratai & 12 Katak 3D' },
  13: { position: [22.5, 6.2, 9.5], target: [19.5, 1.8, 4.2], fov: 38, label: 'Zoom Memeplex & Evolusi Katak Xw' },
  14: { position: [17, 16, 12], target: [17, 1.5, 2], fov: 46, label: 'Tampak Atas Global Shuffle' },
  15: { position: [28, 10.5, 10], target: [17, 2.0, 2], fov: 44, label: 'Spesifikasi Pulau SFLA-GA' },

  // Part D: Experiments, Duel & Winner Podium
  16: { position: [0, 16, 30], target: [0, 3, 2], fov: 46, label: 'Setup Eksperimen Dua Pulau' },
  17: { position: [0, 14, 34], target: [0, 3, 2], fov: 48, label: 'Duel Paralel HEFT-GA vs SFLA-GA' },
  18: { position: [-7, 10, -3], target: [0, 3.5, -15], fov: 44, label: 'Menuju Podium Statistik' },
  19: { position: [0, 7.2, -4.5], target: [0, 4.5, -15], fov: 40, label: 'Podium Juara & Piala Emas ITS' },
  20: { position: [6.5, 7.8, -5.5], target: [0, 4.2, -15], fov: 40, label: 'Deep Dive Pemenang' },
  21: { position: [-9, 10, -2], target: [0, 3.8, -15], fov: 45, label: 'Perbandingan 3 Arah' },
  22: { position: [0, 18, 36], target: [0, 2.5, -2], fov: 48, label: 'Kesimpulan & Panorama Kepulauan' },

  // Part E: Demo 2 Real-World Cloud Phase
  23: { position: [-18, 15, 22], target: [-6, 3, 2], fov: 46, label: 'Skenario Real-World Montage' },
  24: { position: [18, 15, 22], target: [6, 3, 2], fov: 46, label: 'Simulasi What-If Interaktif' },
  25: { position: [0, 16, 34], target: [0, 3, -2], fov: 46, label: 'Rekomendasi Industri Cloud' }
};
