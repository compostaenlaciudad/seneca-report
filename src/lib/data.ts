import type { Politician } from './types';

/**
 * Mock politicians for development. Replace with Supabase queries in production.
 *
 * Suggested Supabase schema:
 *   politicians   (id, slug, name, party, state, role, born, photo_url,
 *                  last_updated, source_count)
 *   scores        (politician_id, score, risk_level, computed_at, dimensions JSONB)
 *   flags         (id, politician_id, severity, title, body, sources JSONB, created_at)
 *   declarations  (politician_id, year, total_mxn, breakdown JSONB)
 *   timeline      (politician_id, year, evt, org, ordinal)
 *   education     (politician_id, year, degree, institution, verified)
 */
export const POLITICIANS: Politician[] = [
  {
    id: 'monreal',
    slug: 'ricardo-monreal',
    name: 'Ricardo Monreal Ávila',
    role: 'Senador de la República',
    party: 'MORENA',
    state: 'Ciudad de México',
    born: '1960 · Fresnillo, Zacatecas',
    photo: 'RM',
    score: 47,
    risk: 'ELEVADO',
    dimensions: [
      { key: 'coherencia',    label: 'Coherencia discursiva',  score: 38, note: 'Posiciones públicas vs. votos en pleno' },
      { key: 'patrimonio',    label: 'Coherencia patrimonial', score: 31, note: 'Declaraciones 3-de-3 vs. registros públicos' },
      { key: 'asistencia',    label: 'Asistencia y votación',  score: 72, note: '184 de 213 sesiones · 86%' },
      { key: 'transparencia', label: 'Transparencia',          score: 55, note: '11 solicitudes de información incompletas' },
      { key: 'conflictos',    label: 'Conflictos de interés',  score: 41, note: '3 conflictos no declarados detectados' },
    ],
    flags: [
      {
        severity: 'A',
        title: 'Incremento patrimonial sin justificar',
        body: 'Declaración 2023 reporta inmueble en Lomas Anáhuac con valor catastral de $18.4M MXN, no presente en declaración 2019 ni en historial de ingresos públicos declarados.',
        sources: ['Declaranet 2019–2023', 'Catastro CDMX', 'SAT — solicitud 0610000123423'],
      },
      {
        severity: 'B',
        title: 'Voto contra propuesta que firmó como autor',
        body: 'Co-autor de la iniciativa de reforma judicial 2022. Votó en contra en la sesión del 14 de febrero 2024 sin razonamiento de voto en actas.',
        sources: ['Gaceta Parlamentaria 6209-III', 'Diario de Debates Senado'],
      },
      {
        severity: 'C',
        title: 'Familiar directo en cargo subordinado',
        body: 'Hermano registrado como asesor parlamentario adscrito a su oficina entre 2021 y 2023, sin declaración de parentesco en sistema de personal del Senado.',
        sources: ['Portal de Transparencia Senado', 'Registro de personal 2021–2023'],
      },
    ],
    timeline: [
      { year: '1998', evt: 'Gobernador de Zacatecas',          org: 'PRI' },
      { year: '2006', evt: 'Senador (1ª vez)',                  org: 'PRD' },
      { year: '2015', evt: 'Jefe Delegacional Cuauhtémoc',      org: 'MORENA' },
      { year: '2018', evt: 'Senador · Coordinador MORENA',      org: 'MORENA' },
      { year: '2022', evt: 'Presidente JUCOPO',                 org: 'MORENA' },
    ],
    education: [
      { year: '1984', deg: 'Licenciatura en Derecho', inst: 'UNAM', verified: true },
      { year: '2005', deg: 'Doctorado en Derecho',    inst: 'UNAM', verified: true },
    ],
    assets: [
      { year: 2018, mxn: 12_400_000 },
      { year: 2019, mxn: 13_900_000 },
      { year: 2020, mxn: 15_100_000 },
      { year: 2021, mxn: 22_800_000 },
      { year: 2022, mxn: 27_400_000 },
      { year: 2023, mxn: 41_200_000 },
    ],
    lastUpdated: '2026-05-12',
    sourceCount: 47,
  },
  {
    id: 'galvez',
    slug: 'xochitl-galvez',
    name: 'Xóchitl Gálvez Ruiz',
    role: 'Senadora (ex-candidata presidencial)',
    party: 'PAN-PRI-PRD',
    state: 'Hidalgo',
    born: '1963 · Tepatepec, Hidalgo',
    photo: 'XG',
    score: 71,
    risk: 'MODERADO',
    dimensions: [
      { key: 'coherencia',    label: 'Coherencia discursiva',  score: 76, note: '12 contradicciones documentadas en 4 años' },
      { key: 'patrimonio',    label: 'Coherencia patrimonial', score: 64, note: 'Empresas familiares previamente declaradas' },
      { key: 'asistencia',    label: 'Asistencia y votación',  score: 81, note: '172 de 213 sesiones · 81%' },
      { key: 'transparencia', label: 'Transparencia',          score: 78, note: 'Declaración 3-de-3 pública desde 2018' },
      { key: 'conflictos',    label: 'Conflictos de interés',  score: 55, note: 'High-Tech Services declarada parcialmente' },
    ],
    flags: [
      {
        severity: 'B',
        title: 'Contratos federales a empresa de cónyuge',
        body: 'Empresa de tecnología registrada a nombre de cónyuge recibió 3 contratos federales por $4.1M MXN entre 2019 y 2021, durante periodo legislativo.',
        sources: ['CompraNet', 'RFC empresa', 'Declaración patrimonial 2021'],
      },
      {
        severity: 'C',
        title: 'Información incompleta en declaración 2022',
        body: 'Sección de pasivos no fue actualizada respecto a 2021 a pesar de cambios reportados en bienes inmuebles.',
        sources: ['Declaranet 2022'],
      },
    ],
    timeline: [
      { year: '2000', evt: 'Comisionada Pueblos Indígenas',     org: 'Vicente Fox' },
      { year: '2015', evt: 'Jefa Delegacional Miguel Hidalgo',   org: 'PAN' },
      { year: '2018', evt: 'Senadora',                            org: 'PAN' },
      { year: '2023', evt: 'Candidata presidencial',              org: 'Frente Amplio' },
      { year: '2024', evt: 'Senadora (reincorporación)',          org: 'PAN' },
    ],
    education: [
      { year: '1990', deg: 'Ingeniería en Computación', inst: 'UNAM', verified: true },
    ],
    assets: [
      { year: 2018, mxn: 28_100_000 },
      { year: 2019, mxn: 29_800_000 },
      { year: 2020, mxn: 31_400_000 },
      { year: 2021, mxn: 34_900_000 },
      { year: 2022, mxn: 36_200_000 },
      { year: 2023, mxn: 39_700_000 },
    ],
    lastUpdated: '2026-05-10',
    sourceCount: 38,
  },
  {
    id: 'velasco',
    slug: 'manuel-velasco',
    name: 'Manuel Velasco Coello',
    role: 'Senador',
    party: 'PVEM',
    state: 'Chiapas',
    born: '1980 · Tuxtla Gutiérrez',
    photo: 'MV',
    score: 34,
    risk: 'ALTO',
    dimensions: [
      { key: 'coherencia',    score: 29 },
      { key: 'patrimonio',    score: 22 },
      { key: 'asistencia',    score: 51 },
      { key: 'transparencia', score: 38 },
      { key: 'conflictos',    score: 31 },
    ],
    flags: [],
    timeline: [],
    education: [],
    assets: [],
    lastUpdated: '2026-05-09',
    sourceCount: 22,
  },
  {
    id: 'romero',
    slug: 'jorge-romero',
    name: 'Jorge Romero Herrera',
    role: 'Diputado Federal',
    party: 'PAN',
    state: 'Ciudad de México',
    born: '1979 · Ciudad de México',
    photo: 'JR',
    score: 58,
    risk: 'MODERADO',
    dimensions: [
      { key: 'coherencia',    score: 62 },
      { key: 'patrimonio',    score: 54 },
      { key: 'asistencia',    score: 74 },
      { key: 'transparencia', score: 51 },
      { key: 'conflictos',    score: 49 },
    ],
    flags: [],
    timeline: [],
    education: [],
    assets: [],
    lastUpdated: '2026-05-08',
    sourceCount: 18,
  },
  {
    id: 'lagunes',
    slug: 'alejandra-lagunes',
    name: 'Alejandra Lagunes Soto Ruiz',
    role: 'Senadora',
    party: 'PVEM',
    state: 'Veracruz',
    born: '1969 · Ciudad de México',
    photo: 'AL',
    score: 64,
    risk: 'MODERADO',
    dimensions: [
      { key: 'coherencia',    score: 68 },
      { key: 'patrimonio',    score: 71 },
      { key: 'asistencia',    score: 59 },
      { key: 'transparencia', score: 66 },
      { key: 'conflictos',    score: 58 },
    ],
    flags: [],
    timeline: [],
    education: [],
    assets: [],
    lastUpdated: '2026-05-11',
    sourceCount: 24,
  },
];

export function findPolitician(slug: string): Politician | undefined {
  return POLITICIANS.find((p) => p.slug === slug);
}
