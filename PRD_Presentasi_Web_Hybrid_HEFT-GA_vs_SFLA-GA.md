# PRD — Website Presentasi Interaktif: Hybrid HEFT-GA vs Hybrid SFLA-GA untuk Cloud Task Scheduling

| Item | Isi |
|---|---|
| Nama proyek | **HybridLab** — Presentasi Web Interaktif Algoritma Hybrid |
| Mata kuliah | Strategi Optimasi Komputasi Awan (Tugas Minggu 13–14) |
| Pemilik | Rayhan |
| Target pelaksana | Claude Code (Opus 5.5 / Fable) |
| Status | Draft v1.0 |
| Bahasa antarmuka | Bahasa Indonesia (istilah teknis tetap bahasa Inggris) |

---

## 1. Ringkasan Eksekutif

HybridLab adalah **website presentasi interaktif** (bergaya slide deck, navigasi keyboard, animasi langkah-demi-langkah) yang menjelaskan, mensimulasikan, dan membandingkan dua algoritma hybrid untuk *task scheduling* di cloud:

1. **Hybrid HEFT-GA** — Aziza & Krichen (2020).
2. **Hybrid SFLA-GA** — Kayalvili & Selvam (2019).

Website berfungsi ganda: (a) media presentasi **Demo 1 (Minggu 13)** dan (b) fondasi untuk **Demo 2 (Minggu 14)**. Di dalamnya tertanam **simulator cloud berbasis browser** yang benar-benar menjalankan kedua algoritma pada dataset Minggu 3, sehingga hasil perbandingan **dihitung langsung, bukan hasil hardcode**. Hybrid yang lebih unggul secara data akan disorot sebagai algoritma yang dipresentasikan secara mendalam, lalu dibandingkan dengan 2 metode pilihan sebelumnya.

---

## 2. Latar Belakang & Ketentuan Tugas

### 2.1 Ketentuan dari dosen (acuan wajib)

| No | Ketentuan | Implikasi pada website |
|---|---|---|
| 1 | Pilih 2 algoritma hybrid dari **pola B–E** (minimal kombinasi heuristik + metaheuristik). Pola A (heuristik + heuristik) tidak memenuhi syarat. | Slide klasifikasi pola + justifikasi kenapa kedua hybrid memenuhi syarat. |
| 2 | Sumber wajib dari **paper/jurnal ilmiah**; referensi dicantumkan di slide. | Setiap slide algoritma punya footer sitasi; ada slide Daftar Pustaka. |
| 3 | **Tidak boleh sama untuk ketiga kelas.** | Slide "Orisinalitas pilihan" (opsional, 1 baris di slide pemilihan). |
| 4 | Implementasikan **keduanya** di simulator dan uji dengan **dataset Minggu 3**. | Simulator tertanam + loader dataset Minggu 3. |
| 5 | Presentasikan cara kerja **1 hybrid yang lebih unggul**. | Fitur *Winner Spotlight* berbasis hasil eksperimen. |
| 6 | **Bandingkan** hybrid unggul dengan **2 metode yang dipilih sebelumnya**. | Modul perbandingan 3 arah (hybrid unggul vs Metode Lama 1 vs Metode Lama 2). |

### 2.2 Jadwal

| Minggu | Demo | Cakupan |
|---|---|---|
| 13 | **Demo 1** | Cara kerja hybrid terpilih, simulasi, dan perbandingan dengan 2 metode sebelumnya. |
| 14 | **Demo 2** | Presentasi algoritma hybrid di *real world* (studi kasus / skenario dunia nyata). |

### 2.3 Algoritma terpilih

| # | Hybrid | Komposisi | Referensi |
|---|---|---|---|
| 1 | **Hybrid HEFT-GA** | Heuristik (HEFT) + Metaheuristik (GA) | Aziza, H., & Krichen, S. (2020). A hybrid genetic algorithm for scientific workflow scheduling in cloud environment. *Neural Computing and Applications, 32*(18), 15263–15278. https://doi.org/10.1007/s00521-020-04878-8 |
| 2 | **Hybrid SFLA-GA** | Metaheuristik (SFLA) + Metaheuristik (GA) | Kayalvili, S., & Selvam, M. (2019). Hybrid SFLA-GA algorithm for an optimal resource allocation in cloud. *Cluster Computing, 22*(Suppl 2), 3165–3173. https://doi.org/10.1007/s10586-018-2011-8 |

> **Catatan kepatuhan (verifikasi sebelum presentasi):** HEFT-GA jelas memenuhi "heuristik + metaheuristik". SFLA-GA adalah kombinasi dua metaheuristik; pastikan ia termasuk salah satu pola B–E pada slide dosen (bukan pola A) dan siapkan justifikasi 1 slide. Tandai `TODO-VERIFIKASI` di konten jika belum dicocokkan dengan definisi pola dosen.

### 2.4 Dua metode pembanding ("metode yang dipilih sebelumnya")

Dua metode pembanding dikonfigurasi lewat file `config/baselines.json`.

- **Default asumsi:** Shuffled Frog-Leaping Algorithm (SFLA) dan Water Cycle Algorithm (WCA) dari tugas presentasi sebelumnya.
- **Rayhan wajib mengonfirmasi** dua metode ini. Jika berbeda (misalnya Tugas 4 heuristik tunggal), cukup ganti isi config; kode simulator harus mendukung baseline yang dapat diganti (*pluggable*).

---

## 3. Tujuan, Non-Tujuan, dan Metrik Keberhasilan

### 3.1 Tujuan
1. Membuat presentasi yang **mudah dipahami audiens non-ahli** lewat visualisasi langkah demi langkah.
2. Menjalankan **simulasi nyata** kedua hybrid pada dataset Minggu 3 di dalam browser.
3. Menyajikan **perbandingan adil dan dapat direproduksi** (seed tetap, anggaran evaluasi sama).
4. Menentukan dan menyorot **hybrid unggul** secara berbasis data.
5. Siap dipakai untuk **Demo 1 dan Demo 2** tanpa membangun ulang.

### 3.2 Non-Tujuan
- Bukan pengganti CloudSim/simulator resmi kuliah (website memakai simulator sendiri yang meniru model sistem Tugas 3). Jika dosen mewajibkan hasil dari simulator tertentu, website hanya **menampilkan/mengimpor** hasil tersebut (lihat FR-27).
- Tidak ada backend, login, atau database. Semua berjalan di sisi klien.
- Tidak mendukung ponsel secara penuh (target utama laptop/proyektor; ponsel hanya *readable*).

### 3.3 Metrik keberhasilan

| Metrik | Target |
|---|---|
| Waktu muat awal (LCP) di laptop standar | < 2,5 detik |
| Durasi satu run simulasi (dataset Minggu 3, 1 algoritma) | < 5 detik; UI tidak freeze |
| Reproduksibilitas | Seed sama → hasil identik |
| Navigasi | 100% slide bisa dijangkau dengan keyboard |
| Kelengkapan syarat tugas | 6/6 ketentuan terpenuhi (lihat §15 checklist) |

---

## 4. Audiens & Skenario Penggunaan

| Persona | Kebutuhan | Skenario |
|---|---|---|
| **Presenter (Rayhan)** | Alur lancar, tidak crash, mudah kontrol saat tampil | Menekan Next/Spasi, menjalankan simulasi live, membuka mode presenter. |
| **Dosen / penilai** | Melihat kesesuaian ketentuan, sitasi, dan bukti implementasi | Memeriksa referensi, pseudocode, tabel hasil, perbandingan. |
| **Teman sekelas** | Memahami ide secara intuitif | Mengikuti animasi dan analogi. |
| **Pembaca mandiri** | Membuka link dan mempelajari sendiri | Mode *Explore* tanpa presenter. |

---

## 5. Struktur Konten (Alur Slide)

Total target **±22 slide** dalam 4 bagian. Setiap slide punya ID stabil agar bisa di-*deep link* (`/#/slide/12`).

### Bagian A — Pembuka & Konteks (Slide 1–5)
1. **Cover** — judul, nama, mata kuliah, minggu.
2. **Ketentuan tugas** — 6 ketentuan (gaya kartu bernomor) dan jadwal Demo 1 / Demo 2.
3. **Masalah**: Task scheduling di cloud — kenapa NP-hard, ilustrasi task → VM.
4. **Taksonomi**: heuristik vs metaheuristik vs hybrid; pola A–E; posisi kedua pilihan.
5. **Peta pilihan**: 2 hybrid terpilih + 2 metode pembanding + referensi singkat.

### Bagian B — Hybrid HEFT-GA (Slide 6–10)
6. Gambaran besar: apa yang di-hybrid-kan dan alasan (HEFT cepat tapi lokal-greedy; GA eksploratif tapi lambat konvergen).
7. **HEFT interaktif**: DAG → upward rank → urutan prioritas → pemilihan VM dengan EFT (stepper).
8. **GA interaktif**: encoding kromosom, seleksi, crossover, mutasi (stepper dengan populasi kecil).
9. **Integrasi HEFT→GA**: bagaimana solusi HEFT menyemai populasi awal / operator (sesuai paper).
10. Pseudocode + diagram alur + parameter + sitasi.

### Bagian C — Hybrid SFLA-GA (Slide 11–15)
11. Gambaran besar dan alasan hybrid.
12. **SFLA interaktif**: populasi katak → urutkan → bagi ke memeplex → lompatan katak terburuk menuju terbaik (analogi daun teratai).
13. **GA di dalam SFLA**: peran crossover/mutasi pada memeplex (sesuai paper).
14. Shuffle & iterasi: animasi memeplex dicampur ulang.
15. Pseudocode + diagram alur + parameter + sitasi.

### Bagian D — Eksperimen, Pemenang, dan Dunia Nyata (Slide 16–22)
16. **Setup eksperimen**: dataset Minggu 3, arsitektur datacenter/host/VM, fungsi objektif, metrik, parameter.
17. **Simulator live**: jalankan HEFT-GA dan SFLA-GA berdampingan (Gantt chart + kurva konvergensi).
18. **Hasil & uji statistik**: tabel mean ± std dari N run, boxplot.
19. **🏆 Winner Spotlight**: hybrid unggul (dihitung otomatis) + alasan.
20. **Deep dive pemenang**: walkthrough satu run penuh (langkah → jadwal akhir).
21. **Perbandingan 3 arah (Demo 1 inti)**: hybrid unggul vs Metode Lama 1 vs Metode Lama 2 (radar + bar + tabel).
22. **Kesimpulan & Daftar Pustaka**.

### Bagian E (Demo 2, Minggu 14) — *Phase 2*
23. Skenario dunia nyata: studi kasus (misal pipeline workflow ilmiah/pemrosesan data) dengan parameter harga/kapasitas nyata (mis. spesifikasi instance publik).
24. Dashboard *what-if*: slider jumlah VM, beban kerja, bobot objektif → hasil diperbarui.
25. Insight dan rekomendasi penerapan.

> Slide 23–25 dibangun setelah Demo 1 selesai. Arsitektur wajib memudahkan penambahan slide (lihat §12).

---

## 6. Kebutuhan Fungsional (FR)

### 6.1 Navigasi & Presentasi
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Navigasi slide dengan tombol **Prev/Next**, tombol keyboard **← →**, dan **Spasi** (maju). | P0 |
| FR-02 | **Progress bar** dan penunjuk nomor slide (contoh `18 / 22`). | P0 |
| FR-03 | **Deep link** per slide lewat hash URL; refresh tidak kehilangan posisi. | P0 |
| FR-04 | **Fragment/step** di dalam slide (elemen muncul bertahap) dikendalikan tombol yang sama. | P0 |
| FR-05 | **Menu daftar isi** (tombol `G` / `Esc`) untuk lompat ke slide. | P1 |
| FR-06 | **Mode layar penuh** (`F`). | P1 |
| FR-07 | **Mode presenter** (`P`): catatan pembicara, timer, pratinjau slide berikutnya (jendela/panel terpisah). | P2 |
| FR-08 | **Mode Explore** (non-presenter) dengan scroll vertikal untuk pembaca mandiri. | P2 |

### 6.2 Konten Edukasi Interaktif
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-10 | Setiap algoritma punya **stepper** (Prev step/Next step/Auto-play/Reset) dengan kecepatan dapat diatur. | P0 |
| FR-11 | **Visualisasi DAG** task (node = task, edge = dependensi) dengan highlight node aktif. | P0 |
| FR-12 | **Visualisasi populasi GA** (kromosom sebagai baris warna; tampilan crossover/mutasi). | P0 |
| FR-13 | **Visualisasi SFLA**: katak pada "kolam" 2D (proyeksi fitness), pewarnaan per memeplex, animasi lompatan. | P0 |
| FR-14 | **Gantt chart** jadwal task per VM (hover: detail task, waktu mulai/selesai). | P0 |
| FR-15 | **Kurva konvergensi** fitness vs iterasi/evaluasi untuk tiap algoritma. | P0 |
| FR-16 | Panel **"Apa yang terjadi sekarang?"** — narasi teks sinkron dengan langkah. | P1 |
| FR-17 | Footer **sitasi** otomatis dari `references.json` di tiap slide terkait. | P0 |
| FR-18 | **Pseudocode viewer** dengan highlight baris yang sedang dieksekusi. | P1 |

### 6.3 Simulator & Eksperimen
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-20 | Simulator cloud tertanam dengan model sistem sesuai §8. | P0 |
| FR-21 | Implementasi algoritma: **HEFT, GA, HEFT-GA, SFLA, SFLA-GA**, serta dua baseline (§2.4). | P0 |
| FR-22 | **Loader dataset Minggu 3** (JSON/CSV) via file upload dan file bawaan di `public/data/`. | P0 |
| FR-23 | **Generator dataset sintetis** sebagai cadangan jika dataset belum tersedia (workflow DAG dan/atau task independen). | P1 |
| FR-24 | Panel **parameter** (populasi, generasi, pc, pm, jumlah memeplex, dll.) dengan nilai default sesuai paper. | P0 |
| FR-25 | **Multi-run** N kali (default 30) dengan seed berbeda terkontrol; ringkasan mean, std, min, max. | P0 |
| FR-26 | Simulasi berjalan di **Web Worker**; ada progress bar dan tombol Batal. | P0 |
| FR-27 | **Impor hasil eksternal** (CSV/JSON dari simulator kuliah, mis. CloudSim) untuk ditampilkan berdampingan dengan hasil simulator web. | P1 |
| FR-28 | **Ekspor hasil** (CSV, JSON, PNG grafik) untuk laporan. | P1 |
| FR-29 | **Cache hasil** (localStorage) agar demo tidak perlu menghitung ulang; tombol "Hitung ulang". | P1 |

### 6.4 Perbandingan & Pemenang
| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-30 | Tabel perbandingan seluruh metrik untuk 4 algoritma + (bila relevan) 2 baseline. | P0 |
| FR-31 | **Skor komposit** dan penentuan **Winner** otomatis (aturan §10). | P0 |
| FR-32 | **Winner Spotlight**: slide pemenang otomatis menyesuaikan nama dan konten pemenang. | P0 |
| FR-33 | Grafik: bar per metrik, radar komposit, boxplot sebaran N run. | P0 |
| FR-34 | Uji signifikansi sederhana (Wilcoxon rank-sum atau t-test) antar pasangan. | P2 |
| FR-35 | Pengguna dapat **menimpa pemenang** secara manual (flag) jika dosen/hasil eksternal berbeda, dengan label jelas. | P2 |

---

## 7. Spesifikasi Algoritma

> **Aturan emas:** detail operator dan parameter harus **mengikuti paper**. Bagian bertanda `TODO-VERIFIKASI` wajib dicocokkan dengan paper (buka DOI di §2.3) sebelum finalisasi. Jangan mengarang parameter yang tidak ada di paper; jika paper tidak menyebut, gunakan nilai default umum dan **beri label "asumsi"** di UI.

### 7.1 Model masalah umum
- Himpunan task `T = {t1..tn}`, himpunan VM `V = {v1..vm}`.
- Opsional: dependensi `DAG G(T, E)` dengan biaya transfer data `c(i,j)`.
- `ET[i][k]` = waktu eksekusi task i di VM k = `length_i / mips_k`.
- Solusi = pemetaan `task → VM` (+ urutan eksekusi jika ada dependensi).
- **Dataset independen (tanpa DAG):** HEFT dijalankan dalam bentuk generalisasinya (urut berdasarkan rata-rata ET menurun, pilih VM dengan EFT minimum). Tampilkan catatan ini di UI.

### 7.2 HEFT (komponen heuristik)
```text
1. Hitung rata-rata biaya komputasi tiap task dan rata-rata biaya komunikasi tiap edge.
2. Hitung upward rank (rank_u) dari task keluar ke task masuk (rekursif).
3. Urutkan task berdasarkan rank_u menurun.
4. Untuk setiap task dalam urutan:
     hitung Earliest Finish Time (EFT) di setiap VM (dengan insertion-based policy);
     tetapkan task ke VM dengan EFT minimum.
5. Kembalikan jadwal dan makespan.
```

### 7.3 GA (komponen metaheuristik)
```text
1. Inisialisasi populasi (ukuran P) — acak (dan/atau seeded sesuai paper).
2. Evaluasi fitness tiap kromosom.
3. Ulangi sampai kriteria berhenti (generasi maks / anggaran evaluasi):
     a. Seleksi (turnamen/roulette — sesuai paper)
     b. Crossover (probabilitas pc)
     c. Mutasi (probabilitas pm)
     d. Elitisme: pertahankan individu terbaik
4. Kembalikan kromosom terbaik.
```
- Encoding: vektor panjang n; gen ke-i = indeks VM untuk task i (`TODO-VERIFIKASI` apakah paper memakai encoding lain, mis. permutasi + pemetaan).

### 7.4 Hybrid HEFT-GA (Aziza & Krichen, 2020)
- Ide inti (disesuaikan dengan paper — `TODO-VERIFIKASI`): memanfaatkan solusi/urutan prioritas dari **HEFT** untuk membentuk solusi awal berkualitas dalam populasi **GA**, lalu GA memperbaiki lewat crossover/mutasi sehingga menghindari jebakan greedy HEFT.
- Parameter default: ikuti Tabel parameter di paper; tampilkan sumbernya.
- Output: jadwal terbaik + kurva konvergensi (fitness generasi-0 sudah lebih baik dari GA acak — tunjukkan sebagai insight).

### 7.5 SFLA (komponen metaheuristik 1)
```text
1. Bangkitkan F katak (solusi) acak.
2. Urutkan berdasarkan fitness menurun (terbaik → terburuk).
3. Bagi ke m memeplex (katak ke-i masuk memeplex ((i-1) mod m)+1).
4. Untuk tiap memeplex, lakukan evolusi lokal sebanyak N_iter:
     a. Pilih submemeplex (seleksi berbobot segitiga)
     b. Lompatkan katak terburuk ke arah katak terbaik memeplex
        (jika tidak membaik → ke arah katak terbaik global;
         jika tetap tidak membaik → bangkitkan katak acak)
5. Shuffle: gabungkan semua memeplex dan ulangi dari langkah 2.
6. Berhenti pada kriteria berhenti.
```
Pada ruang diskrit (task→VM), operator lompatan diadaptasi (mis. penyalinan sebagian gen dari katak terbaik) — **ikuti adaptasi dari paper** (`TODO-VERIFIKASI`).

### 7.6 Hybrid SFLA-GA (Kayalvili & Selvam, 2019)
- Ide inti (`TODO-VERIFIKASI`): menggabungkan struktur memeplex SFLA dengan operator GA (crossover/mutasi) agar pencarian lokal dalam memeplex lebih beragam, lalu shuffle global.
- Tampilkan di UI **di titik mana GA bergabung** dalam siklus SFLA.

### 7.7 Baseline (2 metode sebelumnya)
Diimplementasikan pada antarmuka yang sama (§12.3). Default asumsi: SFLA dan WCA murni.

---

## 8. Spesifikasi Simulator (Model Sistem)

> Seluruh nilai di bawah adalah **placeholder** — **timpa dengan desain arsitektur dan dataset dari Tugas 3 / Minggu 3** lewat `config/system.json` dan `public/data/`.

### 8.1 Arsitektur cloud
| Entitas | Atribut | Placeholder |
|---|---|---|
| Datacenter | jumlah, lokasi (opsional), harga | `TODO` dari Tugas 3 |
| Host | CPU core, MIPS/core, RAM, BW | `TODO` |
| VM | MIPS, RAM, BW, **harga/jam** | `TODO` (mis. 3–5 tipe VM heterogen) |
| Task/Cloudlet | length (MI), file size, output size, (opsional) deadline, (opsional) dependensi | dari dataset Minggu 3 |

### 8.2 Fungsi objektif (minimal 2, sesuai Tugas 3)
Default (ganti sesuai Tugas 3):
1. **Makespan** = `max_k(finish_time_k)` — diminimalkan.
2. **Biaya total** = `Σ (waktu_pakai_VM_k × harga_k)` — diminimalkan.
3. (Opsional) **Load balancing** (degree of imbalance) atau **energi**.

**Fitness (weighted sum ternormalisasi):**
```text
fitness = w1 · (Makespan / Makespan_ref) + w2 · (Cost / Cost_ref) [+ w3 · ...]
```
Default `w1 = w2 = 0.5`; `*_ref` = nilai referensi (mis. solusi round-robin). Bobot dapat diubah pengguna.

### 8.3 Metrik laporan
Makespan, biaya, utilisasi VM rata-rata, degree of imbalance, throughput, waktu komputasi algoritma (ms), jumlah evaluasi fitness hingga konvergen, (bila ada) pelanggaran deadline/batasan.

### 8.4 Batasan cloud
Mis. kapasitas RAM VM, deadline, anggaran maksimum. Pelanggaran dikenai **penalti** pada fitness atau solusi dibuang (jelaskan di UI).

### 8.5 Format dataset (kontrak data)
```json
{
  "meta": { "name": "Dataset Minggu 3", "source": "..." },
  "tasks": [
    { "id": 0, "length": 12000, "fileSize": 300, "outputSize": 300, "deps": [] },
    { "id": 1, "length": 8000,  "fileSize": 300, "outputSize": 300, "deps": [0] }
  ],
  "vms": [
    { "id": 0, "mips": 1000, "ram": 2048, "bw": 1000, "pricePerHour": 0.05 }
  ]
}
```
Parser harus menerima juga **CSV** (kolom: `id,length,fileSize,outputSize,deps`) dan melaporkan error baris yang jelas.

---

## 9. Desain Eksperimen & Keadilan Perbandingan

- **Seed terkontrol:** PRNG ber-seed (mis. mulberry32/xoshiro). Run ke-r memakai `seed = base + r`.
- **Anggaran sama:** semua metaheuristik diberi **jumlah evaluasi fitness maksimum yang sama** (default 10.000; dapat diubah). Heuristik murni (HEFT) dicatat sebagai garis referensi.
- **Pengulangan:** N = 30 run per algoritma (HEFT deterministik → 1 run).
- **Dataset sama** untuk semua algoritma.
- **Pelaporan:** mean, std, min, max, median; boxplot; uji signifikansi (P2).
- **Skenario skala (opsional P1):** 3 ukuran beban (kecil/sedang/besar) untuk melihat skalabilitas.

---

## 10. Aturan Penentuan Hybrid Unggul

1. Normalisasi tiap metrik ke [0,1] (min-max antar algoritma yang dibandingkan; makin kecil makin baik untuk makespan/biaya/imbalance, makin besar makin baik untuk utilisasi/throughput).
2. **Skor komposit** = Σ(bobot_metrik × skor_ternormalisasi), bobot default: makespan 0,35; biaya 0,25; utilisasi 0,15; imbalance 0,15; waktu komputasi 0,10 (dapat diubah, tampilkan di UI).
3. **Pemenang** = skor komposit rata-rata tertinggi. Jika selisih < 2%, tampilkan label **"Hampir imbang"** dan gunakan tie-breaker: makespan.
4. Slide **Winner Spotlight** menampilkan: nama, skor, keunggulan tiap metrik (%), dan satu kalimat alasan yang dibangkitkan dari data.
5. Hasil **tidak boleh hardcode**; jika data berubah, pemenang ikut berubah.

---

## 11. Desain UX/UI

### 11.1 Arah visual (mengacu gaya slide dosen)
- **Neo-brutalist yang bersih**: kartu putih ber-outline hitam tebal, sudut membulat, bayangan tegas.
- **Aksen kuning** (`#FFD84D`) sebagai penyorot kata kunci (efek *highlighter* di belakang kata penting).
- **Tipografi:** judul sans tebal rapat (contoh: Inter Tight / Plus Jakarta Sans ExtraBold); label kecil monospace uppercase (contoh: JetBrains Mono) seperti "KETENTUAN", "MINGGU 13".
- **Pola layout:** badge nomor kuning di kiri atas + label mono, judul besar dengan kata kunci tersorot, kartu konten utama, kartu samping untuk info/jadwal, **kalimat ringkas (takeaway)** di bagian bawah tiap slide, **bilah navigasi bawah** (Prev | judul slide | progress | hint keyboard | Next).
- **Palet warna algoritma:** HEFT-GA (biru), SFLA-GA (hijau/teratai), Baseline 1 (oranye), Baseline 2 (ungu). Konsisten di semua grafik; jangan hanya mengandalkan warna (tambahkan pola/label).

### 11.2 Prinsip interaksi
- Maksimal **1 ide per slide**; teks ≤ 40 kata di luar kartu ketentuan.
- Animasi bermakna (menunjukkan perubahan data), durasi 200–500 ms, hormati `prefers-reduced-motion`.
- Setiap visual punya judul, legenda, dan keterangan satuan.
- Mode gelap opsional (P2); default terang untuk proyektor.

### 11.3 Aksesibilitas
Kontras WCAG AA, fokus keyboard terlihat, `aria-label` pada kontrol, ukuran font minimum 18 px pada mode presentasi.

---

## 12. Arsitektur Teknis

### 12.1 Tumpukan teknologi (rekomendasi)
| Lapisan | Pilihan |
|---|---|
| Framework | **Vite + React + TypeScript** |
| Styling | Tailwind CSS (token desain di `tailwind.config`) |
| Animasi | Framer Motion |
| Visualisasi | D3 (DAG, kolam SFLA) + Recharts/Visx (bar, line, radar, boxplot) |
| Komputasi | **Web Worker** (Comlink opsional), TypeScript murni |
| State | Zustand |
| Pengujian | Vitest (unit algoritma) + Playwright (smoke test navigasi) |
| Deploy | Vercel / GitHub Pages / Netlify (statis) |

### 12.2 Struktur folder
```text
hybridlab/
├─ public/data/                 # dataset Minggu 3 (json/csv)
├─ src/
│  ├─ app/                      # shell deck: router slide, nav bar, shortcut
│  ├─ slides/                   # satu file per slide (A01.tsx, B07.tsx, ...)
│  ├─ components/               # Card, Highlight, Stepper, Gantt, DagView, ...
│  ├─ viz/                      # visual D3/Recharts
│  ├─ sim/
│  │  ├─ model.ts               # Task, VM, Schedule, evaluate()
│  │  ├─ rng.ts                 # PRNG ber-seed
│  │  ├─ algorithms/
│  │  │   ├─ heft.ts  ga.ts  heftGa.ts  sfla.ts  sflaGa.ts
│  │  │   └─ baselines/         # metode pembanding pluggable
│  │  ├─ runner.worker.ts       # eksekusi multi-run di worker
│  │  └─ stats.ts               # mean/std/Wilcoxon/skor komposit
│  ├─ data/                     # references.json, narasi, parser dataset
│  ├─ store/                    # state global (hasil, parameter, slide aktif)
│  └─ styles/
├─ config/                      # system.json, baselines.json, weights.json
├─ tests/
└─ README.md
```

### 12.3 Antarmuka algoritma (kontrak)
```ts
interface Solver {
  id: string; name: string; family: 'heuristic' | 'metaheuristic' | 'hybrid';
  run(problem: Problem, params: Params, rng: RNG,
      onStep?: (s: StepEvent) => void): Result;
}
interface Result {
  schedule: Assignment[];           // task -> vm, start, finish
  metrics: { makespan: number; cost: number; utilization: number;
             imbalance: number; computeMs: number; evals: number };
  history: { eval: number; best: number }[];   // untuk kurva konvergensi
  steps?: StepEvent[];              // rekaman langkah untuk stepper edukasi
}
```
`onStep` merekam snapshot ringan (bukan seluruh populasi tiap iterasi) agar memori terkendali; stepper edukasi memakai **instance kecil** (mis. 6–8 task, 3 VM) yang terpisah dari run eksperimen penuh.

### 12.4 Data referensi
`references.json` berisi entri (id, sitasi APA, DOI, slide terkait) yang dirender otomatis oleh komponen `<Citation id="aziza2020" />`.

---

## 13. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| Performa | Worker non-blokir; hasil di-cache; UI ≥ 50 fps saat animasi. |
| Reliabilitas | Mode **offline-capable** setelah dimuat (PWA ringan/P2) agar aman saat demo tanpa internet; hasil run terakhir tersimpan. |
| Kompatibilitas | Chrome/Edge/Firefox terbaru; resolusi 1366×768 hingga 1920×1080; proyektor 16:9. |
| Keamanan/privasi | Tanpa pengiriman data ke server; tanpa analitik pihak ketiga. |
| Kualitas kode | TypeScript strict, ESLint, Prettier; unit test untuk fungsi `evaluate()` dan tiap algoritma (sifat: solusi valid, determinisme dengan seed). |
| Dokumentasi | README berisi cara menjalankan, struktur, cara mengganti dataset/baseline. |

---

## 14. Rencana Implementasi (Fase untuk Claude Code)

| Fase | Deliverable | Kriteria selesai |
|---|---|---|
| **0. Setup** | Proyek Vite+React+TS, Tailwind, token desain, shell deck (nav, progress, shortcut, deep link) | FR-01–FR-03 lolos; 3 slide dummy berjalan. |
| **1. Model & simulator inti** | `model.ts`, `rng.ts`, `evaluate()`, loader dataset, generator sintetis, unit test | Test lulus; makespan/biaya terverifikasi manual pada kasus kecil. |
| **2. Algoritma** | HEFT, GA, SFLA, HEFT-GA, SFLA-GA, 2 baseline; worker + multi-run | Semua `Solver` lolos kontrak; hasil deterministik per seed. |
| **3. Visual edukasi** | DagView, populasi GA, kolam SFLA, Gantt, kurva konvergensi, stepper | Slide B & C interaktif dan sinkron dengan narasi. |
| **4. Konten & slide** | Slide A–D, sitasi, pseudocode viewer | Semua slide ada; referensi tampil. |
| **5. Eksperimen & pemenang** | Panel parameter, hasil N-run, tabel, grafik, Winner Spotlight, perbandingan 3 arah | §10 terimplementasi; slide 17–21 hidup dengan data nyata. |
| **6. Polish & demo-ready** | Mode presenter, ekspor, cache, a11y, performa, README, deploy | Checklist §15 hijau; latihan demo 10 menit tanpa error. |
| **7. Demo 2 (Minggu 14)** | Slide 23–25: studi kasus dunia nyata + dashboard what-if | Skenario nyata berjalan di simulator yang sama. |

> **Instruksi eksekusi untuk Claude Code:** kerjakan fase berurutan, commit per fase, jalankan test sebelum lanjut, dan **jangan hardcode hasil perbandingan**. Tandai semua `TODO-VERIFIKASI` dalam daftar di README agar bisa dicek terhadap paper.

---

## 15. Kriteria Penerimaan (Checklist)

**Kepatuhan tugas**
- [ ] 2 hybrid dari pola B–E dengan justifikasi (HEFT-GA, SFLA-GA).
- [ ] Referensi paper tampil di slide dan Daftar Pustaka (APA + DOI).
- [ ] Pilihan algoritma tidak sama dengan pilihan kelas lain (dikonfirmasi manual).
- [ ] Kedua hybrid terimplementasi di simulator dan diuji dengan dataset Minggu 3.
- [ ] Satu hybrid unggul dipresentasikan cara kerjanya secara mendalam.
- [ ] Perbandingan hybrid unggul vs 2 metode sebelumnya tersedia (tabel + grafik).

**Kualitas produk**
- [ ] Navigasi Prev/Next, ← →, Spasi, progress bar berfungsi.
- [ ] Simulasi < 5 detik per algoritma, UI tidak freeze, ada tombol Batal.
- [ ] Seed sama menghasilkan hasil sama.
- [ ] Winner berubah mengikuti data (diuji dengan dataset berbeda).
- [ ] Tidak ada error konsol selama alur demo penuh.
- [ ] Hasil terakhir tersimpan sehingga demo aman tanpa menghitung ulang.

---

## 16. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Detail operator di paper berbeda dari implementasi | Kritik dosen: tidak setia paper | Tandai `TODO-VERIFIKASI`, cocokkan paper, beri label "asumsi" di UI. |
| Dataset Minggu 3 belum/berbeda format | Simulasi tertunda | Loader fleksibel JSON/CSV + generator sintetis. |
| Dosen mewajibkan simulator tertentu (mis. CloudSim) | Hasil web dianggap tidak sah | FR-27: impor hasil simulator resmi; web sebagai media visual. |
| SFLA-GA ternyata bukan heuristik+meta (pola) | Tidak memenuhi syarat 1 | Siapkan justifikasi pola atau opsi pengganti hybrid. |
| Simulasi lambat di laptop presentasi | Demo tersendat | Worker, cache hasil, preset "demo cepat" (populasi/generasi lebih kecil). |
| Koneksi internet buruk saat demo | Gagal memuat | Deploy statis + PWA/offline + salinan build lokal. |
| Hasil acak membuat pemenang tidak stabil | Pemenang berubah antar-demo | Seed tetap, N run, aturan tie-breaker, simpan hasil. |

---

## 17. Pertanyaan Terbuka (Isi sebelum/selama pengerjaan)

1. **Dua metode pembanding** apa? (default: SFLA & WCA).
2. **Dataset Minggu 3**: format dan lokasi file? Apakah task punya dependensi (DAG)?
3. **Desain arsitektur Tugas 3**: jumlah datacenter/host/VM, spesifikasi, dan **fungsi objektif** yang dipakai?
4. Apakah dosen **mewajibkan simulator tertentu**?
5. **Pola B–E** yang mana tepat untuk tiap hybrid (sesuai slide dosen)?
6. Skenario **dunia nyata** untuk Demo 2 (studi kasus apa)?
7. Durasi presentasi dan jumlah penampil (menentukan jumlah slide dan mode presenter).

---

## 18. Daftar Pustaka

1. Aziza, H., & Krichen, S. (2020). A hybrid genetic algorithm for scientific workflow scheduling in cloud environment. *Neural Computing and Applications, 32*(18), 15263–15278. https://doi.org/10.1007/s00521-020-04878-8
2. Kayalvili, S., & Selvam, M. (2019). Hybrid SFLA-GA algorithm for an optimal resource allocation in cloud. *Cluster Computing, 22*(Suppl 2), 3165–3173. https://doi.org/10.1007/s10586-018-2011-8
3. *(Tambahkan referensi HEFT asli, SFLA asli, dan paper metode pembanding setelah dikonfirmasi.)*

---

## Lampiran A — Pemetaan Cepat Ketentuan ↔ Fitur

| Ketentuan | FR terkait | Slide |
|---|---|---|
| 1. Hybrid pola B–E | FR-17 | 4, 5 |
| 2. Sumber paper + referensi di slide | FR-17 | 6–15, 22 |
| 3. Tidak sama antarkelas | — | 5 |
| 4. Implementasi + dataset Minggu 3 | FR-20–FR-26 | 16–18 |
| 5. Presentasi 1 hybrid unggul | FR-31–FR-32 | 19–20 |
| 6. Bandingkan dengan 2 metode sebelumnya | FR-30, FR-33 | 21 |
