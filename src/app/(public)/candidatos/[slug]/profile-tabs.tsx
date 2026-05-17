'use client'

import { useState } from 'react'
import type { Politician } from '@/lib/types'
import { Kicker, Mono } from '@/components/typography'
import { Pill } from '@/components/pill'
import { DimensionBars } from '@/components/dimension-bars'
import { FlagCard } from '@/components/flag-card'
import { fmtMxn, scoreColor } from '@/lib/utils'

const TABS = ['Resumen', 'Dimensiones', 'Patrimonio', 'Trayectoria', 'Votos', 'Alertas', 'Fuentes']

export function ProfileTabs({ p }: { p: Politician }) {
  const [active, setActive] = useState('Resumen')

  const criticalCount = p.flags.filter((f) => f.severity === 'A').length
  const graveCount    = p.flags.filter((f) => f.severity === 'B').length
  const minorCount    = p.flags.filter((f) => f.severity === 'C').length

  return (
    <>
      {/* tabs nav */}
      <div style={{
        padding: '0 28px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
      }}>
        {TABS.map((tb) => {
          const isActive = tb === active
          const count =
            tb === 'Alertas' ? ` (${p.flags.length})` :
            tb === 'Fuentes' ? ` (${p.sourceCount})`  : ''
          return (
            <button
              key={tb}
              onClick={() => setActive(tb)}
              style={{
                padding: '12px 14px',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                background: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tb}{count}
            </button>
          )
        })}
      </div>

      {/* tab content */}
      <div style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '32px 28px',
        display: 'grid',
        gridTemplateColumns: active === 'Resumen' ? '1fr 320px' : '1fr',
        gap: 32,
      }}>

        {/* ── RESUMEN ── */}
        {active === 'Resumen' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <section>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <Kicker>Alertas activas · {p.flags.length}</Kicker>
                    <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.015em', marginTop: 6 }}>
                      Inconsistencias documentadas
                    </h2>
                  </div>
                  <Mono size={11} color="var(--muted)">
                    {criticalCount} crítica · {graveCount} grave · {minorCount} menor
                  </Mono>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.flags.map((f, i) => <FlagCard key={i} flag={f} />)}
                </div>
              </section>

              <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: 'var(--bg)' }}>
                <Kicker>Las cinco dimensiones</Kicker>
                <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.015em', margin: '6px 0 20px' }}>
                  Detalle del índice
                </h2>
                <DimensionBars dimensions={p.dimensions} />
              </section>
            </div>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {p.timeline.length > 0 && (
                <RailCard title="Trayectoria">
                  {p.timeline.map((tl, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <Mono size={11} color="var(--muted)">{tl.year}</Mono>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{tl.evt}</div>
                        <Mono size={10} color="var(--muted)">{tl.org}</Mono>
                      </div>
                    </div>
                  ))}
                </RailCard>
              )}

              {p.education.length > 0 && (
                <RailCard title="Formación">
                  {p.education.map((e, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{e.deg}</div>
                        {e.verified && (
                          <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--ok)', background: 'var(--ok-bg)', padding: '1px 5px', borderRadius: 3 }}>✓ ok</span>
                        )}
                      </div>
                      <Mono size={10} color="var(--muted)">{e.inst} · {e.year}</Mono>
                    </div>
                  ))}
                </RailCard>
              )}

              <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, background: 'var(--surface)' }}>
                <Kicker>Nota editorial</Kicker>
                <p className="serif" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-2)', marginTop: 10 }}>
                  Séneca no califica ideologías. Documenta coherencia entre palabra y registro. Cada cifra remite a una fuente pública; cada error corregido queda en el historial.
                </p>
              </div>
            </aside>
          </>
        )}

        {/* ── DIMENSIONES ── */}
        {active === 'Dimensiones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <Kicker>Índice Séneca · Metodología</Kicker>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '8px 0 6px' }}>
                Las cinco dimensiones
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 600 }}>
                El Índice Séneca evalúa a cada político en cinco dimensiones de integridad pública. Cada dimensión se califica de 0 a 100 basándose en registros públicos verificables.
              </p>
            </div>

            {p.dimensions.map((d) => {
              const color = scoreColor(d.score)
              return (
                <div key={d.key} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: 'var(--bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{d.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Mono size={36} color={color} style={{ fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {d.score}
                    </Mono>
                    <Mono size={13} color="var(--muted)" style={{ fontWeight: 400 }}>/100</Mono>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${d.score}%`, background: color, borderRadius: 4, transition: 'width 800ms ease' }} />
                  </div>
                  {d.note && (
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{d.note}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── PATRIMONIO ── */}
        {active === 'Patrimonio' && (
          <div>
            {p.assets.length > 0 ? (
              <PatrimonySection p={p} />
            ) : (
              <EmptyTab
                title="Sin datos patrimoniales"
                description="No se han registrado declaraciones patrimoniales verificadas para este político. Los datos se actualizan cuando la información está disponible en Declaranet."
              />
            )}
          </div>
        )}

        {/* ── TRAYECTORIA ── */}
        {active === 'Trayectoria' && (
          <div>
            {p.timeline.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Kicker>Historial público</Kicker>
                <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '8px 0 24px' }}>
                  Trayectoria política
                </h2>
                {p.timeline.map((tl, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, paddingBottom: 24, borderLeft: '2px solid var(--border)', paddingLeft: 24, marginLeft: 40, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -6, top: 4, width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)' }} />
                    <Mono size={12} color="var(--muted)">{tl.year}</Mono>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{tl.evt}</div>
                      <Mono size={11} color="var(--muted)">{tl.org}</Mono>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyTab
                title="Sin trayectoria registrada"
                description="La trayectoria política de este funcionario está siendo documentada. Los datos se actualizan periódicamente."
              />
            )}
          </div>
        )}

        {/* ── VOTOS ── */}
        {active === 'Votos' && (
          <EmptyTab
            title="Registro de votaciones"
            description="El historial de votaciones en pleno está siendo integrado desde las actas oficiales de la Cámara de Diputados y el Senado de la República. Próximamente disponible."
          />
        )}

        {/* ── ALERTAS ── */}
        {active === 'Alertas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <Kicker>Alertas activas · {p.flags.length}</Kicker>
                <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '8px 0' }}>
                  Inconsistencias documentadas
                </h2>
              </div>
              <Mono size={11} color="var(--muted)">
                {criticalCount} crítica · {graveCount} grave · {minorCount} menor
              </Mono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.flags.map((f, i) => <FlagCard key={i} flag={f} />)}
            </div>
          </div>
        )}

        {/* ── FUENTES ── */}
        {active === 'Fuentes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <Kicker>Fuentes · {p.sourceCount}</Kicker>
              <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '8px 0 6px' }}>
                Referencias documentales
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 600 }}>
                Todas las alertas y puntuaciones en SÉNECA están respaldadas por fuentes públicas verificables.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.flags.map((f, i) =>
                f.sources?.map((src, j) => src && (
                  <a
                    key={`${i}-${j}`}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      background: 'var(--bg)',
                      textDecoration: 'none',
                      color: 'var(--text)',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace' }}>↗</span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 2 }}>
                        {f.title}
                      </div>
                      <Mono size={10} color="var(--muted)" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {src}
                      </Mono>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>↗</span>
                  </a>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, background: 'var(--bg)' }}>
      <Kicker>{title}</Kicker>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  )
}

function EmptyTab({ title, description }: { title: string; description: string }) {
    return (
      <div style={{ padding: '64px 0', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <Mono size={10} color="var(--muted)" style={{ letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
          Próximamente
        </Mono>
        <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{description}</p>
      </div>
    )
  }

function PatrimonySection({ p }: { p: Politician }) {
  if (p.assets.length === 0) return null
  const max = Math.max(...p.assets.map((a) => a.mxn))
  const first = p.assets[0].mxn
  const last = p.assets[p.assets.length - 1].mxn
  const growthPct = Math.round(((last - first) / first) * 100)

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 24, background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <Kicker>Patrimonio declarado · MXN</Kicker>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.015em', marginTop: 6 }}>
            +{growthPct}% en {p.assets.length - 1} años
          </h2>
        </div>
        <Pill kind="flag">▲ Anomalía {p.assets[p.assets.length - 1].year}</Pill>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.assets.length}, 1fr)`, gap: 10, alignItems: 'flex-end', height: 180 }}>
        {p.assets.map((a, i) => {
          const pct = (a.mxn / max) * 100
          const isLast = i === p.assets.length - 1
          return (
            <div key={a.year} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <Mono size={10} color={isLast ? 'var(--flag)' : 'var(--text-2)'} style={{ marginBottom: 6, textAlign: 'center' }}>
                {fmtMxn(a.mxn)}
              </Mono>
              <div style={{ height: `${pct}%`, background: isLast ? 'var(--flag)' : 'var(--text-2)', borderRadius: '6px 6px 0 0' }} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.assets.length}, 1fr)`, gap: 10, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        {p.assets.map((a) => (
          <Mono key={a.year} size={10} color="var(--muted)" style={{ textAlign: 'center' }}>{a.year}</Mono>
        ))}
      </div>
    </section>
  )
}