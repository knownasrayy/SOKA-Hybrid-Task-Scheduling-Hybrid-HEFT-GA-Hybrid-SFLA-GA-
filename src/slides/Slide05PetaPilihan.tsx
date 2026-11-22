import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Highlight } from '../components/Highlight';
import { Citation } from '../components/Citation';

export const Slide05PetaPilihan: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-2">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Badge label="05 · PETA PILIHAN & ORISINALITAS" color="yellow" />
          <span className="font-mono text-xs text-muted">2 Hybrid Terpilih + 2 Baseline Pembanding</span>
        </div>
        <h2 className="text-3xl font-black text-ink tracking-tight mb-2">
          Peta Lengkap <Highlight>Algoritma & Referensi</Highlight> Ilmiah.
        </h2>
        <p className="text-sm text-muted font-medium">
          Seluruh algoritma diimplementasikan pada interface simulator yang sama agar evaluasi adil dan sebanding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Kolom 1: Dua Hybrid */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
            Dua Algoritma Hybrid yang Diuji (Ketentuan 1)
          </span>

          <Card className="border-l-4 border-l-heft">
            <div className="flex items-start justify-between mb-1">
              <span className="font-mono text-xs font-bold text-heft">Pola B · Heuristik + Metaheuristik</span>
              <Citation id="aziza2020" />
            </div>
            <h4 className="font-extrabold text-lg text-ink">Hybrid HEFT-GA (Aziza & Krichen, 2020)</h4>
            <p className="text-xs text-[#555] my-2 leading-relaxed">
              Memanfaatkan solusi urutan upward rank dari HEFT sebagai benih awal dalam populasi GA, kemudian diperbaiki dengan operator evolusioner untuk keluar dari jebakan lokal optimum.
            </p>
            <div className="text-[11px] font-mono text-muted">
              Jurnal: <em>Neural Computing and Applications (Springer)</em> · Q1
            </div>
          </Card>

          <Card className="border-l-4 border-l-sfla">
            <div className="flex items-start justify-between mb-1">
              <span className="font-mono text-xs font-bold text-sfla">Pola C · Metaheuristik + Metaheuristik</span>
              <Citation id="kayalvili2019" />
            </div>
            <h4 className="font-extrabold text-lg text-ink">Hybrid SFLA-GA (Kayalvili & Selvam, 2019)</h4>
            <p className="text-xs text-[#555] my-2 leading-relaxed">
              Membagi populasi katak ke memeplex; di dalam tiap memeplex, operator rekombinasi GA (crossover + mutasi) dijalankan sebagai mesin pencari lokal sebelum fase pengocokan global (shuffle).
            </p>
            <div className="text-[11px] font-mono text-muted">
              Jurnal: <em>Cluster Computing (Springer)</em> · Q2
            </div>
          </Card>
        </div>

        {/* Kolom 2: Dua Baseline */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
            Dua Metode Pembanding Sebelumnya (Ketentuan 6)
          </span>

          <Card className="border-l-4 border-l-[#d97706]">
            <div className="flex items-start justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#d97706]">Baseline 1 · Metaheuristik Murni</span>
              <Citation id="eusuff2006" />
            </div>
            <h4 className="font-extrabold text-base text-ink">SFLA Murni (Eusuff & Lansey, 2006)</h4>
            <p className="text-xs text-[#555] my-2 leading-relaxed">
              Diambil dari Tugas Presentasi SFLA & WCA sebelumnya. Menggunakan formula perpindahan vektor katak standar tanpa operator rekombinasi genetik.
            </p>
          </Card>

          <Card className="border-l-4 border-l-[#7c3aed]">
            <div className="flex items-start justify-between mb-1">
              <span className="font-mono text-xs font-bold text-[#7c3aed]">Baseline 2 · Metaheuristik Murni</span>
              <Citation id="eskandar2012" />
            </div>
            <h4 className="font-extrabold text-base text-ink">WCA Murni (Eskandar et al., 2012)</h4>
            <p className="text-xs text-[#555] my-2 leading-relaxed">
              Diambil dari Tugas Presentasi SFLA & WCA sebelumnya. Berbasis aliran sungai menuju laut dengan siklus evaporasi dan hujan buatan.
            </p>
          </Card>
        </div>
      </div>

      <div className="p-3 bg-white border-neo rounded-xl text-xs font-mono flex items-center justify-between">
        <span><strong>Kepatuhan Aturan 3 (Orisinalitas):</strong> Kombinasi HEFT-GA + SFLA-GA unik dan berbeda dengan kelompok kelas lain.</span>
        <span className="bg-now px-2 py-0.5 rounded border border-ink font-bold">Terverifikasi</span>
      </div>
    </div>
  );
};
