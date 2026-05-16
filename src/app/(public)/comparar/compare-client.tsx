'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { DIMENSION_LABELS, pillKindForRisk } from '@/lib/utils';
import type { Politician } from '@/lib/types';

import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { DimensionBars } from '@/components/dimension-bars';
import { PortraitSlot } from '@/components/portrait-slot';

function ComparePageInner({ politicians }: { politicians: Politician[] }) {
  const params = useSearchParams();

  const a = politicians.find(p => p.slug === (params.get('a') ?? '')) ?? politicians[0];
  const b = politicians.find(p => p.slug === (params.get('b') ?? '')) ?? politicians[1];

  const scoreDelta = a.score - b.score;
  const colorA = scoreDelta >= 0 ? 'var(--ok)' : 'var(--flag)';
  const colorB = scoreDelta >= 0 ? 'var(--flag)' : 'var(--ok)';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Comparar" />

      <section style={{ padding: '32px 28px 16px', maxWidth: 1280, margin: '0 auto' }}>
        <Kicker>Comparación lado a lado</Kicker>
        <h1
          className="serif"
          style={{
            fontSize: 40,
            lineHeight: 1,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '10px 0 8px',
          }}
        >
          {a.name.split(' ')[0]} y {b.name.split(' ')[0]}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 640 }}>
          Las diferencias mayores a 20 puntos se marcan en rojo. El delta de
          score no refleja ideología; refleja distancia entre discurso y
          registro documentado.
        </p>

        {/* Candidate selector */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <Mono size={11} color="var(--muted)">Comparar:</Mono>
          {politicians.map(p => (
            <a
            key={p.slug}
            href={`/comparar?a=${a.slug}&b=${p.slug}`}
            style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                border: `1px solid ${b.slug === p.slug ? 'var(--accent)' : 'var(--border)'}`,
                color: b.slug === p.slug ? 'var(--accent)' : 'var(--text-2)',
                background: b.slug === p.slug ? 'var(--accent-bg)' : 'transparent',
            }}
            >
            {p.name.split(' ').slice(0, 2).join(' ')}
            </a>
            ))}
        </div>
      </section>

      <section
        style={{
          padding: '20px 28px 48px',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 120px 1fr',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <CompareColumn p={a} stripeColor={colorA} />

        {/* Delta column */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 14,
            background: 'var(--surface)',
            padding: '24px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Kicker>Delta</Kicker>
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Mono size={9} color="var(--muted)">ÍNDICE</Mono>
            <div
              className="serif"
              style={{
                fontSize: 38,
                lineHeight: 1,
                fontWeight: 500,
                color: scoreDelta >= 0 ? 'var(--ok)' : 'var(--flag)',
                letterSpacing: '-0.02em',
                marginTop: 4,
              }}
            >
              {scoreDelta > 0 ? '+' : ''}{scoreDelta}
            </div>
          </div>
          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: '1px dashed var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {a.dimensions.map((d, i) => {
              const dB = b.dimensions[i];
              if (!dB) return null;
              const delta = d.score - dB.score;
              const color = Math.abs(delta) > 20 ? 'var(--flag)' : 'var(--text-2)';
              const shortLabel = (d.label ?? DIMENSION_LABELS[d.key] ?? d.key).split(' ')[0];
              return (
                <div key={d.key} style={{ textAlign: 'center' }}>
                  <Mono size={9} color="var(--muted)">{shortLabel}</Mono>
                  <div
                    className="mono"
                    style={{ fontSize: 16, fontWeight: 600, color, marginTop: 2 }}
                  >
                    {delta > 0 ? '+' : ''}{delta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CompareColumn p={b} stripeColor={colorB} />
      </section>
    </div>
  );
}

function CompareColumn({ p, stripeColor }: { p: Politician; stripeColor: string }) {
  return (
    <article
      style={{
        border: '1px solid var(--border)',
        borderRadius: 14,
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* identity */}
      <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <PortraitSlot initials={p.photo} size={56} radius={10} />
          <div style={{ flex: 1 }}>
            <Mono size={10} color="var(--muted)">{p.party} · {p.state}</Mono>
            <div
              className="serif"
              style={{
                fontSize: 22,
                lineHeight: 1.1,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: '-0.015em',
                marginTop: 4,
              }}
            >
              {p.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.role}</div>
          </div>
          <div style={{ width: 4, height: 56, background: stripeColor, borderRadius: 2 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <ScoreDial value={p.score} size={100} />
          <div>
            <Pill kind={pillKindForRisk(p.risk)}>Riesgo {p.risk.toLowerCase()}</Pill>
            <div style={{ marginTop: 6 }}>
              <Mono size={10} color="var(--muted)">
                {p.sourceCount} fuentes · {p.flags.length} alertas
              </Mono>
            </div>
          </div>
        </div>
      </div>

      {/* dimensions */}
      <div style={{ padding: '20px 24px' }}>
        <Kicker>Dimensiones</Kicker>
        <div style={{ marginTop: 12 }}>
          <DimensionBars dimensions={p.dimensions} />
        </div>
      </div>

      {/* alerts */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
        <Kicker>Alertas</Kicker>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {p.flags.length === 0 && (
            <Mono size={11} color="var(--muted)">Sin alertas registradas.</Mono>
          )}
          {p.flags.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '10px 12px',
                border: '1px solid var(--flag)',
                borderRadius: 8,
                background: 'var(--flag-bg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <Mono size={10} color="var(--flag)" style={{ flex: '0 0 auto', marginTop: 2 }}>
                SEV {f.severity}
              </Mono>
              <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.35, color: 'var(--text)' }}>
                {f.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function CompareClient({ politicians }: { politicians: Politician[] }) {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mono size={12} color="var(--muted)">Cargando comparación…</Mono>
      </div>
    }>
      <ComparePageInner politicians={politicians} />
    </Suspense>
  );
}