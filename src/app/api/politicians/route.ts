import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const FLAG_TYPE_MAP: Record<string, string> = {
  conflict_of_interest: 'Conflicto de interés',
  asset_discrepancy:    'Inconsistencia patrimonial',
  legal_proceeding:     'Proceso legal documentado',
  broken_promise:       'Promesa incumplida',
  sanction:             'Sanción oficial',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase().trim()

  if (!q || q.length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    )
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('candidates')
    .select(`
      id,
      slug,
      name,
      party,
      state,
      current_position,
      seneca_score,
      risk_level,
      summary_es,
      flags (
        type,
        description,
        severity,
        source_url
      ),
      score_dimensions (
        name,
        score
      )
    `)
    .or(`name.ilike.%${q}%,party.ilike.%${q}%`)
    .order('seneca_score', { ascending: false })
    .limit(5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const politicians = (data ?? []).map(c => {
    const topFlag = (c.flags ?? []).sort((a: any, b: any) => {
      const order = { danger: 0, warning: 1, neutral: 2 }
      return (order[a.severity as keyof typeof order] ?? 2) -
             (order[b.severity as keyof typeof order] ?? 2)
    })[0]

    const scoreColor =
      c.seneca_score >= 70 ? '#15803d' :
      c.seneca_score >= 45 ? '#d97706' :
      '#dc2626'

    return {
      slug: c.slug,
      name: c.name,
      party: c.party,
      state: c.state,
      role: c.current_position ?? '',
      score: c.seneca_score,
      scoreColor,
      risk: mapRisk(c.risk_level),
      riskColor: mapRiskColor(c.risk_level),
      summary: c.summary_es ?? '',
      topFlag: topFlag ? {
        title: FLAG_TYPE_MAP[topFlag.type] ?? topFlag.type.replace(/_/g, ' '),
        body: topFlag.description,
        severity: topFlag.severity,
        source: topFlag.source_url,
      } : null,
      flagCount: (c.flags ?? []).length,
      profileUrl: `https://seneca-report.vercel.app/candidatos/${c.slug}`,
      cardUrl: `https://seneca-report.vercel.app/card/${c.slug}`,
    }
  })

  return NextResponse.json(
    { politicians, query: q, count: politicians.length },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

function mapRisk(r: string): string {
  if (r === 'danger')  return 'ALTO'
  if (r === 'warning') return 'ELEVADO'
  if (r === 'safe')    return 'BAJO'
  return 'MODERADO'
}

function mapRiskColor(r: string): string {
  if (r === 'danger')  return '#dc2626'
  if (r === 'warning') return '#d97706'
  if (r === 'safe')    return '#15803d'
  return '#64748b'
}