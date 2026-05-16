import type { Risk } from './types';

export const DIMENSION_LABELS: Record<string, string> = {
  coherencia:    'Coherencia discursiva',
  patrimonio:    'Coherencia patrimonial',
  asistencia:    'Asistencia y votación',
  transparencia: 'Transparencia',
  conflictos:    'Conflictos de interés',
};

export function scoreColor(n: number): string {
  if (n >= 70) return 'var(--ok)';
  if (n >= 50) return 'var(--warn)';
  return 'var(--flag)';
}

export function riskColor(risk: Risk): string {
  if (risk === 'BAJO')     return 'var(--ok)';
  if (risk === 'MODERADO') return 'var(--warn)';
  return 'var(--flag)';
}

export function pillKindForRisk(risk: Risk): 'ok' | 'warn' | 'flag' {
  if (risk === 'BAJO')     return 'ok';
  if (risk === 'MODERADO') return 'warn';
  return 'flag';
}

export function fmtMxn(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
