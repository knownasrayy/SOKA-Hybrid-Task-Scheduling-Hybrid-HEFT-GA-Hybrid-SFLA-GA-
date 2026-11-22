export interface StorylineBeat {
  text: string;
  cameraWaypoint?: number; // Slide / waypoint id (1 to 25)
  highlightTarget?: string; // e.g., 'rack-1', 'task-5', 'heft', 'sfla', 'podium'
}

export interface StorylineChapter {
  id: number;
  title: string;
  subtitle: string;
  diagram: 'cloud' | 'schedules' | 'choices' | 'heftRelay' | 'sflaMemeplex' | 'arenaRace' | 'summaryPodium';
  waypoint: number;
  beats: StorylineBeat[];
}

export const STORYLINE_CHAPTERS: StorylineChapter[] = [
  {
    id: 1,
    title: 'Bab 1 · Pengantar Komputasi Awan & Penjadwalan Tugas',
    subtitle: 'Alur kerja ilmiah modern di atas ribuan server virtual heterogen',
    diagram: 'cloud',
    waypoint: 1,
    beats: [
      {
        text: 'Selamat datang di ITS HybridLab. Setiap detik, ribuan alur kerja komputasi dikirimkan oleh pengguna ke pusat data komputasi awan.',
        cameraWaypoint: 1
      },
      {
        text: 'Alur kerja ini terdiri dari puluhan hingga ratusan tugas yang saling terhubung dalam graf berarah (DAG), dan harus dialokasikan ke mesin virtual dengan spesifikasi heterogen.',
        cameraWaypoint: 3
      },
      {
        text: 'Tantangan terbesarnya adalah: bagaimana memetakan setiap tugas ke mesin virtual yang tepat agar waktu total eksekusi dan biaya sewa seminimal mungkin?',
        cameraWaypoint: 3
      }
    ]
  },
  {
    id: 2,
    title: 'Bab 2 · Anatomi Makespan & Ledakan Kombinatorial',
    subtitle: 'Waktu selesai tugas terakhir (makespan) dan ruang pencarian yang melampaui triliunan',
    diagram: 'schedules',
    waypoint: 3,
    beats: [
      {
        text: 'Perhatikan diagram di atas: jika tugas dibagikan sembarangan, satu mesin virtual akan mengalami kelebihan beban (overloaded), sementara mesin lainnya menganggur.',
        cameraWaypoint: 3
      },
      {
        text: 'Waktu ketika tugas terakhir selesai disebut Makespan. Ketika satu mesin kelebihan beban, makespan melonjak drastis dan biaya membengkak.',
        cameraWaypoint: 3
      },
      {
        text: 'Untuk menjadwalkan 20 tugas ke dalam 5 mesin virtual saja, terdapat 5 pangkat 20—yaitu sekitar 95 triliun kombinasi jadwal! Sangat mustahil diperiksa satu per satu secara brute force.',
        cameraWaypoint: 3
      }
    ]
  },
  {
    id: 3,
    title: 'Bab 3 · Dilema Heuristik Murni vs Metaheuristik Murni',
    subtitle: 'Kecepatan rakus (greedy) yang rentan lokal optima vs pencarian acak yang lambat konvergen',
    diagram: 'choices',
    waypoint: 4,
    beats: [
      {
        text: 'Di sinilah sains optimasi hadir. Heuristik deterministik seperti HEFT sangat cepat, namun bersifat rakus (greedy) sehingga mudah terperangkap pada solusi lokal optima yang kurang efisien.',
        cameraWaypoint: 4
      },
      {
        text: 'Sebaliknya, metaheuristik seperti Genetic Algorithm (GA) memiliki kemampuan eksplorasi global yang luar biasa, namun membutuhkan ratusan generasi acak hanya untuk menemukan solusi awal yang layak.',
        cameraWaypoint: 4
      },
      {
        text: 'Jawaban atas dilema ini adalah ALGORITMA HYBRID: menggabungkan kecepatan heuristik dengan kecerdasan eksplorasi metaheuristik.',
        cameraWaypoint: 4
      }
    ]
  },
  {
    id: 4,
    title: 'Bab 4 · Kisah Hybrid HEFT-GA — Pola B (Seeding Relay)',
    subtitle: 'Estafet bibit unggul: HEFT menyuntikkan jadwal deterministik ke populasi awal GA',
    diagram: 'heftRelay',
    waypoint: 6,
    beats: [
      {
        text: 'Karya ilmiah Aziza dan Krichen (2020) mengusulkan Pola B: Seeding Relay. Algoritma HEFT pertama-tama menghitung upward rank rekursif dari graf tugas.',
        cameraWaypoint: 7
      },
      {
        text: 'Jadwal cerdas awal dari HEFT kemudian disuntikkan secara khusus sebagai individu bibit unggul ke dalam populasi generasi ke-nol Genetic Algorithm.',
        cameraWaypoint: 9
      },
      {
        text: 'Operator GA seperti seleksi turnamen, crossover dua titik, dan mutasi integer kemudian menyempurnakan solusi tersebut, memastikan konvergensi jauh lebih cepat sejak detik pertama.',
        cameraWaypoint: 9
      }
    ]
  },
  {
    id: 5,
    title: 'Bab 5 · Kisah Hybrid SFLA-GA — Pola C (Teamwork Memeplex)',
    subtitle: 'Kolam katak terpartisi: operator GA melakukan pencarian lokal di dalam setiap habitat',
    diagram: 'sflaMemeplex',
    waypoint: 11,
    beats: [
      {
        text: 'Karya ilmiah Kayalvili dan Selvam (2019) menghadirkan pendekatan Pola C yang sangat elegan: Shuffled Frog Leaping Algorithm.',
        cameraWaypoint: 12
      },
      {
        text: 'Seluruh populasi katak dipartisi ke dalam beberapa memeplex atau kolam habitat terpisah. Di dalam setiap memeplex, katak dengan posisi terburuk tidak hanya melompat biasa.',
        cameraWaypoint: 13
      },
      {
        text: 'Melainkan dievolusikan menggunakan operator Crossover dan Mutasi GA! Setelah evolusi lokal, dilakukan Global Shuffle untuk mengocok genetik antarkolam agar terhindar dari jebakan lokal optima.',
        cameraWaypoint: 14
      }
    ]
  },
  {
    id: 6,
    title: 'Bab 6 · Pertarungan di Arena 3D (Duel HEFT-GA vs SFLA-GA)',
    subtitle: 'Dua lintasan datacenter paralel bersaing menyelesaikan dataset komputasi awan yang sama',
    diagram: 'arenaRace',
    waypoint: 17,
    beats: [
      {
        text: 'Mari kita saksikan simulasi langsung di Arena Dua Lajur: lintasan kiri menjalankan HEFT-GA, lintasan kanan menjalankan SFLA-GA pada dataset yang identik.',
        cameraWaypoint: 17
      },
      {
        text: 'HEFT-GA langsung melesat memimpin di awal berkat injeksi bibit deterministik, memangkas makespan dengan kurva konvergensi yang turun curam.',
        cameraWaypoint: 17
      },
      {
        text: 'Sementara itu, SFLA-GA terus melompat secara konsisten antarmemeplex, mencari celah kombinasi alokasi yang lebih hemat biaya energi.',
        cameraWaypoint: 17
      }
    ]
  },
  {
    id: 7,
    title: 'Bab 7 · Penobatan Pemenang & Kesimpulan Industri',
    subtitle: 'Podium 3D berbasis evaluasi data empiris N=30 run dan implementasi dunia nyata',
    diagram: 'summaryPodium',
    waypoint: 19,
    beats: [
      {
        text: 'Berdasarkan evaluasi statistik N=30 run independen dan normalisasi multi-objektif, algoritma pemenang dinobatkan di podium tertinggi!',
        cameraWaypoint: 19
      },
      {
        text: 'Hybrid HEFT-GA terbukti unggul mutlak dalam kecepatan penjadwalan dan makespan, menjadikannya pilihan ideal untuk sistem cloud real-time seperti Kubernetes scheduler.',
        cameraWaypoint: 20
      },
      {
        text: 'Sedangkan SFLA-GA sangat kompetitif untuk batch workload jangka panjang yang memprioritaskan efisiensi biaya. Inilah masa depan optimasi cloud berbasis kecerdasan komputasi!',
        cameraWaypoint: 22
      }
    ]
  }
];
