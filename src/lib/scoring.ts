import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type ScoringInput = {
  name: string
  party: string
  office_sought: string
  education: string
  years_in_politics: number
  asset_declarations: string // raw text from Declaranet
  voting_record?: string
  public_statements?: string
  sanctions?: string
  campaign_finance?: string
}

export type ScoringOutput = {
  total_score: number
  dimensions: {
    integridad_filosofica: { score: number; reasoning: string; sources: string[] }
    coherencia_hechos: { score: number; reasoning: string; sources: string[] }
    transparencia_patrimonial: { score: number; reasoning: string; sources: string[] }
    rendicion_cuentas: { score: number; reasoning: string; sources: string[] }
    independencia_poder: { score: number; reasoning: string; sources: string[] }
  }
  flags: Array<{
    type: string
    description: string
    severity: 'danger' | 'warning' | 'safe' | 'neutral'
    source: string
  }>
  summary_es: string
  summary_en: string
}

const SCORING_PROMPT = `You are a non-partisan political analyst for SENECA, a civic transparency platform.
Analyze the following verified data about a Mexican politician and score them on 5 dimensions (0-20 each).

CRITICAL RULES:
- Base scores ONLY on provided data. If data is missing, score conservatively (8-10 out of 20).
- Do NOT penalize ideology. A conservative and a progressive can both score 20.
- Cite the specific data point that justifies each score.
- Return ONLY valid JSON. No preamble, no markdown, no explanation outside the JSON.

DIMENSIONS:
1. integridad_filosofica (0-20): Consistency between stated values and documented life choices
2. coherencia_hechos (0-20): Campaign promises vs documented legislative/executive actions
3. transparencia_patrimonial (0-20): Asset declaration completeness, plausibility, consistency over time
4. rendicion_cuentas (0-20): Response to oversight, criticism, media requests, public scrutiny
5. independencia_poder (0-20): Financial and political independence from concentrated interests

OUTPUT FORMAT (strict JSON):
{
  "total_score": number,
  "dimensions": {
    "integridad_filosofica": { "score": number, "reasoning": "string", "sources": ["string"] },
    "coherencia_hechos": { "score": number, "reasoning": "string", "sources": ["string"] },
    "transparencia_patrimonial": { "score": number, "reasoning": "string", "sources": ["string"] },
    "rendicion_cuentas": { "score": number, "reasoning": "string", "sources": ["string"] },
    "independencia_poder": { "score": number, "reasoning": "string", "sources": ["string"] }
  },
  "flags": [
    { "type": "string", "description": "string", "severity": "danger|warning|neutral", "source": "string" }
  ],
  "summary_es": "2-3 sentence neutral summary in Spanish",
  "summary_en": "2-3 sentence neutral summary in English"
}`

export async function scoreCandidateWithClaude(input: ScoringInput): Promise<ScoringOutput> {
  const candidateData = JSON.stringify(input, null, 2)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${SCORING_PROMPT}\n\nCANDIDATE DATA:\n${candidateData}`
      }
    ]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as ScoringOutput
}