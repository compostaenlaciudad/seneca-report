'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';

import type { Politician } from '@/lib/types';
import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { DimensionBars } from '@/components/dimension-bars';
import { PortraitSlot } from '@/components/portrait-slot';

const HOW_IT_WORKS = [
  ['01', 'Coherencia discursiva',  'Posiciones públicas vs. votos en pleno'],
  ['02', 'Coherencia patrimonial', 'Declaraciones 3-de-3 vs. registros'],
  ['03', 'Asistencia y votación',  'Presencia y razonamiento de voto'],
  ['04', 'Transparencia',          'Solicitudes de información atendidas'],
  ['05', 'Conflictos de interés',  'Vínculos económicos y familiares'],
] as const;

const INSTALL_STEPS = [
  ['01', 'Descarga', 'Descarga el archivo ZIP de la extensión'],
  ['02', 'Descomprime', 'Descomprime el archivo en cualquier carpeta'],
  ['03', 'Activa', 'Abre chrome://extensions y activa "Modo desarrollador"'],
  ['04', 'Carga', 'Haz clic en "Cargar sin empaquetar" y selecciona la carpeta'],
] as const;

const SENECA_QUOTES = [
  '"Nusquam est qui ubique est." — El que está en todas partes, no está en ninguna.',
  '"Omnia aliena sunt, tempus tantum nostrum est." — Todo es ajeno; solo el tiempo es nuestro.',
  '"Inimica est multorum conversatio." — La compañía de muchos es enemiga del bien.',
  '"Recede in te ipse." — Retírate dentro de ti mismo.',
]

function getSenecaFilter(risk: string): string {
  if (risk === 'ALTO')     return 'sepia(0.4) saturate(2.5) hue-rotate(-20deg) brightness(0.88) contrast(1.15)'
  if (risk === 'ELEVADO')  return 'sepia(0.2) saturate(1.4) hue-rotate(-10deg) brightness(0.92)'
  if (risk === 'BAJO')     return 'sepia(0.1) saturate(1.1) brightness(1.08) hue-rotate(10deg)'
  return 'sepia(0.05) brightness(1.02)'
}

function getSenecaMood(risk: string): string {
  if (risk === 'ALTO')    return 'Indignado'
  if (risk === 'ELEVADO') return 'Preocupado'
  if (risk === 'BAJO')    return 'Esperanzado'
  return 'Vigilante'
}

export function LandingClient({ politicians }: { politicians: Politician[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const featured = politicians.find(p => p.slug === 'ruben-rocha-moya') ?? politicians[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(i => (i + 1) % SENECA_QUOTES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
  }

  const senecaFilter = featured ? getSenecaFilter(featured.risk) : 'none'
  const senecaMood = featured ? getSenecaMood(featured.risk) : 'Vigilante'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Buscar" />

      {/* Hero */}
      <section style={{ padding: '72px 28px 56px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 48,
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <Pill>
                <span style={{ width: 6, height: 6, background: 'var(--ok)', borderRadius: '50%' }} />
                Activo · {politicians.length} expedientes públicos
              </Pill>
              <Pill>Open source · CC BY-SA</Pill>
            </div>

            <h1
              className="serif"
              style={{
                fontSize: 72,
                lineHeight: 0.96,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.025em',
                margin: '0 0 20px',
              }}
            >
              El expediente que tus políticos<br />
              <span style={{ color: 'var(--accent)' }}>no quieren que leas.</span>
            </h1>

            <p style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--text-2)',
              maxWidth: 520,
              marginBottom: 36,
            }}>
              Cada semana, millones de mexicanos toman decisiones políticas
              basadas en publicidad disfrazada de información. Séneca existe
              para que eso cambie. Datos verificados, fuentes citadas, sin
              patrocinadores.{' '}
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                El antídoto al algoritmo.
              </span>
            </p>

            {/* Search */}
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', alignItems: 'center', maxWidth: 560, gap: 8 }}
            >
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid var(--border-2)',
                borderRadius: 10,
                padding: '14px 16px',
                background: 'var(--bg)',
                boxShadow: '0 1px 0 rgba(0,0,0,0.02)',
              }}>
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx={7} cy={7} r={5} stroke="var(--muted)" strokeWidth={1.5} />
                  <path d="M11 11 L14 14" stroke="var(--muted)" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar político por nombre, partido o estado…"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--text)',
                    fontSize: 15,
                    fontFamily: 'inherit',
                  }}
                />
                <Mono
                  size={10}
                  color="var(--muted)"
                  style={{ padding: '3px 6px', border: '1px solid var(--border)', borderRadius: 4 }}
                >
                  ⌘K
                </Mono>
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '14px 22px',
                  borderRadius: 10,
                }}
              >
                Buscar
              </button>
            </form>

            {/* Suggestions */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Mono size={10} color="var(--muted)">Sugerencias</Mono>
              {politicians.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setQ(p.name.split(' ').slice(0, 2).join(' '))}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-2)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Séneca bust */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Mood indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 999,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: featured?.risk === 'ALTO' ? '#dc2626' : featured?.risk === 'ELEVADO' ? '#d97706' : '#16a34a' }} />
              <Mono size={9} color="var(--muted)">Estado: {senecaMood}</Mono>
            </div>

            {/* The bust */}
            <div style={{ position: 'relative' }}>
              <img
                src="/seneca-neutral.png"
                alt="Séneca"
                style={{
                  width: 300,
                  height: 300,
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  borderRadius: 16,
                  filter: senecaFilter,
                  transition: 'filter 1200ms ease',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              />
              {/* Subtle vignette overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 16,
                background: 'linear-gradient(to bottom, transparent 60%, var(--bg) 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Rotating Seneca quote */}
            <div style={{
              maxWidth: 300,
              textAlign: 'center',
              padding: '12px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}>
              <p style={{
                fontSize: 11,
                lineHeight: 1.6,
                color: 'var(--text-2)',
                fontStyle: 'italic',
                transition: 'opacity 500ms ease',
              }}>
                {SENECA_QUOTES[quoteIdx]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extension install section */}
      <section style={{ padding: '0 28px 64px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 14,
          background: 'var(--surface)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            padding: '24px 28px',
            borderBottom: '1px solid var(--border)',
            gap: 24,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  background: '#1d4ed8',
                  borderRadius: 6,
                  fontSize: 16,
                  color: '#fff',
                }}>⚖</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                    SÉNECA — Escudo político
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                    Extensión para Chrome · Arc · Brave · Edge · Gratis · Código abierto
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, maxWidth: 560 }}>
                Detecta políticos mexicanos en cualquier página web — incluyendo Facebook, Twitter y sitios de noticias —
                y muestra su expediente verificado en tiempo real. Sin registro. Sin suscripción.
              </p>
            </div>
            <a
              href="/seneca-extension.zip"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#1d4ed8',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 20px',
                borderRadius: 8,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              } as React.CSSProperties}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Descargar extensión
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}>
            {INSTALL_STEPS.map(([n, label, desc], i) => (
              <div key={n} style={{
                padding: '20px 22px',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#1d4ed8',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    flexShrink: 0,
                  }}>{n}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text)',
                    letterSpacing: '0.02em',
                  }}>{label}</span>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--text-2)', margin: 0 }}>
                  {n === '03' ? (
                    <>Abre{' '}
                      <code style={{
                        fontSize: 11,
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 3,
                        padding: '1px 4px',
                        fontFamily: 'monospace',
                      }}>chrome://extensions</code>
                      {' '}y activa{' '}
                      <strong style={{ color: 'var(--text)' }}>"Modo desarrollador"</strong>
                    </>
                  ) : n === '04' ? (
                    <>Haz clic en{' '}
                      <strong style={{ color: 'var(--text)' }}>"Cargar sin empaquetar"</strong>
                      {' '}y selecciona la carpeta descargada
                    </>
                  ) : desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 28px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Mono size={10} color="var(--muted)">
              ✓ Sin registro · ✓ Sin acceso a tus datos · ✓ Código abierto en GitHub
            </Mono>
            <Mono size={10} color="var(--muted)">
              Próximamente en Chrome Web Store
            </Mono>
          </div>
        </div>
      </section>

      {/* Featured dossier card */}
      {featured && (
        <section style={{ padding: '0 28px 64px', maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <Kicker>Expediente destacado</Kicker>
            <Mono size={10} color="var(--muted)">Actualizado {featured.lastUpdated}</Mono>
          </div>

          <article style={{
            border: '1px solid var(--border)',
            borderRadius: 14,
            background: 'var(--bg)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '320px 1fr 280px',
          }}>
            <div style={{
              background: 'var(--surface)',
              padding: '32px 28px',
              borderRight: '1px solid var(--border)',
            }}>
              <div style={{ marginBottom: 18 }}>
                <PortraitSlot initials={featured.photo} size={96} />
              </div>
              <h3 className="serif" style={{
                fontSize: 24,
                lineHeight: 1.15,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.015em',
                marginBottom: 4,
              }}>
                {featured.name}
              </h3>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
                {featured.role} · {featured.party} · {featured.state}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Pill kind="flag">{featured.flags.length} alertas activas</Pill>
                <Pill>{featured.sourceCount} fuentes</Pill>
              </div>
            </div>

            <div style={{ padding: '32px 28px' }}>
              <Kicker>Síntesis</Kicker>
              <p style={{
                fontSize: 15,
                lineHeight: 1.55,
                color: 'var(--text-2)',
                marginTop: 12,
                marginBottom: 18,
              }}>
                {featured.flags[0]?.body ?? 'Perfil con datos verificados disponibles.'}
              </p>
              <DimensionBars dimensions={featured.dimensions} compact />
              <Link
                href={`/candidatos/${featured.slug}`}
                style={{
                  marginTop: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--accent)',
                }}
              >
                Abrir expediente completo
                <span>→</span>
              </Link>
            </div>

            <div style={{
              background: 'var(--surface)',
              padding: '32px 24px',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Kicker>Índice Séneca</Kicker>
              <div style={{ margin: '14px 0' }}>
                <ScoreDial value={featured.score} size={150} />
              </div>
              <Pill kind="warn">Riesgo {featured.risk.toLowerCase()}</Pill>
            </div>
          </article>
        </section>
      )}

      {/* How it works */}
      <section style={{ padding: '0 28px 96px', maxWidth: 1080, margin: '0 auto' }}>
        <Kicker>Cómo funciona</Kicker>
        <h2 className="serif" style={{
          fontSize: 36,
          lineHeight: 1.1,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          margin: '10px 0 28px',
        }}>
          Cinco dimensiones. Una sola pregunta.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {HOW_IT_WORKS.map(([n, label, sub]) => (
            <div key={n} style={{
              padding: '20px 18px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              background: 'var(--bg)',
            }}>
              <Mono size={11} color="var(--muted)">{n}</Mono>
              <div style={{
                fontSize: 14,
                lineHeight: 1.3,
                fontWeight: 500,
                color: 'var(--text)',
                marginTop: 10,
                marginBottom: 6,
              }}>
                {label}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface)',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <Mono size={11} color="var(--muted)">
          SÉNECA · Lucius Annaeus, 4 a.C. – 65 d.C.
        </Mono>
        <div style={{ display: 'flex', gap: 18 }}>
          {['Metodología', 'Fuentes', 'API', 'GitHub', 'Reportar error'].map((l) => (
            <span key={l} style={{ fontSize: 12, color: 'var(--text-2)' }}>{l}</span>
          ))}
        </div>
        <Mono size={10} color="var(--muted)">β · MX · Open source</Mono>
      </footer>
    </div>
  );
}