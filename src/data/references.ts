import refData from '../../config/references.json';

export interface ReferenceItem {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  pattern: string;
  summary: string;
}

export const REFERENCES: ReferenceItem[] = refData as ReferenceItem[];

export function getReference(id: string): ReferenceItem | undefined {
  return REFERENCES.find((r) => r.id === id);
}
