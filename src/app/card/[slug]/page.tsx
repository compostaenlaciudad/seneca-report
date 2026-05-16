import { notFound } from 'next/navigation'
import { getPoliticianBySlug } from '@/lib/supabase-queries'

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPoliticianBySlug(slug)
  if (!p) notFound()

  const topFlag = p.flags[0]
  const scoreColor =
    p.score >= 70 ? '#15803d' :
    p.score >= 45 ? '#d97706' :
    '#dc2626'

  const riskBg =
    p.risk === 'BAJO'     ? '#dcfce7' :
    p.risk === 'MODERADO' ? '#fef3c7' :
    '#fee2e2'

  const riskColor =
    p.risk === 'BAJO'     ? '#15803d' :
    p.risk === 'MODERADO' ? '#d97706' :
    '#dc2626'

  return (
    <div style={{
      width: 1200,
      height: 630,
      background: '#ffffff',
      fontFamily: 'Georgia, serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Top accent bar */}
      <div style={{
        height: 6,
        background: scoreColor,
        width: '100%',
      }} />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 0,
      }}>

        {/* Left column */}
        <div style={{
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>

          {/* Header */}
          <div>
            {/* Kicker */}
            <div style={{
              fontSize: 12,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: 16,
            }}>
              {p.party} · {p.state} · Expediente verificado
            </div>

            {/* Name */}
            <div style={{
              fontSize: 52,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              marginBottom: 8,
            }}>
              {p.name}
            </div>

            {/* Role */}
            <div style={{
              fontSize: 16,
              fontFamily: 'system-ui, sans-serif',
              color: '#64748b',
              marginBottom: 32,
            }}>
              {p.role}
            </div>

            {/* Top flag */}
            {topFlag && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #dc2626',
                borderRadius: 10,
                padding: '16px 20px',
                maxWidth: 580,
              }}>
                <div style={{
                  fontSize: 11,
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#dc2626',
                  marginBottom: 8,
                }}>
                  ▲ Alerta crítica documentada
                </div>
                <div style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: 6,
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  {topFlag.title}
                </div>
                <div style={{
                  fontSize: 14,
                  fontFamily: 'system-ui, sans-serif',
                  color: '#334155',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {topFlag.body}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{
              fontSize: 13,
              fontFamily: 'system-ui, sans-serif',
              color: '#94a3b8',
            }}>
              Datos verificados · Fuentes citadas · Sin patrocinadores
            </div>
            <div style={{
              fontSize: 14,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 700,
              color: '#1d4ed8',
              letterSpacing: '0.02em',
            }}>
              seneca.report
            </div>
          </div>
        </div>

        {/* Right column — score panel */}
        <div style={{
          background: '#f8fafc',
          borderLeft: '1px solid #e2e8f0',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>

          {/* Portrait */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 500,
            color: '#64748b',
          }}>
            {p.photo}
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 11,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: 8,
            }}>
              Índice Séneca
            </div>
            <div style={{
              fontSize: 96,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: scoreColor,
            }}>
              {p.score}
            </div>
            <div style={{
              fontSize: 14,
              fontFamily: 'system-ui, sans-serif',
              color: '#94a3b8',
              marginTop: 4,
            }}>
              de 100
            </div>
          </div>

          {/* Risk pill */}
          <div style={{
            background: riskBg,
            color: riskColor,
            fontSize: 13,
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '8px 20px',
            borderRadius: 999,
            border: `1px solid ${riskColor}`,
          }}>
            Riesgo {p.risk.toLowerCase()}
          </div>

          {/* Dimensions mini */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {p.dimensions.slice(0, 5).map((d) => {
              const dimColor =
                d.score >= 70 ? '#15803d' :
                d.score >= 45 ? '#d97706' :
                '#dc2626'
              const shortLabel = (d.label ?? d.key).split(' ')[0]
              return (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    fontSize: 10,
                    fontFamily: 'system-ui, sans-serif',
                    color: '#94a3b8',
                    width: 80,
                    flexShrink: 0,
                  }}>
                    {shortLabel}
                  </div>
                  <div style={{
                    flex: 1,
                    height: 4,
                    background: '#e2e8f0',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${d.score}%`,
                      background: dimColor,
                      borderRadius: 2,
                    }} />
                  </div>
                  <div style={{
                    fontSize: 10,
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 600,
                    color: dimColor,
                    width: 24,
                    textAlign: 'right',
                  }}>
                    {d.score}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}