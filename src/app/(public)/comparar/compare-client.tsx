'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useRef, useEffect } from 'react';

import { DIMENSION_LABELS, pillKindForRisk } from '@/lib/utils';
import type { Politician } from '@/lib/types';

import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { PortraitSlot } from '@/components/portrait-slot';

function PoliticianSelector({
  politicians,
  selected,
  onSelect,
  label,
  excludeSlug,
}: {
  politicians: Politician[];
  selected: Politician;
  onSelect: (slug: string) => void;
  label: string;
  excludeSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = excludeSlug
    ? politicians.filter(p => p.slug !== excludeSlug)
    : politicians;

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 200 }}>
      <Mono size={10} color="var(--muted)" style={{ marginBottom: 6 }}>{label}</Mono>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PortraitSlot initials={selected.photo} photoUrl={selected.photoUrl} size={32} radius={6} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              {selected.name.split(' ').slice(0, 2).join(' ')}
            </div>
            <Mono size={10} color="var(--muted)">{selected.party}</Mono>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 100,
          maxHeight: 280,
          overflowY: 'auto',
        }}>
          {filtered.map(p => (
            <button
              key={p.slug}
              onClick={() => { onSelect(p.slug); setOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: 'none',
                background: selected.slug === p.slug ? 'var(--accent-bg)' : 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (selected.slug !== p.slug) e.currentTarget.style.background = 'var(--surface)'; }}
              onMouseLeave={e => { if (selected.slug !== p.slug) e.currentTarget.style.background = 'transparent'; }}
            >
              <PortraitSlot initials={p.photo} photoUrl={p.photoUrl} size={28} radius={5} />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{p.name}</div>
                <Mono size={9} color="var(--muted)">{p.party} · {p.state}</Mono>
              </div>
              <Mono size={10} color="var(--text-2)">{p.score}</Mono>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparePageInner({ politicians }: { politicians: Politician[] }) {
  const params = useSearchParams();
  const router = useRouter();

  const [slugA, setSlugA] = useState(params.get('a') ?? politicians[0]?.slug ?? '');
  const [slugB, setSlugB] = useState(params.get('b') ?? politicians[1]?.slug ?? '');

  const a = politicians.find(p => p.slug === slugA) ?? politicians[0];
  const b = politicians.find(p => p.slug === slugB) ?? politicians[1];

  const updateUrl = (newA: string, newB: string) => {
    router.push(`/comparar?a=${newA}&b=${newB}`, { scroll: false });
  };

  const handleSelectA = (slug: string) => { setSlugA(slug); updateUrl(slug, slugB); };
  const handleSelectB = (slug: string) => { setSlugB(slug); updateUrl(slugA, slug); };

  const scoreDelta = a.score - b.score;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Comparar" />

      <section style={{ padding: '32px 28px 16px', maxWidth: 1280, margin: '0 auto' }}>
        <Kicker>Comparación lado a lado</Kicker>
        <h1
          className="serif"
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            lineHeight: 1,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '10px 0 8px',
          }}
        >
          {a.name.split(' ')[0]} vs {b.name.split(' ')[0]}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 640 }}>
          Las diferencias mayores a 20 puntos se marcan en rojo. El delta de score no refleja ideología; refleja distancia entre discurso y registro documentado.
        </p>

        <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <PoliticianSelector politicians={politicians} selected={a} onSelect={handleSelectA} label="POLÍTICO A" excludeSlug={slugB} />
          <div style={{ display: 'flex', alignItems: 'flex-end', padding: '0 8px 10px' }}>
            <Mono size={12} color="var(--muted)">vs</Mono>
          </div>
          <PoliticianSelector politicians={politicians} selected={b} onSelect={handleSelectB} label="POLÍTICO B" excludeSlug={slugA} />
        </div>
      </section>

      <style>{`
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 120px 1fr;
          gap: 20px;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .compare-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <section
        className="compare-grid"
        style={{ padding: '20px 28px 48px', maxWidth: 1280, margin: '0 auto' }}
      >
        <CompareColumn p={a} other={b} side="left" />

        {/* Delta column */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 14,
          background: 'var(--surface)',
          padding: '24px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>
          <Kicker>Delta</Kicker>
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Mono size={9} color="var(--muted)">ÍNDICE</Mono>
            <div
              className="serif"
              style={{
                fontSize: 38,
                lineHeight: 1,
                fontWeight: 500,
                color: Math.abs(scoreDelta) > 20 ? '#dc2626' : 'var(--text-2)',
                letterSpacing: '-0.02em',
                marginTop: 4,
              }}
            >
              {scoreDelta > 0 ? '+' : ''}{scoreDelta}
            </div>
          </div>

          <div style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: '1px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {a.dimensions.map((d, i) => {
              const dB = b.dimensions[i];
              if (!dB) return null;
              const delta = d.score - dB.score;
              const isSignificant = Math.abs(delta) > 20;
              const color = isSignificant ? '#dc2626' : 'var(--text-2)';
              const shortLabel = (d.label ?? DIMENSION_LABELS[d.key] ?? d.key).split(' ')[0];
              return (
                <div key={d.key} style={{ textAlign: 'center' }}>
                  <Mono size={9} color="var(--muted)">{shortLabel}</Mono>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color,
                    marginTop: 2,
                    padding: isSignificant ? '2px 6px' : 0,
                    background: isSignificant ? '#fef2f2' : 'transparent',
                    borderRadius: 4,
                    display: 'inline-block',
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CompareColumn p={b} other={a} side="right" />
      </section>
    </div>
  );
}

function CompareColumn({ p, other, side }: { p: Politician; other: Politician; side: 'left' | 'right' }) {
  const scoreDiff = p.score - other.score;
  const isWinning = scoreDiff > 0;
  const stripeColor = isWinning ? '#16a34a' : scoreDiff < 0 ? '#dc2626' : 'var(--muted)';

  return (
    <article style={{
      border: '1px solid var(--border)',
      borderRadius: 14,
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      {isWinning && (
        <div style={{
          background: '#f0fdf4',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Mono size={10} color="#16a34a">MAYOR ÍNDICE</Mono>
        </div>
      )}

      <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <PortraitSlot initials={p.photo} photoUrl={p.photoUrl} size={56} radius={10} />
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
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

      <div style={{ padding: '20px 24px' }}>
        <Kicker>Dimensiones</Kicker>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {p.dimensions.map((d, i) => {
            const otherDim = other.dimensions[i];
            const diff = otherDim ? d.score - otherDim.score : 0;
            const isHigher = diff > 0;
            const isLower = diff < 0;
            const label = d.label ?? DIMENSION_LABELS[d.key] ?? d.key;
            return (
              <div key={d.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Mono size={10} color="var(--muted)">{label}</Mono>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isHigher && <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>+{diff}</span>}
                    {isLower && <span style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>{diff}</span>}
                    <Mono size={11} color="var(--text)">{d.score}</Mono>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{
                    height: '100%',
                    width: `${d.score}%`,
                    background: isHigher ? '#16a34a' : isLower ? '#dc2626' : 'var(--accent)',
                    borderRadius: 3,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Kicker>Alertas</Kicker>
          <Pill kind={p.flags.length > other.flags.length ? 'flag' : p.flags.length < other.flags.length ? 'ok' : 'default'}>
            {p.flags.length} {p.flags.length === 1 ? 'alerta' : 'alertas'}
          </Pill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {p.flags.length === 0 && (
            <Mono size={11} color="var(--muted)">Sin alertas registradas.</Mono>
          )}
          {p.flags.slice(0, 3).map((f, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              border: '1px solid #fecaca',
              borderRadius: 8,
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}>
              <Mono size={10} color="#dc2626" style={{ flex: '0 0 auto', marginTop: 2 }}>
                SEV {f.severity}
              </Mono>
              <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.35, color: 'var(--text)' }}>
                {f.title}
              </div>
            </div>
          ))}
          {p.flags.length > 3 && (
            <Mono size={10} color="var(--muted)">+{p.flags.length - 3} alertas más</Mono>
          )}
        </div>
      </div>
    </article>
  );
}

export function CompareClient({ politicians }: { politicians: Politician[] }) {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mono size={12} color="var(--muted)">Cargando comparación...</Mono>
      </div>
    }>
      <ComparePageInner politicians={politicians} />
    </Suspense>
  );
}