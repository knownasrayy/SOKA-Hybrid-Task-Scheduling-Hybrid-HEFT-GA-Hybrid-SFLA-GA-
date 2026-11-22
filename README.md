# HybridLab 3D · Website Presentasi Interaktif Algoritma Hybrid
> **Mata Kuliah:** Strategi Optimasi Komputasi Awan (SOKA) — Tugas Minggu 13–14  
> **Presenter:** Rayhan (5027221019) · Departemen Teknologi Informasi, Institut Teknologi Sepuluh Nopember (ITS)  
> **Visual Identity:** Panduan Identitas Visual Resmi ITS 2026 (*Biru Lambang ITS #127BBE, Kuning Emas Wijayakusuma #FDBB16, Putih Perak Tugu Pahlawan #F3F4F6, Cyber Navy #0B132B*)  
> **Target:** Presentasi Demo 1 (Minggu 13) & Demo 2 (Minggu 14)  

---

## 1. Ringkasan Eksekutif & Diferensiasi Desain

HybridLab 3D adalah media presentasi dan simulasi komputasi awan berbasis **WebGL 3D (Three.js)** dan **React 19 + Tailwind CSS**, dirancang secara khusus agar tampil orisinal, elegan, dan selaras dengan identitas almamater **Institut Teknologi Sepuluh Nopember (ITS Surabaya)**, sepenuhnya berbeda dari tema neo-brutalist dosen (`minggu-12/index.html`).

Website ini membandingkan dan mensimulasikan dua algoritma hybrid terkemuka untuk penjadwalan tugas komputasi awan (*cloud task scheduling*):

1. **Hybrid HEFT-GA** — Aziza & Krichen (2020) · *Neural Computing and Applications (Springer)*
   - **Klasifikasi:** **Pola B** (Heuristik HEFT + Metaheuristik GA / *Seeding Relay*).
   - **Mekanisme:** Solusi deterministik dari upward rank HEFT disuntikkan ke generasi ke-0 populasi GA, lalu dievolusikan menggunakan seleksi turnamen, crossover 2-titik, dan mutasi integer.
2. **Hybrid SFLA-GA** — Kayalvili & Selvam (2019) · *Cluster Computing (Springer)*
   - **Klasifikasi:** **Pola C** (Metaheuristik SFLA + Metaheuristik GA / *Teamwork*).
   - **Mekanisme:** Katak dipartisi ke dalam $m$ memeplex; di dalam setiap memeplex, operator GA (crossover + mutasi) melakukan pencarian lokal untuk meloloskan katak dari lokal optima, dilanjutkan pengocokan global (*global shuffle*).
3. **Dua Metode Pembanding (Baseline Tugas Sebelumnya):**
   - **SFLA Murni** (Eusuff & Lansey, 2003 / 2006).
   - **WCA Murni** (Eskandar et al., 2012) / *Water Cycle Algorithm*.

### Checklist Kepatuhan 6 Ketentuan Dosen
| No | Ketentuan Dosen | Realisasi di HybridLab 3D | Status |
|:--:|---|---|:--:|
| 1 | Pilih 2 hybrid dari **Pola B–E** (bukan Pola A) | Pola B (HEFT-GA) & Pola C (SFLA-GA) | **TERPENUHI** |
| 2 | Sumber wajib dari **paper/jurnal ilmiah** | Sitasi APA + DOI Springer di footer & modal | **TERPENUHI** |
| 3 | Orisinalitas pilihan antarkelas | Pilihan kombinasi unik terverifikasi | **TERPENUHI** |
| 4 | Implementasi simulator + Dataset Minggu 3 | Simulator cloud deterministik tertanam + loader Minggu 3 | **TERPENUHI** |
| 5 | Presentasikan 1 hybrid yang lebih unggul | *Winner Spotlight* dinamis berbasis skor komposit (N=30 run) | **TERPENUHI** |
| 6 | Bandingkan dengan 2 metode sebelumnya | Komparasi 3 arah (Hybrid Unggul vs SFLA vs WCA) radar & bar | **TERPENUHI** |

---

## 2. Arsitektur Dunia 3D WebGL (Three.js)

Dunia visual 3D dirender dalam satu canvas WebGL persisten yang menghubungkan seluruh 25 slide melalui interpolasi kamera mulus (*waypoint lerp*):
- **Datacenter Platform & Server Racks:** 4 rak server dengan indikator CPU/MIPS, ventilasi pendingin berpendar, dan lajur waktu alokasi VM.
- **3D DAG Space (Slide 7):** Kisi kubus tugas melayang di ruang 3D lengkap dengan upward rank rekursif dan garis transfer komunikasi antartugas.
- **3D Chromosome Lab (Slide 8–9):** Untaian kromosom heliks 3D yang berputar dengan gen warna-warni yang merepresentasikan VM assignment.
- **3D Lotus Pond (Slide 12–14):** Kolam daun teratai dengan katak 3D yang melompat dinamis antarhabitat memeplex.
- **Dual-Lane Arena (Slide 17):** Lintasan komparasi langsung antara HEFT-GA (biru ITS) dan SFLA-GA (teal tosca).
- **Winner Podium (Slide 19):** Podium 3 tingkat dengan piala emas Wijayakusuma berputar, lampu sorot volumetrik, dan selebrasi partikel confetti.
- **Raycasting Interaktif & Follow Entity:** Klik pada objek (server rack, task cube, chromosome gene, frog) untuk mengunci fokus kamera dan menampilkan panel telemetri live (*target focus ring*).

---

## 3. Fitur Unggulan: Bioskop SOKA (Storyline Mode)

Terinspirasi dari pendekatan bercerita naratif pada proyek referensi *Sky Optimizers (metaheuristik-pso-gwo)*, HybridLab 3D dilengkapi dengan **Mode Cerita Sinematik (Storyline Mode / Bioskop SOKA)**:
- **7 Bab Narasi Terpandu:** Dari anatomi masalah komputasi awan, bottleneck makespan, dilema lokal optima, Seeding Relay HEFT-GA, Teamwork Memeplex SFLA-GA, hingga balapan live di arena 3D dan penobatan juara di podium.
- **Diagram Animasi Sinkron:** Diagram alur pengguna cloud, perbandingan jadwal overload vs balance, tongkat estafet HEFT, dan partisi kolam memeplex.
- **Narasi Suara (Web Speech Synthesis ID):** Suara narator otomatis berbahasa Indonesia dengan kontrol `Suara Nyala / Mati`.
- **Kamera 3D Otomatis:** Kamera 3D di latar belakang otomatis meluncur ke sudut pandang yang tepat saat narasi membahas komponen terkait.
- **Segmented Scrubber Bar:** Navigasi cepat antar-bab dengan progress bar interaktif.

---

## 4. Navigasi & Shortcut Keyboard

| Tombol | Fungsi |
|---|---|
| `S` | Buka / tutup **Bioskop SOKA · Mode Cerita Naratif (Storyline)** |
| `→` atau `Spasi` | Maju ke slide / sub-langkah berikutnya |
| `←` atau `Shift + Spasi` | Mundur ke slide sebelumnya |
| `E` | Beralih ke **Mode Explore 3D** (rotasi orbit mouse 360°, zoom in/out, pan) |
| `R` | **Reset Kamera 3D** kembali ke waypoint resmi slide aktif |
| `2` | Toggle **3D WebGL vs 2D Fallback Mode** (latar gelap solid untuk proyektor low-end) |
| `H` | Toggle **Tampil / Sembunyikan HUD** (tampilan 3D sinematik penuh) |
| `M` | Siklus **Mode Kualitas Grafis** (*High* 60fps / *Balanced* / *Performance*) |
| `P` | Buka / tutup **Catatan Presenter & Stopwatch Timer** |
| `G` atau `Esc` | Buka / tutup **Menu Daftar Isi Slide** (25 slide) |
| `F` | Buka / tutup **Mode Layar Penuh (Fullscreen)** |

---

## 5. Struktur Konten (25 Slide Lengkap)

- **Bagian A — Pembuka & Konteks (Slide 1–5)**
  - Slide 1: Cover, nama, NIM, mata kuliah (ITS Brand Guideline 2026)
  - Slide 2: 6 Ketentuan Dosen & Jadwal Demo 1 / Demo 2
  - Slide 3: Masalah Cloud Task Scheduling (NP-Hard, ruang pencarian $m^n$, Makespan vs Biaya)
  - Slide 4: Taksonomi Talbi & 5 Pola Hybrid (Pola A–E)
  - Slide 5: Peta Pilihan & Referensi Paper Ilmiah
- **Bagian B — Hybrid HEFT-GA (Slide 6–10)**
  - Slide 6: Mengapa Menggabungkan HEFT & GA (Greedy vs Global Search)
  - Slide 7: HEFT Interaktif (DAG 3D, Upward Rank rekursif, Stepper EFT)
  - Slide 8: GA Interaktif (Encoding kromosom 3D, seleksi turnamen, crossover, mutasi)
  - Slide 9: Integrasi HEFT→GA (Seeding Relay & Kurva Bukti Konvergensi)
  - Slide 10: Spesifikasi Resmi, Pseudocode, Parameter, & Sitasi
- **Bagian C — Hybrid SFLA-GA (Slide 11–15)**
  - Slide 11: Mengapa Menggabungkan SFLA & GA (Premature Convergence Solver)
  - Slide 12: SFLA Interaktif (Populasi katak 3D, kolam teratai, memeplex, lompatan)
  - Slide 13: GA dalam Memeplex (Crossover & mutasi menggantikan formula vektor biasa)
  - Slide 14: Global Shuffle (Pengocokan global & pertukaran genetik antar-habitat)
  - Slide 15: Spesifikasi Resmi, Pseudocode, Parameter, & Sitasi
- **Bagian D — Eksperimen, Pemenang, & Komparasi (Slide 16–22)**
  - Slide 16: Setup Eksperimen (Dataset Minggu 3, heterogenitas VM, budget 10.000 evaluasi, N=30 run)
  - Slide 17: Live Simulator (Eksekusi HEFT-GA vs SFLA-GA berdampingan dengan Gantt & Konvergensi)
  - Slide 18: Tabel Statistik Lengkap (Mean ± Std, Min, Max, Median) & Boxplot Sebaran
  - Slide 19: 🏆 **Winner Spotlight** (Pemenang dihitung dinamis dari data + Confetti di Podium 3D)
  - Slide 20: Deep Dive Pemenang (Walkthrough jadwal akhir & Pareto trade-off)
  - Slide 21: Perbandingan 3 Arah (Hybrid Unggul vs Baseline SFLA vs Baseline WCA)
  - Slide 22: Kesimpulan Demo 1 & Daftar Pustaka Lengkap
- **Bagian E — Demo 2 (Minggu 14) Real-World Phase (Slide 23–25)**
  - Slide 23: Skenario Real World (Montage Astronomy & CyberShake Seismik pada AWS EC2 Pricing)
  - Slide 24: **Interactive What-If Dashboard** (Slider Jumlah Task, Kapasitas VM, Bobot Prioritas Waktu vs Biaya)
  - Slide 25: Rekomendasi Industri (Kapan pakai HEFT vs Hybrid, korelasi dengan Kubernetes & Cloud)

---

## 6. Cara Menjalankan Proyek Secara Lokal

### Menjalankan Development Server:
```bash
pnpm run dev
```
Buka browser di `http://localhost:3000`.

### Menjalankan Unit Tests:
```bash
pnpm run test
# atau langsung via Node:
# node ./node_modules/vitest/vitest.mjs run
```

### Membangun Production Bundle:
```bash
pnpm run build
# Hasil build statis ada di folder `dist/` siap dijalankan atau di-hosting.
```

---

## 7. Referensi Ilmiah

1. **Aziza, H., & Krichen, S. (2020).** A hybrid genetic algorithm for scientific workflow scheduling in cloud environment. *Neural Computing and Applications*, 32(18), 15263–15278. [https://doi.org/10.1007/s00521-020-04878-8](https://doi.org/10.1007/s00521-020-04878-8)
2. **Kayalvili, S., & Selvam, M. (2019).** Hybrid SFLA-GA algorithm for an optimal resource allocation in cloud. *Cluster Computing*, 22(Suppl 2), 3165–3173. [https://doi.org/10.1007/s10586-018-2011-8](https://doi.org/10.1007/s10586-018-2011-8)
3. **Topcuoglu, H., Hariri, S., & Wu, M. Y. (2002).** Performance-effective and low-complexity task scheduling for heterogeneous computing. *IEEE Transactions on Parallel and Distributed Systems*, 13(3), 260–274.
4. **Eusuff, M., Lansey, K., & Pasha, F. (2006).** Shuffled frog-leaping algorithm: a memetic meta-heuristic for discrete optimization. *Engineering Optimization*, 38(2), 129–154.
5. **Eskandar, H., Sadollah, A., Bahreininejad, A., & Hamdi, M. (2012).** Water cycle algorithm–A novel metaheuristic optimization method for solving constrained engineering problems. *Computers & Structures*, 110, 151–166.
