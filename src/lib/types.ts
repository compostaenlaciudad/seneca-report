export type Severity = 'A' | 'B' | 'C';
export type Risk = 'BAJO' | 'MODERADO' | 'ELEVADO' | 'ALTO';

export type DimensionKey =
  | 'coherencia'
  | 'patrimonio'
  | 'asistencia'
  | 'transparencia'
  | 'conflictos';

export interface Dimension {
  key: DimensionKey;
  label?: string;
  score: number; // 0–100
  note?: string;
}

export interface Flag {
  severity: Severity;
  title: string;
  body: string;
  sources: string[];
}

export interface TimelineEntry {
  year: string;
  evt: string;
  org: string;
}

export interface EducationEntry {
  year: string;
  deg: string;
  inst: string;
  verified: boolean;
}

export interface AssetEntry {
  year: number;
  mxn: number;
}

export interface Politician {
  id: string;
  slug: string;
  name: string;
  role: string;
  party: string;
  state: string;
  born: string;
  photo: string; // initials placeholder until real photos
  score: number;
  risk: Risk;
  dimensions: Dimension[];
  flags: Flag[];
  timeline: TimelineEntry[];
  education: EducationEntry[];
  assets: AssetEntry[];
  lastUpdated: string; // ISO date
  sourceCount: number;
}
