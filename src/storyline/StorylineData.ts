export interface StorylineBeat {
  text: string;
  cameraWaypoint?: number;
  stepTag?: string;
}

export interface StorylineChapter {
  id: number;
  shortTitle: string;
  title: string;
  subtitle: string;
  analogyLabel: string;
  relatedSlide: number;
  diagram: 'cloud' | 'schedules' | 'choices' | 'heftRelay' | 'sflaMemeplex' | 'arenaRace' | 'summaryPodium';
  waypoint: number;
  beats: StorylineBeat[];
}

export const STORYLINE_CHAPTERS: StorylineChapter[] = [
  {
    id: 1,
    shortTitle: '1. Cloud ITS',
    title: 'Bab 1 · Kepulauan Komputasi Awan ITS',
    subtitle: 'Gerbang Cloud membagi alur kerja ilmiah ke dua pulau algoritma hybrid',
    analogyLabel: 'Analogi 3D: Gerbang Cloud Tengah mengirim paket kristal tugas ke dua pulau',
    relatedSlide: 1,
    diagram: 'cloud',
    waypoint: 1,
    beats: [
      {
        stepTag: 'Panorama Kepulauan',
        text: 'Selamat datang di ITS HybridLab 3D! Bayangkan pusat data cloud sebagai kepulauan langit yang terhubung oleh sungai energi data.',
        cameraWaypoint: 1
      },
      {
        stepTag: 'Gerbang Dispatcher',
        text: 'Di pulau tengah berdiri Gerbang Cloud ITS yang menerima ribuan tugas ilmiah (DAG) dan mengirimkannya sebagai kristal data ke dua pulau algoritma: Pulau HEFT-GA di kiri dan Pulau SFLA-GA di kanan.',
        cameraWaypoint: 3
      }
    ]
  },
  {
    id: 2,
    shortTitle: '2. Masalah',
    title: 'Bab 2 · Ledakan Kombinasi & Bottleneck Makespan',
    subtitle: 'Mengapa penjadwalan cloud tidak mungkin diselesaikan secara brute-force',
    analogyLabel: 'Analogi 3D: 20 tugas × 4 menara VM = 1,1 Triliun rute penugasan',
    relatedSlide: 3,
    diagram: 'schedules',
    waypoint: 3,
    beats: [
      {
        stepTag: 'Tantangan Beban',
        text: 'Jika paket tugas menumpuk di satu menara VM saja sementara menara lain menganggur, waktu selesai total (Makespan) melonjak drastis dan biaya sewa membengkak.',
        cameraWaypoint: 3
      },
      {
        stepTag: 'Ruang Pencarian',
        text: 'Untuk 20 tugas pada 4 VM saja, terdapat 4 pangkat 20 — lebih dari 1,1 triliun kemungkinan jadwal! Karena itu, kita butuh kecerdasan algoritma Hybrid.',
        cameraWaypoint: 4
      }
    ]
  },
  {
    id: 3,
    shortTitle: '3. Pulau HEFT',
    title: 'Bab 3 · Pulau Arsitek HEFT-GA (Pola B: Seeding Relay)',
    subtitle: 'Drone Arsitek HEFT memindai kristal DAG lalu menyerahkan Tongkat Estafet Emas',
    analogyLabel: 'Analogi 3D: Drone Arsitek memindai Kristal DAG → Menara VM tercepat',
    relatedSlide: 7,
    diagram: 'heftRelay',
    waypoint: 7,
    beats: [
      {
        stepTag: '1 · Pindai DAG',
        text: 'Mari terbang ke Pulau Kiri: Pulau Hybrid HEFT-GA (Aziza & Krichen, 2020). Di langit pulau melayang konstelasi Kristal DAG yang menunjukkan urutan ketergantungan tugas.',
        cameraWaypoint: 7
      },
      {
        stepTag: '2 · Estafet Bibit',
        text: 'Lihat Drone Arsitek HEFT yang meluncur membawa Tongkat Estafet Emas! Ia menghitung jadwal deterministik tercepat (Upward Rank & EFT) lalu menyerahkannya langsung sebagai bibit unggul.',
        cameraWaypoint: 9
      }
    ]
  },
  {
    id: 4,
    shortTitle: '4. Reaktor DNA',
    title: 'Bab 4 · Evolusi Kromosom di Reaktor DNA GA',
    subtitle: 'Bibit unggul HEFT disuntikkan ke populasi generasi ke-0 Genetic Algorithm',
    analogyLabel: 'Analogi 3D: Reaktor Double-Helix DNA memutar & menyilangkan gen jadwal',
    relatedSlide: 9,
    diagram: 'choices',
    waypoint: 8,
    beats: [
      {
        stepTag: 'Injeksi Generasi 0',
        text: 'Tongkat Estafet Emas dari HEFT disuntikkan ke Reaktor DNA Double-Helix di kanan pulau. Setiap anak tangga warna-warni pada heliks adalah satu gen penugasan tugas ke VM.',
        cameraWaypoint: 8
      },
      {
        stepTag: 'Crossover & Mutasi',
        text: 'Karena sudah dimulai dari bibit unggul HEFT (bukan tebakan acak), operator seleksi turnamen, crossover 2-titik, dan mutasi GA langsung melesat menuju solusi optimal dalam waktu singkat!',
        cameraWaypoint: 9
      }
    ]
  },
  {
    id: 5,
    shortTitle: '5. Kolam Katak',
    title: 'Bab 5 · Pulau Kolam Teratai SFLA-GA (Pola C: Teamwork)',
    subtitle: '12 katak 3D dibagi ke 4 cincin habitat Memeplex di atas kolam teratai',
    analogyLabel: 'Analogi 3D: 12 Katak 3D melompat di 4 cincin Memeplex + Mahkota Emas Xb',
    relatedSlide: 12,
    diagram: 'sflaMemeplex',
    waypoint: 12,
    beats: [
      {
        stepTag: '1 · Partisi Habitat',
        text: 'Sekarang kita menyeberang ke Pulau Kanan: Pulau Kolam Teratai SFLA-GA (Kayalvili & Selvam, 2019). Setiap katak di atas daun teratai mewakili satu kandidat jadwal cloud.',
        cameraWaypoint: 12
      },
      {
        stepTag: '2 · Evolusi Lokal GA',
        text: 'Perhatikan katak bermahkota emas (Xb) sebagai pemimpin terbaik tiap cincin, dan katak bercincin emas berputar (Xw) yang melompat sambil dievolusikan oleh operator Crossover & Mutasi GA!',
        cameraWaypoint: 13
      },
      {
        stepTag: '3 · Global Shuffle',
        text: 'Setelah berevolusi di habitat masing-masing, seluruh katak dikocok ulang (Global Shuffle) agar informasi jadwal terbaik menyebar ke seluruh kolam tanpa terjebak lokal optima.',
        cameraWaypoint: 14
      }
    ]
  },
  {
    id: 6,
    shortTitle: '6. Duel Pulau',
    title: 'Bab 6 · Pertarungan Adil Dua Pulau (N=30 Run)',
    subtitle: 'HEFT-GA vs SFLA-GA diuji pada dataset Minggu 3 dengan budget evaluasi yang sama',
    analogyLabel: 'Analogi 3D: Kedua pulau menerima aliran paket tugas identik dari Gerbang Cloud',
    relatedSlide: 17,
    diagram: 'arenaRace',
    waypoint: 17,
    beats: [
      {
        stepTag: 'Uji Adil 10.000 Eval',
        text: 'Di panorama ini, kedua pulau menjalankan dataset Minggu 3 dengan budget evaluasi identik selama 30 kali percobaan independen menggunakan Mulberry32 PRNG deterministik.',
        cameraWaypoint: 17
      },
      {
        stepTag: 'Karakter Masing-Masing',
        text: 'HEFT-GA unggul cepat sejak generasi pertama berkat estafet bibit deterministik, sementara SFLA-GA sangat gigih melakukan eksplorasi terpartisi untuk menekan biaya operasional.',
        cameraWaypoint: 16
      }
    ]
  },
  {
    id: 7,
    shortTitle: '7. Podium Juara',
    title: 'Bab 7 · Penobatan Pemenang di Podium Emas ITS',
    subtitle: 'Keputusan pemenang berbasis skor komposit multi-objektif tanpa hardcode',
    analogyLabel: 'Analogi 3D: Podium Marmer 3 Tingkat & Piala Emas Wijayakusuma',
    relatedSlide: 19,
    diagram: 'summaryPodium',
    waypoint: 19,
    beats: [
      {
        stepTag: 'Podium Kehormatan',
        text: 'Akhir perjalanan membawa kita ke Pulau Podium Juara! Pemenang di puncak podium dihitung murni dari skor komposit Makespan, Biaya Cloud, Utilisasi VM, dan Load Balance.',
        cameraWaypoint: 19
      },
      {
        stepTag: 'Siap Eksplorasi PPT',
        text: 'Kamu bisa klik objek 3D manapun untuk melihat telemetrinya, atau klik tombol "Versi PPT (25 Slide)" di bar atas untuk membuka simulator interaktif, grafik statistik, dan dashboard What-If!',
        cameraWaypoint: 22
      }
    ]
  }
];
