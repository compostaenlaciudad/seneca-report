import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS })
}

export async function POST(request: NextRequest) {
  try {
    const { claim, politician_slug, context } = await request.json()

    if (!claim || claim.trim().length < 10) {
      return NextResponse.json(
        { error: 'La declaración es demasiado corta para verificar.' },
        { status: 400, headers: CORS }
      )
    }

    const supabase = await createServerSupabaseClient()

    // If we have a politician slug, fetch their record for context
    let politicianContext = ''
    let profileUrl = 'https://seneca-report.vercel.app/buscar'

    if (politician_slug) {
      const { data } = await supabase
        .from('candidates')
        .select(`
          name, party, state, current_position, summary_es, seneca_score, risk_level,
          flags ( type, description, severity, source_url, date ),
          score_dimensions ( name, score, reasoning )
        `)
        .eq('slug', politician_slug)
        .single()

      if (data) {
        profileUrl = `https://seneca-report.vercel.app/candidatos/${politician_slug}`
        politicianContext = `
EXPEDIENTE SÉNECA — ${data.name}
Partido: ${data.party} · Estado: ${data.state}
Cargo: ${data.current_position}
Índice Séneca: ${data.seneca_score}/100
Resumen: ${data.summary_es}

ALERTAS DOCUMENTADAS:
${(data.flags ?? []).map((f: any) =>
  `- [${f.severity.toUpperCase()}] ${f.type}: ${f.description} (Fuente: ${f.source_url})`
).join('\n')}

DIMENSIONES:
${(data.score_dimensions ?? []).map((d: any) =>
  `- ${d.name}: ${d.score * 5}/100 — ${d.reasoning}`
).join('\n')}
`
      }
    }

    // Call Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Eres el sistema de verificación de SÉNECA, plataforma de transparencia política mexicana no partidista.

Tu tarea: verificar si la siguiente declaración pública de un político mexicano es consistente con su expediente documentado.

DECLARACIÓN A VERIFICAR:
"${claim}"

${politicianContext ? `EXPEDIENTE DISPONIBLE:\n${politicianContext}` : 'No hay expediente específico disponible. Usa tu conocimiento general sobre política mexicana.'}

CONTEXTO ADICIONAL: ${context ?? 'Declaración encontrada en redes sociales'}

Responde ÚNICAMENTE con un JSON válido sin texto adicional ni backticks:
{
  "verdict": "CONSISTENTE" | "INCONSISTENTE" | "SIN_VERIFICAR",
  "confidence": "ALTA" | "MEDIA" | "BAJA",
  "summary": "Una oración directa sobre si la declaración es verdadera o falsa",
  "contradictions": [
    {
      "claim": "Lo que dice el político",
      "reality": "Lo que documenta el expediente",
      "source": "URL o descripción de la fuente"
    }
  ],
  "verdict_es": "Veredicto en español para mostrar al usuario (máx 10 palabras)"
}`
          }
        ],
      }),
    })

    const aiData = await response.json()
    console.log('Claude raw response:', JSON.stringify(aiData))
    const text = aiData.content?.[0]?.text ?? '{}'

    let result
    try {
      // Strip markdown backticks if Claude wrapped the JSON
      const clean = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()
      result = JSON.parse(clean)
    } catch {
      // Log the raw text to debug
      console.error('JSON parse failed. Raw text:', text)
      result = {
        verdict: 'SIN_VERIFICAR',
        confidence: 'BAJA',
        summary: 'No se pudo procesar la verificación.',
        contradictions: [],
        verdict_es: 'No verificado',
      }
    }

    return NextResponse.json(
      { ...result, profileUrl, claim },
      { headers: CORS }
    )
  } catch (error) {
    console.error('Verificar error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500, headers: CORS }
    )
  }
}