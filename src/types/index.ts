export type RiskLevel = 'danger' | 'warning' | 'safe' | 'neutral'

export type ScoreDimension = {
  id: string
  candidate_id: string
  name: 'integridad_filosofica' | 'coherencia_hechos' | 'transparencia_patrimonial' | 'rendicion_cuentas' | 'independencia_poder'
  score: number // 0-20
  reasoning: string
  sources: string[]
  updated_at: string
}

export type Flag = {
  id: string
  candidate_id: string
  type: 'conflict_of_interest' | 'asset_discrepancy' | 'sanction' | 'broken_promise' | 'legal_proceeding'
  description: string
  severity: RiskLevel
  source_url: string
  date: string
}

export type Candidate = {
  id: string
  slug: string
  name: string
  photo_url?: string
  party: string
  state: string
  office_sought: string // "Diputado Federal", "Senador", etc.
  office_requirements: string[] // what the law requires for this office
  seneca_score: number // 0-100, sum of 5 dimensions
  risk_level: RiskLevel
  bio: string
  current_position?: string
  years_in_politics: number
  education: Education[]
  score_dimensions: ScoreDimension[]
  flags: Flag[]
  sources: Source[]
  last_updated: string
}

export type Education = {
  institution: string
  degree: string
  field: string
  year?: number
  verified: boolean
}

export type Source = {
  id: string
  candidate_id: string
  type: 'official_record' | 'legislative_vote' | 'public_statement' | 'judicial' | 'campaign_finance' | 'verified_press'
  title: string
  url: string
  date: string
  excerpt?: string
}

export type SearchResult = Pick<Candidate, 'id' | 'slug' | 'name' | 'party' | 'state' | 'office_sought' | 'seneca_score' | 'risk_level' | 'photo_url' | 'flags'>