import { createServerSupabaseClient } from './supabase-server'
import type { Politician, Dimension, Flag, TimelineEntry, EducationEntry, AssetEntry } from './types'

const DIMENSION_NAME_MAP: Record<string, string> = {
  integridad_filosofica:     'Integridad filosófica',
  coherencia_hechos:         'Coherencia dichos / hechos',
  transparencia_patrimonial: 'Transparencia patrimonial',
  rendicion_cuentas:         'Rendición de cuentas',
  independencia_poder:       'Independencia del poder',
}

const FLAG_TYPE_MAP: Record<string, string> = {
  conflict_of_interest: 'Conflicto de interés',
  asset_discrepancy:    'Inconsistencia patrimonial',
  legal_proceeding:     'Proceso legal documentado',
  broken_promise:       'Promesa incumplida',
  sanction:             'Sanción oficial',
}

export async function getAllPoliticians(): Promise<Politician[]> {
  const supabase = await createServerSupabaseClient()

  const { data: candidates, error } = await supabase
    .from('candidates')
    .select(`
      id,
      slug,
      name,
      party,
      state,
      office_sought,
      current_position,
      years_in_politics,
      seneca_score,
      risk_level,
      summary_es,
      last_updated,
      score_dimensions (
        name,
        score,
        reasoning
      ),
      flags (
        type,
        description,
        severity,
        source_url,
        date
      ),
      education (
        institution,
        degree,
        field,
        year,
        verified
      ),
      sources (
        id
      )
    `)
    .order('seneca_score', { ascending: false })

  if (error || !candidates) return []

  return candidates.map(mapCandidate)
}

export async function getPoliticianBySlug(slug: string): Promise<Politician | undefined> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('candidates')
    .select(`
      id,
      slug,
      name,
      party,
      state,
      office_sought,
      current_position,
      years_in_politics,
      seneca_score,
      risk_level,
      summary_es,
      last_updated,
      score_dimensions (
        name,
        score,
        reasoning
      ),
      flags (
        type,
        description,
        severity,
        source_url,
        date
      ),
      education (
        institution,
        degree,
        field,
        year,
        verified
      ),
      sources (
        type,
        title,
        url,
        date,
        excerpt
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return undefined

  return mapCandidate(data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCandidate(c: any): Politician {
  const dimensions: Dimension[] = (c.score_dimensions ?? []).map((d: any) => ({
    key: d.name,
    label: DIMENSION_NAME_MAP[d.name] ?? d.name.replace(/_/g, ' '),
    score: d.score * 5,
    note: d.reasoning?.slice(0, 100) + '…',
  }))

  const flags: Flag[] = (c.flags ?? []).map((f: any) => ({
    severity: mapSeverity(f.severity),
    title: FLAG_TYPE_MAP[f.type] ?? f.type.replace(/_/g, ' '),
    body: f.description,
    sources: [f.source_url ?? ''].filter(Boolean),
  }))

  const education: EducationEntry[] = (c.education ?? []).map((e: any) => ({
    year: String(e.year ?? ''),
    deg: `${e.degree} en ${e.field}`,
    inst: e.institution,
    verified: e.verified ?? false,
  }))

  const initials = c.name
    .split(' ')
    .filter((_: string, i: number) => i === 0 || i === 1)
    .map((w: string) => w[0])
    .join('')

  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    role: c.current_position ?? c.office_sought ?? '',
    party: c.party,
    state: c.state,
    born: '',
    photo: initials,
    score: c.seneca_score ?? 0,
    risk: mapRisk(c.risk_level),
    bio: c.summary_es ?? '',
    dimensions,
    flags,
    timeline: [] as TimelineEntry[],
    education,
    assets: [] as AssetEntry[],
    lastUpdated: c.last_updated?.slice(0, 10) ?? '',
    sourceCount: c.sources?.length ?? 0,
  }
}

function mapSeverity(s: string): 'A' | 'B' | 'C' {
  if (s === 'danger')  return 'A'
  if (s === 'warning') return 'B'
  return 'C'
}

function mapRisk(r: string): 'BAJO' | 'MODERADO' | 'ELEVADO' | 'ALTO' {
  if (r === 'danger')  return 'ALTO'
  if (r === 'warning') return 'ELEVADO'
  if (r === 'safe')    return 'BAJO'
  return 'MODERADO'
}