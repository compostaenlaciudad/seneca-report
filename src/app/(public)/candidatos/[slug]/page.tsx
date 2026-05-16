import { notFound } from 'next/navigation';

import { getPoliticianBySlug } from '@/lib/supabase-queries'
import { fmtMxn, pillKindForRisk } from '@/lib/utils';
import type { Politician } from '@/lib/types';

import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { DimensionBars } from '@/components/dimension-bars';
import { FlagCard } from '@/components/flag-card';
import { PortraitSlot } from '@/components/portrait-slot';

const TABS = [
  'Resumen',
  'Dimensiones',
  'Patrimonio',
  'Trayectoria',
  'Votos',
  'Alertas',
  'Fuentes',
];

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const p = await getPoliticianBySlug(slug)
    if (!p) notFound()

  const criticalCount = p.flags.filter((f) => f.severity === 'A').length;
  const graveCount    = p.flags.filter((f) => f.severity === 'B').length;
  const minorCount    = p.flags.filter((f) => f.severity === 'C').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Buscar" />

      {/* breadcrumb */}
      <div
        style={{
          padding: '12px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Mono size={11} color="var(--muted)">Expedientes</Mono>
        <Mono size={11} color="var(--muted)">/</Mono>
        <Mono size={11} color="var(--muted)">Senado · MX</Mono>
        <Mono size={11} color="var(--muted)">/</Mono>
        <Mono size={11} color="var(--text)">{p.name.split(' ').slice(0, 2).join(' ')}</Mono>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['Compartir', 'PDF', 'Citar', 'Comparar'].map((b) => (
            <button
              key={b}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-2)',
                padding: '5px 10px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'transparent',
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* hero band */}
      <section
        style={{
          padding: '32px 28px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '120px 1fr 200px',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <PortraitSlot initials={p.photo} size={120} radius={14} />

          <div>
            <Kicker>{p.party} · {p.state} · Senado</Kicker>
            <h1
              className="serif"
              style={{
                fontSize: 44,
                lineHeight: 1.05,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.025em',
                margin: '8px 0',
              }}
            >
              {p.name}
            </h1>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12 }}>
              {p.role} · Nacido {p.born}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.flags.length > 0 && <Pill kind="flag">{p.flags.length} alertas activas</Pill>}
              <Pill>{p.sourceCount} fuentes</Pill>
              <Pill>Verificado por 2 revisores</Pill>
              <Pill>Actualizado {p.lastUpdated}</Pill>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScoreDial value={p.score} size={140} />
            <div style={{ marginTop: 10 }}>
              <Pill kind={pillKindForRisk(p.risk)}>Riesgo {p.risk.toLowerCase()}</Pill>
            </div>
          </div>
        </div>
      </section>

      {/* tabs */}
      <div style={{ padding: '0 28px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 4 }}>
        {TABS.map((tb, i) => {
          const active = i === 0;
          const count =
            tb === 'Alertas'  ? ` (${p.flags.length})`     :
            tb === 'Fuentes'  ? ` (${p.sourceCount})`      : '';
          return (
            <div
              key={tb}
              style={{
                padding: '12px 14px',
                borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                fontSize: 13,
                fontWeight: 500,
                color: active ? 'var(--accent)' : 'var(--text-2)',
              }}
            >
              {tb}{count}
            </div>
          );
        })}
      </div>

      {/* body */}
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '32px 28px',
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 32,
        }}
      >
        {/* main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Alerts */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <Kicker>Alertas activas · {p.flags.length}</Kicker>
                <h2
                  className="serif"
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--text)',
                    letterSpacing: '-0.015em',
                    marginTop: 6,
                  }}
                >
                  Inconsistencias documentadas
                </h2>
              </div>
              <Mono size={11} color="var(--muted)">
                {criticalCount} crítica · {graveCount} grave · {minorCount} menor
              </Mono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.flags.map((f, i) => (
                <FlagCard key={i} flag={f} />
              ))}
            </div>
          </section>

          {/* Patrimony chart */}
          <PatrimonySection p={p} />

          {/* Dimensions detail */}
          <section
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 24,
              background: 'var(--bg)',
            }}
          >
            <Kicker>Las cinco dimensiones</Kicker>
            <h2
              className="serif"
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.015em',
                margin: '6px 0 20px',
              }}
            >
              Detalle del índice
            </h2>
            <DimensionBars dimensions={p.dimensions} />
          </section>
        </div>

        {/* right rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <RailCard title="Trayectoria">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.timeline.map((tl, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <Mono size={11} color="var(--muted)">{tl.year}</Mono>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{tl.evt}</div>
                    <Mono size={10} color="var(--muted)">{tl.org}</Mono>
                  </div>
                </div>
              ))}
            </div>
          </RailCard>

          <RailCard title="Formación">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.education.map((e, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{e.deg}</div>
                    {e.verified && (
                      <span
                        className="mono"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          fontSize: 9,
                          fontWeight: 500,
                          color: 'var(--ok)',
                          background: 'var(--ok-bg)',
                          padding: '1px 5px',
                          borderRadius: 3,
                        }}
                      >
                        ✓ ok
                      </span>
                    )}
                  </div>
                  <Mono size={10} color="var(--muted)">{e.inst} · {e.year}</Mono>
                </div>
              ))}
            </div>
          </RailCard>

          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              background: 'var(--surface)',
            }}
          >
            <Kicker>Nota editorial</Kicker>
            <p
              className="serif"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--text-2)',
                marginTop: 10,
              }}
            >
              Séneca no califica ideologías. Documenta coherencia entre palabra
              y registro. Cada cifra remite a una fuente pública; cada error
              corregido queda en el historial.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, background: 'var(--bg)' }}>
      <Kicker>{title}</Kicker>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function PatrimonySection({ p }: { p: Politician }) {
  if (p.assets.length === 0) return null;
  const max = Math.max(...p.assets.map((a) => a.mxn));
  const first = p.assets[0].mxn;
  const last = p.assets[p.assets.length - 1].mxn;
  const growthPct = Math.round(((last - first) / first) * 100);

  return (
    <section
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        background: 'var(--bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <Kicker>Patrimonio declarado · MXN</Kicker>
          <h2
            className="serif"
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: 'var(--text)',
              letterSpacing: '-0.015em',
              marginTop: 6,
            }}
          >
            +{growthPct}% en {p.assets.length - 1} años
          </h2>
        </div>
        <Pill kind="flag">▲ Anomalía {p.assets[p.assets.length - 1].year}</Pill>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${p.assets.length}, 1fr)`,
          gap: 10,
          alignItems: 'flex-end',
          height: 180,
        }}
      >
        {p.assets.map((a, i) => {
          const pct = (a.mxn / max) * 100;
          const isLast = i === p.assets.length - 1;
          return (
            <div key={a.year} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <Mono
                size={10}
                color={isLast ? 'var(--flag)' : 'var(--text-2)'}
                style={{ marginBottom: 6, textAlign: 'center' }}
              >
                {fmtMxn(a.mxn)}
              </Mono>
              <div
                style={{
                  height: `${pct}%`,
                  background: isLast ? 'var(--flag)' : 'var(--text-2)',
                  borderRadius: '6px 6px 0 0',
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${p.assets.length}, 1fr)`,
          gap: 10,
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        {p.assets.map((a) => (
          <Mono key={a.year} size={10} color="var(--muted)" style={{ textAlign: 'center' }}>
            {a.year}
          </Mono>
        ))}
      </div>
      <Mono size={10} color="var(--muted)" style={{ marginTop: 14, display: 'block' }}>
        Fuente: Declaranet {p.assets[0].year}–{p.assets[p.assets.length - 1].year} · Catastro CDMX · cruce automatizado
      </Mono>
    </section>
  );
}
