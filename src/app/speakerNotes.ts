export interface SpeakerNote {
  slideId: number;
  title: string;
  section: string;
  notes: string[];
  durationMinutes: number;
}

export const SPEAKER_NOTES: Record<number, SpeakerNote> = {
  1: {
    slideId: 1,
    title: 'Cover & Pembuka',
    section: 'Bagian A · Pembuka',
    notes: [
      'Ucapkan salam dan perkenalkan diri: Rayhan (5027221019) dari kelas SOKA.',
      'Sampaikan judul: Komparasi Hybrid HEFT-GA vs Hybrid SFLA-GA untuk Cloud Task Scheduling.',
      'Tegaskan bahwa website ini dirancang untuk Demo 1 (Minggu 13) dan Demo 2 (Minggu 14), dengan simulator terintegrasi yang menghitung data secara nyata tanpa hardcode.'
    ],
    durationMinutes: 1
  },
  2: {
    slideId: 2,
    title: 'Ketentuan Tugas',
    section: 'Bagian A · Pembuka',
    notes: [
      'Jelaskan 6 ketentuan wajib dari dosen pengampu.',
      'Soroti bahwa kita memilih Pola B (HEFT-GA) dan Pola C (SFLA-GA), keduanya memenuhi syarat heuristik + metaheuristik (bukan Pola A).',
      'Tegaskan bahwa kedua paper bersumber dari jurnal Springer bereputasi (Q1 dan Q2).'
    ],
    durationMinutes: 1
  },
  3: {
    slideId: 3,
    title: 'Formulasi Masalah Cloud',
    section: 'Bagian A · Pembuka',
    notes: [
      'Jelaskan mengapa task scheduling di cloud adalah NP-hard: ruang solusi m^n (4^50 kombinasi).',
      'Tekankan trade-off dua objektif: Makespan (waktu) vs Biaya moneter (USD) dan transfer data inter-VM.'
    ],
    durationMinutes: 1.5
  },
  4: {
    slideId: 4,
    title: 'Taksonomi Hybrid',
    section: 'Bagian A · Pembuka',
    notes: [
      'Paparkan 5 pola hybrid dosen (A sampai E).',
      'Tunjukkan bahwa Pola A tidak boleh dipilih, sedangkan Pola B (Seeding Relay) dan Pola C (Teamwork) sangat ideal dan sesuai acuan.'
    ],
    durationMinutes: 1.5
  },
  5: {
    slideId: 5,
    title: 'Peta Pilihan & Referensi',
    section: 'Bagian A · Pembuka',
    notes: [
      'Perkenalkan kedua paper utama: Aziza & Krichen (2020) dan Kayalvili & Selvam (2019).',
      'Sebutkan 2 baseline pembanding: SFLA dan WCA dari tugas presentasi sebelumnya.'
    ],
    durationMinutes: 1
  },
  6: {
    slideId: 6,
    title: 'Overview HEFT-GA',
    section: 'Bagian B · Hybrid HEFT-GA',
    notes: [
      'Jelaskan mengapa HEFT digabung dengan GA.',
      'HEFT cepat tapi greedy (tidak bisa merevisi keputusan awal); GA eksploratif tapi butuh titik awal bagus.'
    ],
    durationMinutes: 1.5
  },
  7: {
    slideId: 7,
    title: 'HEFT Interaktif',
    section: 'Bagian B · Hybrid HEFT-GA',
    notes: [
      'Gunakan stepper untuk mendemonstrasikan bagaimana upward rank dihitung secara rekursif.',
      'Tunjukkan bagaimana task dialokasikan ke VM dengan EFT minimum pada Gantt chart.'
    ],
    durationMinutes: 2
  },
  8: {
    slideId: 8,
    title: 'GA Interaktif',
    section: 'Bagian B · Hybrid HEFT-GA',
    notes: [
      'Tunjukkan encoding kromosom (vektor VM ID) dan cara kerja seleksi turnamen, crossover 2-titik, dan mutasi.'
    ],
    durationMinutes: 1.5
  },
  9: {
    slideId: 9,
    title: 'Integrasi HEFT→GA',
    section: 'Bagian B · Hybrid HEFT-GA',
    notes: [
      'Tekankan golden insight: Generasi-0 HEFT-GA langsung memiliki fitness setara HEFT deterministik.',
      'Tunjukkan kurva konvergensi di mana HEFT-GA menghemat ribuan evaluasi dibanding GA murni.'
    ],
    durationMinutes: 2
  },
  10: {
    slideId: 10,
    title: 'Spesifikasi & Parameter HEFT-GA',
    section: 'Bagian B · Hybrid HEFT-GA',
    notes: [
      'Jelaskan formula fungsi objektif ganda (Makespan / Deadline + Cost / Budget).',
      'Konfirmasi parameter: 20 populasi, pc 0.8, pm 0.1, turnamen 4.'
    ],
    durationMinutes: 1
  },
  11: {
    slideId: 11,
    title: 'Overview SFLA-GA',
    section: 'Bagian C · Hybrid SFLA-GA',
    notes: [
      'Jelaskan motivasi SFLA-GA: SFLA murni rentan terjebak premature convergence jika katak terbaik memeplex macet.',
      'GA dimasukkan ke dalam memeplex untuk merekayasa variasi genetik lokal.'
    ],
    durationMinutes: 1.5
  },
  12: {
    slideId: 12,
    title: 'SFLA Interaktif',
    section: 'Bagian C · Hybrid SFLA-GA',
    notes: [
      'Jalankan stepper kolam katak: katak terburuk (Xw) melompat ke arah katak terbaik (Xb).'
    ],
    durationMinutes: 1.5
  },
  13: {
    slideId: 13,
    title: 'GA dalam Memeplex',
    section: 'Bagian C · Hybrid SFLA-GA',
    notes: [
      'Jelaskan secara spesifik bahwa operator crossover dan mutasi GA menggantikan formula vektor matematis SFLA.'
    ],
    durationMinutes: 1.5
  },
  14: {
    slideId: 14,
    title: 'Global Shuffle',
    section: 'Bagian C · Hybrid SFLA-GA',
    notes: [
      'Jelaskan mengapa global shuffle sangat krusial: mencegah inbreeding dan membagikan solusi terbaik ke habitat lain.'
    ],
    durationMinutes: 1.5
  },
  15: {
    slideId: 15,
    title: 'Spesifikasi & Parameter SFLA-GA',
    section: 'Bagian C · Hybrid SFLA-GA',
    notes: [
      'Konfirmasi parameter SFLA-GA: 24 katak, 4 memeplex, pc 0.8, pm 0.12, 10.000 evaluasi setara.'
    ],
    durationMinutes: 1
  },
  16: {
    slideId: 16,
    title: 'Setup Eksperimen',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Jelaskan dataset Minggu 3 (50 task, 4 VM) dan aturan keadilan perbandingan (anggaran 10.000 evaluasi, N=30 run).'
    ],
    durationMinutes: 1.5
  },
  17: {
    slideId: 17,
    title: 'Simulator Live',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Tunjukkan eksekusi langsung kedua algoritma secara berdampingan di browser.',
      'Tunjukkan Gantt chart dan kurva konvergensi yang ter-render dinamis.'
    ],
    durationMinutes: 2
  },
  18: {
    slideId: 18,
    title: 'Hasil & Uji Statistik',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Baca tabel statistik Mean ± Std dari 30 run.',
      'Gunakan tombol metrik boxplot untuk memperlihatkan sebaran makespan dan biaya.'
    ],
    durationMinutes: 2
  },
  19: {
    slideId: 19,
    title: 'Winner Spotlight',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Soroti pemenang yang dihitung secara dinamis oleh sistem skor komposit.',
      'Sampaikan kalimat kesimpulan kemenangan dan persentase keunggulan di tiap metrik.'
    ],
    durationMinutes: 2
  },
  20: {
    slideId: 20,
    title: 'Deep Dive Pemenang',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Kupas jadwal akhir pemenang: bagaimana penempatan task pada VM cepat vs VM murah menciptakan Pareto-optimal.'
    ],
    durationMinutes: 2
  },
  21: {
    slideId: 21,
    title: 'Perbandingan 3 Arah',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Ini inti Demo 1 (Ketentuan 6): Bandingkan Hybrid Unggul vs Baseline 1 (SFLA) vs Baseline 2 (WCA).',
      'Tunjukkan grafik radar multi-dimensi.'
    ],
    durationMinutes: 2.5
  },
  22: {
    slideId: 22,
    title: 'Kesimpulan & Daftar Pustaka',
    section: 'Bagian D · Eksperimen & Pemenang',
    notes: [
      'Tutup Demo 1 dengan kesimpulan kepatuhan dan daftar pustaka resmi Springer.'
    ],
    durationMinutes: 1.5
  },
  23: {
    slideId: 23,
    title: 'Skenario Real World (Demo 2)',
    section: 'Bagian E · Demo 2 Real World',
    notes: [
      'Masuk ke materi Minggu 14: Aplikasi nyata pada scientific workflow (Montage/CyberShake) dan instance AWS EC2.'
    ],
    durationMinutes: 2
  },
  24: {
    slideId: 24,
    title: 'Dashboard What-If',
    section: 'Bagian E · Demo 2 Real World',
    notes: [
      'Interaksi langsung: Geser slider jumlah task (12-60), kapasitas VM, dan bobot trade-off untuk membuktikan fleksibilitas sistem.'
    ],
    durationMinutes: 2.5
  },
  25: {
    slideId: 25,
    title: 'Rekomendasi Industri & Penutup',
    section: 'Bagian E · Demo 2 Real World',
    notes: [
      'Berikan panduan kapan harus memakai HEFT murni (streaming, low latency) vs Hybrid (batch besar, scientific workflow).',
      'Ucapkan terima kasih dan buka sesi tanya jawab.'
    ],
    durationMinutes: 2
  }
};
