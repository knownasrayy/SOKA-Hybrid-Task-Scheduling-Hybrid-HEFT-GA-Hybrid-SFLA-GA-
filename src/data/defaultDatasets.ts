import { Problem } from '../sim/model';
import datasetMinggu3Raw from '../../public/data/dataset_minggu3.json';
import topcuogluRaw from '../../public/data/workflows/topcuoglu_10.json';
import montageRaw from '../../public/data/workflows/montage_25.json';

export const SMALL_STEPPER_PROBLEM: Problem = {
  id: 'stepper_small',
  name: 'Contoh Edukasi Kecil (6 Task, 3 VM)',
  description: 'Instance verifikasi untuk demonstrasi stepper langkah-demi-langkah',
  vms: [
    { id: 0, name: 'VM-1 (1000 MIPS)', mips: 1000, ram: 1024, bw: 1000, pricePerHour: 0.05, color: '#2f6fdb' },
    { id: 1, name: 'VM-2 (500 MIPS)',  mips: 500,  ram: 1024, bw: 500,  pricePerHour: 0.03, color: '#8b5cf6' },
    { id: 2, name: 'VM-3 (1500 MIPS)', mips: 1500, ram: 2048, bw: 1500, pricePerHour: 0.08, color: '#0e9f9e' }
  ],
  tasks: [
    { id: 0, name: 'T1', length: 3000, fileSize: 100, outputSize: 100, deps: [] },
    { id: 1, name: 'T2', length: 5000, fileSize: 100, outputSize: 100, deps: [0] },
    { id: 2, name: 'T3', length: 2000, fileSize: 100, outputSize: 100, deps: [0] },
    { id: 3, name: 'T4', length: 9000, fileSize: 100, outputSize: 100, deps: [1, 2] },
    { id: 4, name: 'T5', length: 4000, fileSize: 100, outputSize: 100, deps: [2] },
    { id: 5, name: 'T6', length: 6000, fileSize: 100, outputSize: 100, deps: [3, 4] }
  ],
  edges: [
    { from: 0, to: 1, dataKb: 100 },
    { from: 0, to: 2, dataKb: 100 },
    { from: 1, to: 3, dataKb: 100 },
    { from: 2, to: 3, dataKb: 100 },
    { from: 2, to: 4, dataKb: 100 },
    { from: 3, to: 5, dataKb: 100 },
    { from: 4, to: 5, dataKb: 100 }
  ]
};

export const MINGGU3_PROBLEM: Problem = {
  id: 'minggu3',
  name: datasetMinggu3Raw.meta.name,
  description: datasetMinggu3Raw.meta.description,
  vms: datasetMinggu3Raw.vms.map((v) => ({
    ...v,
    color: ['#2f6fdb', '#8b5cf6', '#0e9f9e', '#64748b'][v.id % 4]
  })),
  tasks: datasetMinggu3Raw.tasks
};

export const TOPCUOGLU_DAG_PROBLEM: Problem = {
  id: 'topcuoglu_10',
  name: topcuogluRaw.meta.name,
  description: topcuogluRaw.meta.description,
  vms: topcuogluRaw.vms.map((v) => ({
    ...v,
    color: ['#2f6fdb', '#8b5cf6', '#0e9f9e', '#64748b'][v.id % 4]
  })),
  tasks: topcuogluRaw.tasks,
  edges: topcuogluRaw.edges
};

export const MONTAGE_DAG_PROBLEM: Problem = {
  id: 'montage_25',
  name: montageRaw.meta.name,
  description: montageRaw.meta.description,
  vms: montageRaw.vms.map((v) => ({
    ...v,
    color: ['#2f6fdb', '#8b5cf6', '#0e9f9e', '#64748b'][v.id % 4]
  })),
  tasks: montageRaw.tasks
};

export const AVAILABLE_DATASETS: Record<string, Problem> = {
  minggu3: MINGGU3_PROBLEM,
  topcuoglu_10: TOPCUOGLU_DAG_PROBLEM,
  montage_25: MONTAGE_DAG_PROBLEM,
  stepper_small: SMALL_STEPPER_PROBLEM
};

export function parseCsvDataset(csvText: string): Problem {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('File CSV kosong atau tidak valid.');
  }

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const idIdx = header.indexOf('id');
  const nameIdx = header.indexOf('name');
  const lengthIdx = header.indexOf('length');
  const fileIdx = header.indexOf('filesize');
  const outIdx = header.indexOf('outputsize');
  const depsIdx = header.indexOf('deps');

  if (lengthIdx === -1) {
    throw new Error('Kolom "length" wajib ada di CSV.');
  }

  const tasks = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim());
    if (parts.length < 2) continue;

    const id = idIdx !== -1 && parts[idIdx] !== '' ? parseInt(parts[idIdx], 10) : i - 1;
    const name = nameIdx !== -1 && parts[nameIdx] !== '' ? parts[nameIdx] : `T${id + 1}`;
    const length = parseFloat(parts[lengthIdx]);
    const fileSize = fileIdx !== -1 && parts[fileIdx] !== '' ? parseFloat(parts[fileIdx]) : 200;
    const outputSize = outIdx !== -1 && parts[outIdx] !== '' ? parseFloat(parts[outIdx]) : 200;

    let deps: number[] = [];
    if (depsIdx !== -1 && parts[depsIdx]) {
      deps = parts[depsIdx]
        .split(';')
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => !isNaN(d));
    }

    tasks.push({ id, name, length, fileSize, outputSize, deps });
  }

  return {
    id: 'uploaded_csv',
    name: 'Dataset Impor CSV',
    description: `Dataset kustom berisi ${tasks.length} task`,
    vms: MINGGU3_PROBLEM.vms,
    tasks
  };
}
