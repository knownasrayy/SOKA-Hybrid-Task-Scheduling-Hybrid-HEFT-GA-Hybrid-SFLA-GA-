# PRD — Lapisan 3D untuk HybridLab: Simulasi Presentasi Hybrid HEFT-GA vs SFLA-GA

| Item | Isi |
|---|---|
| Nama proyek | **HybridLab 3D** (ekstensi dari PRD HybridLab) |
| Dokumen induk | `PRD_Presentasi_Web_Hybrid_HEFT-GA_vs_SFLA-GA.md` (alur slide, simulator, algoritma, aturan pemenang) |
| Mata kuliah | Strategi Optimasi Komputasi Awan (Demo 1 minggu 13, Demo 2 minggu 14) |
| Pemilik | Kelompok 6 (Rayhan Agnan Kusuma, Ahmad Idza Anafin, Andi Naufal Zaki, Alnico Virendra Kitaro Diaz, Zidny Ilman Nafian) |
| Target pelaksana | Claude Code (Opus 5.5 / Fable) |
| Status | Draft v1.0 |

> **Cara membaca dokumen ini:** PRD induk tetap berlaku untuk isi akademik (algoritma, dataset, metrik, pemenang). Dokumen ini **hanya mengatur pengalaman 3D**: dunia visual, kamera, animasi, interaksi, performa, dan cara menghubungkannya dengan simulator yang sudah dirancang. Jika ada konflik, **kebenaran data dan kepatuhan tugas mengikuti PRD induk**; kebutuhan visual/interaksi mengikuti dokumen ini.

---

## 1. Ringkasan Eksekutif

Presentasi tidak lagi berupa kumpulan slide datar, melainkan **satu dunia 3D yang dijelajahi kamera**. Setiap "slide" adalah **titik kamera (waypoint)** di dalam dunia yang sama: sebuah **datacenter 3D** tempat task berjalan menuju VM, populasi GA tampil sebagai untaian kromosom, dan katak SFLA melompat di atas kolam daun teratai.

Prinsip utama: **3D harus menjelaskan, bukan menghias.** Setiap objek 3D mewakili entitas nyata dari simulator (task, VM, host, kromosom, katak, memeplex), dan setiap animasi dipicu oleh **event nyata dari algoritma** (`StepEvent`), bukan animasi palsu yang diputar ulang.

---

## 2. Tujuan, Non-Tujuan, Metrik

### 2.1 Tujuan
1. Memberi audiens **intuisi spasial**: bagaimana task dipetakan ke VM, bagaimana solusi "bergerak" di ruang pencarian.
2. Menjadikan **simulasi cloud tampak hidup**: task mengalir, VM terisi, makespan terlihat sebagai panjang batang waktu.
3. Mempertahankan **kejelasan akademik**: semua data tetap terbaca (angka, legenda, sitasi), tidak tertutup efek visual.
4. Tetap **aman untuk demo**: ada fallback 2D, mode performa, dan hasil ter-cache.
5. Mendukung **Demo 1 dan Demo 2** dengan dunia 3D yang sama (Demo 2 menambah skenario dunia nyata).

### 2.2 Non-Tujuan
- Bukan game, tidak ada karakter, fisika kompleks, atau model 3D hasil unduhan berlisensi.
- Bukan realisme foto. Gaya visual **minimalis dan informatif**.
- Tidak ada multiplayer, backend, atau VR/AR (VR hanya catatan masa depan).

### 2.3 Metrik keberhasilan

| Metrik | Target |
|---|---|
| Frame rate di laptop standar (iGPU) saat animasi penuh | ≥ 45 fps (target 60) |
| Frame rate di mode "Performa" | ≥ 60 fps |
| Ukuran bundel awal (tanpa aset eksternal) | < 1,5 MB gzip untuk shell, aset 3D dimuat malas |
| Waktu sampai dunia 3D interaktif | < 4 detik |
| Transisi antar-waypoint | 0,8–1,6 detik, tanpa patah |
| Keterbacaan | Semua angka kunci terbaca dari jarak proyektor (font HUD ≥ 20 px) |
| Cakupan | 100% slide di PRD induk punya padanan scene/waypoint 3D atau overlay 2D |

---

## 3. Arah Visual & Bahasa Desain

### 3.1 Prinsip: "Data-dense, restrained"
Gaya mengikuti preferensi rasio data-ink tinggi (ala terminal data / Tufte): **bentuk sederhana, garis tipis, warna hemat, informasi padat**.

- **Geometri primitif saja** (kotak, silinder, bola, garis, bidang). Tanpa model berpoligon tinggi.
- **Shading datar / toon ringan** dengan 1 sumber cahaya utama + ambient. Tanpa bloom berlebihan, tanpa partikel dekoratif.
- **Garis tepi tipis** (edges/outline) pada objek penting untuk kesan teknis.
- **Latar netral** (abu sangat terang atau hitam pekat sebagai mode alternatif) dengan **grid lantai halus** sebagai acuan skala.
- **Tipografi 3D minimal**: label berupa teks 2D yang menempel (billboard) berfont mono untuk angka dan sans untuk judul. Tidak ada teks 3D ekstrusi.
- **Warna bermakna** (sama dengan PRD induk): HEFT-GA biru, SFLA-GA hijau, Baseline 1 oranye, Baseline 2 ungu. Kuning (`#FFD84D`) hanya untuk **sorotan/sedang aktif**. Status: abu = idle, kuning = aktif, hijau = selesai, merah = pelanggaran/penalti.
- Tetap sisipkan **elemen identitas deck dosen** pada overlay 2D (badge nomor kuning, label mono kecil, kartu outline tebal) agar konsisten dengan PRD induk.

### 3.2 Hierarki visual
1. Objek yang sedang dijelaskan: warna penuh, outline tebal, sedikit membesar.
2. Konteks: warna pudar (opasitas 25–40%).
3. Latar: nyaris tak terlihat.

---

## 4. Dunia 3D: Entitas & Pemetaan ke Simulator

### 4.1 Pemetaan objek (kontrak visual)

| Entitas simulator | Representasi 3D | Atribut visual → data |
|---|---|---|
| **Datacenter** | Platform/lantai persegi panjang berlabel | Ukuran = jumlah host |
| **Host** | Rak (kotak tinggi) di atas platform | Tinggi = kapasitas CPU |
| **VM** | Slot/blok di dalam rak; **lajur waktu** memanjang ke arah sumbu +Z | Lebar = MIPS; warna tipe VM; panjang lajur = skala waktu |
| **Task** | Kubus kecil | Ukuran = `length` (MI); warna = status; label ID |
| **Dependensi (DAG)** | Garis/panah tipis antar-kubus (melayang di "ruang rencana") | Tebal = biaya transfer |
| **Penugasan task→VM** | Kubus meluncur dari antrean ke lajur VM, berhenti pada posisi waktu mulai | Panjang blok di lajur = durasi eksekusi |
| **Makespan** | **Bidang vertikal tipis** (garis finis) di ujung blok terpanjang + angka | Posisi = nilai makespan |
| **Biaya** | Kolom/tabung di samping tiap VM yang terisi seiring waktu | Tinggi = biaya terakumulasi |
| **Kromosom GA** | **Untaian** deretan kubus kecil (1 kubus = 1 gen), warna = VM yang dipilih | Panjang = n task |
| **Populasi GA** | Tumpukan untaian (baris-baris), terurut fitness | Opasitas/outline = fitness |
| **Katak SFLA** | Bola kecil di atas **daun teratai** (cakram datar) di kolam | Posisi = proyeksi 2D solusi; tinggi = fitness; warna = memeplex |
| **Memeplex SFLA** | Kelompok daun dengan **cincin pembatas** berwarna | Jumlah = m |
| **Kurva konvergensi** | Garis 3D yang tumbuh sepanjang sumbu waktu/evaluasi di "panggung hasil" | Sumbu Y = fitness |
| **Hasil N-run** | Batang/boxplot 3D di panggung perbandingan | Tinggi = metrik terpilih |

### 4.2 Skala dan koordinat
- Satuan dunia: 1 unit = 1 satuan visual netral; konversi data→unit lewat modul `scales.ts` (tidak ada angka ajaib di komponen).
- Sumbu: **X** = VM/host (lebar), **Z** = waktu (kedalaman), **Y** = tinggi/fitness/biaya.
- Instance edukasi kecil (6–8 task, 3 VM) memakai skala besar agar terbaca; instance eksperimen penuh (ratusan task) memakai **InstancedMesh** dan tampilan agregat.

---

## 5. Peta Scene dan Waypoint (Mengikuti 22 Slide PRD Induk)

Satu **Canvas** persisten; "scene" adalah kelompok objek yang ditampilkan/disembunyikan, dan "waypoint" adalah pose kamera + status animasi. Panel overlay 2D (kartu teks, sitasi, pseudocode) tetap berada di atas Canvas.

| Slide induk | Scene 3D | Waypoint & isi |
|---|---|---|
| 1 Cover | **Hub** | Datacenter di kejauhan, kamera melayang pelan (orbit lambat); judul sebagai overlay. |
| 2 Ketentuan | Hub (blur ringan) | Kamera mundur; overlay kartu ketentuan. 3D tetap hidup di belakang (opsional dimatikan di mode performa). |
| 3 Masalah scheduling | **Datacenter** | Kamera masuk ke datacenter; antrean task di kiri, VM di kanan; tampilkan "kombinasi penugasan meledak" (jumlah kemungkinan sebagai angka). |
| 4 Taksonomi | **Peta Pola** | Tiga kolom 3D (heuristik / metaheuristik / hybrid) dengan 2 pilihan menempati posisi pola; kamera menyorot. |
| 5 Peta pilihan | Peta Pola | Empat "monolit" (2 hybrid + 2 pembanding) berwarna sesuai palet. |
| 6 HEFT-GA gambaran | **Persimpangan** | Dua jalur (HEFT dan GA) bertemu menjadi satu; animasi penggabungan. |
| 7 HEFT | **Ruang DAG** + Datacenter | Node DAG melayang; hitung `rank_u` (angka naik pada node dari keluar ke masuk); urutan prioritas; kubus turun ke VM dengan EFT minimum (garis kandidat EFT muncul ke tiap VM, yang terpilih berkedip kuning). |
| 8 GA | **Lab Kromosom** | Untaian populasi; seleksi (untaian terpilih naik), crossover (dua untaian saling menukar segmen dengan animasi potong-sambung), mutasi (satu gen berubah warna). |
| 9 Integrasi HEFT→GA | Lab Kromosom + Datacenter | Untaian "HEFT" masuk sebagai individu awal; kurva konvergensi mulai lebih rendah dibanding GA acak. |
| 10 Pseudocode HEFT-GA | Lab (redup) | Overlay pseudocode; baris aktif menyorot objek 3D terkait. |
| 11 SFLA-GA gambaran | Persimpangan | Jalur SFLA dan GA bertemu. |
| 12 SFLA | **Kolam Teratai** | Katak di atas daun; diurutkan ke tinggi sesuai fitness; dibagi ke memeplex (cincin warna). |
| 13 GA dalam SFLA | Kolam Teratai (zoom satu memeplex) | Katak terburuk melompat; pada titik hybrid, **untaian GA** muncul di atas katak (crossover/mutasi) lalu katak mendarat di posisi baru. |
| 14 Shuffle | Kolam Teratai | Semua memeplex terbang menyatu lalu dibagi ulang (animasi shuffle). |
| 15 Pseudocode SFLA-GA | Kolam (redup) | Sama dengan slide 10. |
| 16 Setup eksperimen | **Datacenter (spesifikasi)** | Label berisi spesifikasi host/VM/objektif; dataset sebagai tumpukan task. |
| 17 Simulator live | **Arena Dua Lajur** | Dua datacenter identik berdampingan: kiri HEFT-GA (biru), kanan SFLA-GA (hijau); task mengalir bersamaan; kurva konvergensi tumbuh di panggung belakang. |
| 18 Hasil & statistik | **Panggung Hasil** | Batang/boxplot 3D tiap metrik; kamera berpindah antar metrik. |
| 19 Winner Spotlight | Panggung Hasil | Podium: pemenang naik ke atas, sorotan cahaya, label skor komposit. Dihitung dari data (PRD induk §10). |
| 20 Deep dive pemenang | Scene algoritma pemenang | Replay satu run penuh dari awal sampai jadwal akhir (scrubber waktu). |
| 21 Perbandingan 3 arah | **Panggung Tiga Arah** | Pemenang vs Baseline 1 vs Baseline 2: tiga datacenter mini + radar 3D/bar; kamera berputar sekali lalu berhenti pada tampak depan agar terbaca. |
| 22 Kesimpulan & pustaka | Hub | Kamera kembali ke posisi awal; overlay kesimpulan dan Daftar Pustaka. |
| 23–25 (Demo 2) | **Skenario Dunia Nyata** | Peta/topologi sederhana (mis. beberapa region datacenter), beban kerja nyata, slider what-if yang mengubah scene secara langsung. |

---

## 6. Sistem Kamera & Navigasi

### 6.1 Kamera
- Satu `PerspectiveCamera` dengan **rig waypoint**: setiap slide menyimpan `{position, target, fov, easing, duration}`.
- Transisi memakai interpolasi mulus (ease in-out), mendukung **pembatalan** jika pengguna menekan Next berulang cepat (lompat ke waypoint terbaru tanpa glitch).
- **Mode bebas (Explore)**: `OrbitControls` terbatas (batas jarak, polar angle, tanpa pan ke luar dunia) dengan tombol **"Reset kamera"** kembali ke waypoint slide.
- **Parallax halus** mengikuti pointer (±2°, bisa dimatikan).

### 6.2 Kontrol (melanjutkan PRD induk FR-01–FR-08)
| Input | Aksi |
|---|---|
| ← → / Spasi | Slide/langkah sebelumnya/berikutnya (sama dengan PRD induk) |
| `E` | Toggle mode Explore (orbit bebas) |
| `R` | Reset kamera ke waypoint |
| `H` | Tampil/sembunyi HUD dan label |
| `M` | Ganti mode kualitas (Tinggi / Seimbang / Performa) |
| `2` | Ganti ke **mode 2D fallback** |
| `F` / `G` / `P` | Layar penuh / daftar isi / mode presenter (PRD induk) |
| Klik objek 3D | Menampilkan **kartu detail** (mis. task 12: length, VM tujuan, start/finish) |
| Scrubber waktu | Mengatur posisi waktu pada replay simulasi (scene 17, 20) |

### 6.3 Sinkronisasi dengan stepper
Stepper algoritma (PRD induk FR-10) tetap menjadi **sumber kebenaran langkah**; scene 3D hanya **mengonsumsi** `StepEvent`. Tombol Next pada slide interaktif maju satu `StepEvent`, bukan memutar animasi acak.

---

## 7. Sistem Animasi Berbasis Event

### 7.1 Arsitektur
```text
Solver (Web Worker)  --StepEvent[]-->  Store  --subscribe-->  Scene Controller  -->  objek 3D
                                                  ^
                          Timeline (play/pause/scrub/speed)
```
- Worker **tidak** mengetahui apa pun tentang 3D. Ia hanya menghasilkan rekaman `StepEvent` yang sudah ada di PRD induk.
- **Scene Controller** per scene menerjemahkan event menjadi animasi deklaratif.

### 7.2 Jenis `StepEvent` yang wajib didukung visual

| Event | Animasi 3D |
|---|---|
| `heft.rank` | Angka `rank_u` muncul pada node DAG, urutan memudar-masuk dari node keluar |
| `heft.select` | Kubus task meluncur ke lajur VM terpilih; garis kandidat EFT ke semua VM |
| `ga.init` | Untaian populasi muncul bertahap |
| `ga.select` | Untaian terpilih terangkat |
| `ga.crossover` | Dua untaian terpotong di titik potong, segmen bertukar, anak muncul |
| `ga.mutate` | Gen terpilih berubah warna dengan denyut singkat |
| `ga.elite` | Individu terbaik diberi penanda tetap |
| `sfla.sort` | Katak naik/turun ke tinggi sesuai fitness |
| `sfla.partition` | Cincin memeplex terbentuk, daun tergeser ke kelompoknya |
| `sfla.leap` | Katak melompat dalam busur parabola ke posisi baru |
| `sfla.shuffle` | Semua memeplex menyatu lalu terbagi ulang |
| `eval.best` | Titik baru pada kurva konvergensi; kilatan pada solusi terbaik |
| `schedule.final` | Seluruh jadwal akhir tampil di lajur VM, garis makespan muncul |

### 7.3 Aturan animasi
- Durasi dasar 250–600 ms per event; **kecepatan global** 0,25×–4×; mode **lewati animasi** (hasil langsung).
- Pada run besar (ratusan task/ribuan event) gunakan **sampling event**: tampilkan N event representatif, hitung sisanya di latar, dan beri label "tampilan diringkas".
- Hormati `prefers-reduced-motion`: ganti gerak dengan transisi fade/instan.
- Easing konsisten: `easeInOutCubic` untuk kamera; `easeOutQuad` untuk benda masuk; lompatan katak berbentuk parabola deterministik.

---

## 8. HUD dan Overlay 2D

3D tidak boleh menutupi data. Overlay 2D (HTML di atas Canvas) wajib memuat:

1. **Badge nomor + label mono** (gaya deck dosen) dan **judul slide**.
2. **Kartu narasi** "Apa yang terjadi sekarang?" (sinkron dengan event).
3. **Panel metrik langsung**: makespan, biaya, utilisasi, iterasi/evaluasi, best fitness; angka berubah real-time.
4. **Legenda warna** dan skala (mis. "1 blok = 1 detik").
5. **Footer sitasi** dari `references.json`.
6. **Pseudocode viewer** dengan baris aktif (menyorot objek 3D terkait saat hover).
7. **Tooltip 3D** saat hover objek (kartu kecil, tidak menutupi objek lain).
8. **Takeaway** satu kalimat di bagian bawah tiap slide (gaya deck dosen).

Label 3D (angka pada objek) memakai **billboard** yang selalu menghadap kamera, dengan **batas kepadatan** (sembunyikan label yang saling tumpang tindih).

---

## 9. Kebutuhan Fungsional 3D (FR-3D)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-3D-01 | Satu Canvas persisten dengan rig kamera berbasis waypoint untuk seluruh slide. | P0 |
| FR-3D-02 | Scene: Hub, Datacenter, Peta Pola, Persimpangan, Ruang DAG, Lab Kromosom, Kolam Teratai, Arena Dua Lajur, Panggung Hasil, Podium, Panggung Tiga Arah. | P0 |
| FR-3D-03 | Pemetaan objek→data sesuai §4.1; semua atribut visual dikendalikan `scales.ts`. | P0 |
| FR-3D-04 | Animasi dipicu `StepEvent` (§7.2), bukan hardcode. | P0 |
| FR-3D-05 | Sinkron dua arah dengan stepper dan scrubber (maju, mundur, lompat). | P0 |
| FR-3D-06 | Arena Dua Lajur menjalankan dua algoritma **berdampingan** pada dataset yang sama. | P0 |
| FR-3D-07 | Podium pemenang membaca hasil dari store (aturan PRD induk §10); berubah jika data berubah. | P0 |
| FR-3D-08 | Klik/hover objek menampilkan detail data. | P1 |
| FR-3D-09 | Mode Explore dengan orbit terbatas dan tombol reset. | P1 |
| FR-3D-10 | **Mode kualitas** Tinggi/Seimbang/Performa, otomatis turun jika FPS < 30 selama 3 detik (dengan notifikasi kecil). | P0 |
| FR-3D-11 | **Fallback 2D** (tanpa WebGL atau pilihan pengguna) memakai visual 2D dari PRD induk, dengan konten setara. | P0 |
| FR-3D-12 | Replay satu run dengan scrubber waktu (scene 17 dan 20). | P1 |
| FR-3D-13 | Ekspor tangkapan layar PNG scene aktif (untuk laporan). | P2 |
| FR-3D-14 | Mode presenter menampilkan kamera saat ini dan pratinjau waypoint berikutnya. | P2 |
| FR-3D-15 | Scene Dunia Nyata dan what-if (Demo 2) memakai pipeline yang sama. | P1 (fase 2) |
| FR-3D-16 | Audio: **tidak ada** secara default (opsional efek klik halus, mati default). | P3 |

---

## 10. Kebutuhan Non-Fungsional

### 10.1 Performa (anggaran per frame ≈ 16 ms)

| Mode | Resolusi render | Efek | Objek maks (perkiraan) |
|---|---|---|---|
| Tinggi | DPR hingga 2, antialias | Bayangan lembut, outline | ~5.000 instance |
| Seimbang (default) | DPR ≤ 1,5 | Tanpa bayangan dinamis, outline ringan | ~3.000 instance |
| Performa | DPR 1 | Tanpa outline/postprocessing, label dikurangi | ~1.500 instance |

Teknik wajib:
- **InstancedMesh** untuk task, gen kromosom, dan katak.
- Geometri dan material **dibagi ulang** (tidak dibuat per objek); `dispose` saat scene dilepas.
- **Render sesuai kebutuhan** (`frameloop="demand"` saat tidak ada animasi) untuk menghemat baterai.
- **Lazy-load** scene yang belum dibuka; prakirim waypoint berikutnya.
- Simulasi tetap di **Web Worker**; thread utama hanya merender.
- Hindari alokasi objek per frame (pakai objek sementara yang dipakai ulang).

### 10.2 Kompatibilitas
- Chrome/Edge/Firefox terbaru dengan WebGL2; Safari terbaru sebagai usaha terbaik.
- Target utama: laptop + proyektor 16:9 (1366×768 – 1920×1080). Ponsel: hanya mode 2D yang dapat dibaca.
- Deteksi WebGL otomatis → tawarkan mode 2D.

### 10.3 Aksesibilitas
- Seluruh informasi penting juga tersedia di overlay teks (tidak hanya di 3D).
- Kontras HUD WCAG AA; tidak mengandalkan warna saja (tambahkan bentuk/label/pola).
- `prefers-reduced-motion` dihormati; tidak ada kedipan lebih dari 3 kali per detik.
- Kontrol keyboard lengkap; fokus terlihat; `aria-live` untuk narasi langkah.

### 10.4 Keandalan saat demo
- Hasil run terakhir **tersimpan** (localStorage) dan dapat diputar ulang tanpa menghitung ulang.
- Tombol **"Demo aman"**: memuat hasil prasimpan + preset kualitas Performa.
- Build statis yang dapat dibuka offline.

---

## 11. Arsitektur Teknis

### 11.1 Tumpukan teknologi
| Lapisan | Pilihan |
|---|---|
| Render 3D | **three** + **@react-three/fiber** (R3F) |
| Helper | **@react-three/drei** (kamera, billboard `Html`/`Text`, `Instances`, `Line`, `OrbitControls`) |
| Animasi | **GSAP** (timeline kamera dan event) atau **@react-spring/three**; satu saja, konsisten |
| Efek (opsional) | **@react-three/postprocessing** hanya untuk outline/SSAO ringan di mode Tinggi |
| State | **Zustand** (slide aktif, hasil, event, mode kualitas, kecepatan) |
| Overlay | React + Tailwind (token desain PRD induk) |
| Bahasa | TypeScript strict |
| Pengujian | Vitest (skala, kontroler event), Playwright (smoke test: navigasi + canvas muncul + FPS probe) |
| Debug | **leva** + `stats-gl`/`r3f-perf` (hanya mode dev) |
| Deploy | Vercel/Netlify/GitHub Pages (statis) |

### 11.2 Struktur folder (menambah struktur PRD induk)
```text
src/
├─ three/
│  ├─ Canvas3D.tsx              # Canvas persisten + pencahayaan + kualitas
│  ├─ camera/
│  │   ├─ waypoints.ts          # pose kamera per slide
│  │   └─ CameraRig.tsx         # interpolasi + pembatalan
│  ├─ scales.ts                 # konversi data -> unit dunia
│  ├─ palette.ts                # warna algoritma & status (satu sumber)
│  ├─ scenes/
│  │   ├─ Hub.tsx  Datacenter.tsx  PatternMap.tsx  Crossroads.tsx
│  │   ├─ DagSpace.tsx  ChromosomeLab.tsx  LotusPond.tsx
│  │   ├─ DualArena.tsx  ResultsStage.tsx  Podium.tsx  ThreeWayStage.tsx
│  │   └─ RealWorld.tsx         # Demo 2
│  ├─ objects/
│  │   ├─ TaskInstances.tsx  VmLane.tsx  HostRack.tsx  Strand.tsx
│  │   ├─ Frog.tsx  LilyPad.tsx  ConvergenceLine3D.tsx  Billboard.tsx
│  ├─ controllers/              # event -> animasi (satu per scene)
│  │   ├─ heftController.ts  gaController.ts  sflaController.ts  arenaController.ts
│  └─ quality/                  # deteksi FPS, mode kualitas, fallback
├─ hud/                         # overlay 2D: MetricsPanel, Legend, Narration, Pseudocode
└─ fallback2d/                  # visual 2D setara (dipakai bila WebGL tidak ada)
```

### 11.3 Antarmuka kontroler scene
```ts
interface SceneController {
  id: string;
  mount(ctx: SceneContext): void;           // buat objek (instancing)
  apply(event: StepEvent, t: Timeline): void; // terjemahkan event -> animasi
  seek(time: number): void;                 // untuk scrubber/mundur
  setQuality(mode: 'high' | 'balanced' | 'perf'): void;
  dispose(): void;                          // bebaskan GPU resource
}
```
Kontroler harus **idempoten dan dapat di-seek**: keadaan visual pada waktu *t* dapat direkonstruksi dari log event, sehingga mundur dan lompat tidak merusak tampilan.

### 11.4 Aset
- **Tanpa model eksternal**: semua geometri prosedural (Box, Cylinder, Sphere, Circle, Line).
- Font: satu sans + satu mono, di-subset; ditanam (bukan dari CDN) agar aman offline.
- Tekstur: tidak ada, atau gradien kecil prosedural.

---

## 12. Rencana Implementasi (Fase untuk Claude Code)

> Prasyarat: Fase 0–2 PRD induk (shell deck, simulator, algoritma) sudah ada atau dikerjakan paralel. Dunia 3D hanya mengonsumsi data/event.

| Fase | Deliverable | Kriteria selesai |
|---|---|---|
| **3D-0 Fondasi** | Canvas persisten, kualitas dasar, `CameraRig` + waypoints, `scales.ts`, `palette.ts`, overlay HUD kerangka | Next/Prev memindahkan kamera mulus antar 5 waypoint dummy; FPS terukur. |
| **3D-1 Datacenter inti** | `HostRack`, `VmLane`, `TaskInstances`, penugasan task→lajur, garis makespan | Jadwal dari simulator tampil benar dan cocok dengan angka makespan. |
| **3D-2 Scene HEFT-GA** | `DagSpace`, `ChromosomeLab`, `Strand`, controller HEFT dan GA | Stepper menggerakkan 3D; seek mundur konsisten. |
| **3D-3 Scene SFLA-GA** | `LotusPond`, `Frog`, `LilyPad`, controller SFLA, animasi hybrid GA di memeplex | Lompatan, partisi, shuffle sesuai event. |
| **3D-4 Eksperimen** | `DualArena`, `ConvergenceLine3D`, `ResultsStage`, scrubber replay | Dua algoritma berjalan berdampingan; kurva tumbuh real-time. |
| **3D-5 Pemenang & perbandingan** | `Podium`, `ThreeWayStage`, Winner Spotlight dinamis | Pemenang berubah mengikuti data uji. |
| **3D-6 Polish & ketahanan** | Mode kualitas otomatis, fallback 2D, reduced-motion, mode presenter, Demo aman, tangkapan layar | Checklist §13 hijau; latihan demo 10 menit tanpa error. |
| **3D-7 Demo 2** | Scene Dunia Nyata + what-if | Slider mengubah scene dan hasil secara langsung. |

**Instruksi eksekusi:** kerjakan berurutan, commit per fase, uji FPS di akhir tiap fase, **jangan hardcode animasi atau hasil**, dan jaga setiap objek 3D tetap terhubung ke data nyata.

---

## 13. Kriteria Penerimaan

- [ ] Satu Canvas persisten; seluruh 22 slide punya waypoint dan scene/overlay yang sesuai (§5).
- [ ] Setiap animasi algoritma dipicu `StepEvent`; mundur, maju, dan lompat konsisten.
- [ ] Angka di HUD sama dengan angka di tabel hasil PRD induk (tidak ada selisih).
- [ ] Arena Dua Lajur menjalankan HEFT-GA dan SFLA-GA bersamaan pada dataset yang sama.
- [ ] Podium pemenang dinamis dan sesuai aturan skor komposit.
- [ ] ≥ 45 fps di mode Seimbang pada laptop uji; auto-downgrade berfungsi.
- [ ] Fallback 2D muncul otomatis tanpa WebGL dan dapat dipilih manual (`2`).
- [ ] `prefers-reduced-motion` dihormati; informasi penting tersedia sebagai teks.
- [ ] Mode "Demo aman" bekerja tanpa menghitung ulang dan tanpa internet.
- [ ] Tidak ada error konsol dan tidak ada kebocoran memori terlihat setelah 10 menit demo (pantau jumlah geometri/tekstur).

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| 3D terlalu berat di laptop presentasi | Demo patah-patah | InstancedMesh, mode kualitas otomatis, sampling event, "Demo aman". |
| Visual mengalahkan substansi akademik | Dosen menilai kurang jelas | Prinsip data-dense (§3), HUD wajib (§8), sitasi dan pseudocode selalu tersedia. |
| Animasi tidak sinkron dengan algoritma | Kesan "animasi palsu" | Arsitektur event (§7), uji konsistensi seek, HUD memakai data yang sama. |
| Proyektor tidak mendukung WebGL | Layar kosong | Deteksi dan fallback 2D otomatis; uji sebelum presentasi. |
| Label bertumpuk, sulit dibaca | Informasi hilang | Billboard dengan deteksi tumpang tindih, zoom kamera per waypoint, klik untuk detail. |
| Waktu pengerjaan membengkak | Tidak siap Demo 1 | Prioritas P0 dahulu; scene Peta Pola dan Persimpangan boleh sederhana; Demo 2 ditunda ke fase 2. |
| Mabuk gerak pada audiens | Tidak nyaman | Kamera lambat, easing lembut, tanpa goyangan, tombol reduced-motion. |

---

## 15. Pertanyaan Terbuka

1. Apakah proyektor/laptop presentasi punya **GPU dedicated**? (menentukan mode kualitas default)
2. Apakah presentasi dilakukan **langsung dari browser** atau direkam sebagai video juga?
3. Lebih suka latar **terang** (cocok proyektor) atau **gelap** sebagai default?
4. Berapa durasi presentasi? (menentukan seberapa banyak scene yang dibangun penuh vs ringkas)
5. Apakah ada **batasan dosen** soal media (mis. harus ada file PPT juga)? Jika ya, tambahkan ekspor tangkapan layar tiap waypoint (FR-3D-13).
6. Skenario **dunia nyata** untuk Demo 2 (menentukan desain scene `RealWorld`).

---

## Lampiran A — Ringkasan Satu Kalimat per Scene

| Scene | Pesan utama yang harus tertangkap audiens |
|---|---|
| Datacenter | "Task dipetakan ke VM, dan urutan serta pilihan VM menentukan makespan." |
| Ruang DAG | "HEFT menentukan prioritas dari ketergantungan, lalu menempatkan task di VM dengan selesai paling cepat." |
| Lab Kromosom | "GA mencari lewat populasi solusi yang disilang dan dimutasi." |
| Kolam Teratai | "SFLA membagi katak ke kelompok, katak terburuk belajar dari yang terbaik." |
| Arena Dua Lajur | "Dengan data dan anggaran yang sama, inilah perbedaan perilaku kedua hybrid." |
| Podium | "Hybrid unggul ditentukan oleh data, bukan asumsi." |
| Panggung Tiga Arah | "Dibanding dua metode sebelumnya, hybrid unggul lebih baik pada metrik berikut." |
