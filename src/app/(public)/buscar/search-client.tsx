'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

import { pillKindForRisk, scoreColor } from '@/lib/utils';
import type { Politician } from '@/lib/types';

import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { PortraitSlot } from '@/components/portrait-slot';

const SORT_OPTIONS = ['Relevancia', 'Score ↓', 'Alfabético', 'Actualizado'];

const FILTER_GROUPS = [
  { key: 'partido', label: 'Partido', options: ['MORENA', 'PAN', 'PRI', 'PVEM', 'MC', 'PRD'] },
  { key: 'camara',  label: 'Cámara',  options: ['Senado', 'Diputados', 'Estatal'] },
  { key: 'riesgo',  label: 'Riesgo',  options: ['Alto', 'Elevado', 'Moderado', 'Bajo'] },
  { key: 'flags',   label: 'Banderas', options: ['0', '1–2', '3–5', '6+'] },
] as const;

function SearchPageInner({ politicians }: { politicians: Politician[] }) {
  const params = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState(SORT_OPTIONS[1]);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    'partido:MORENA': true,
    'partido:PAN': true,
  });

  function toggle(key: string) {
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  }

  const filtered = politicians.filter((p) => {
    if (!q.trim()) return true
    const search = q.toLowerCase()
    return (
      p.name.toLowerCase().includes(search) ||
      p.party.toLowerCase().includes(search) ||
      p.state.toLowerCase().includes(search) ||
      p.role.toLowerCase().includes(search)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Score ↓') return b.score - a.score
    if (sort === 'Alfabético') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Buscar" />

      {/* sticky search bar */}
      <div
        style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'var(--bg)',
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--border-2)',
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx={7} cy={7} r={5} stroke="var(--muted)" strokeWidth={1.5} />
            <path d="M11 11 L14 14" stroke="var(--muted)" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text)',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          />
        </div>
        <Mono size={11} color="var(--muted)">{sorted.length} resultados</Mono>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {SORT_OPTIONS.map((s) => {
            const active = s === sort;
            return (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 120px)' }}>
        {/* filters */}
        <aside
          style={{
            borderRight: '1px solid var(--border)',
            padding: '24px 22px',
            background: 'var(--surface)',
          }}
        >
          <Kicker>Filtros</Kicker>
          {FILTER_GROUPS.map((g) => (
            <div key={g.key} style={{ marginTop: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {g.label}
              </div>
              {g.options.map((o) => {
                const id = `${g.key}:${o}`;
                const isOn = !!checked[id];
                return (
                  <label
                    key={o}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 0',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      onClick={() => toggle(id)}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `1.5px solid ${isOn ? 'var(--accent)' : 'var(--border-2)'}`,
                        background: isOn ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 14px',
                      }}
                    >
                      {isOn && (
                        <span style={{ color: 'var(--accent-text)', fontSize: 9, fontWeight: 600 }}>
                          ✓
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{o}</span>
                    <Mono size={9} color="var(--muted)" style={{ marginLeft: 'auto' }}>
                      {politicians.filter(p =>
                        g.key === 'partido' ? p.party.toUpperCase() === o.toUpperCase() : true
                      ).length}
                    </Mono>
                  </label>
                );
              })}
            </div>
          ))}
        </aside>

        {/* result list */}
        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <Mono size={13} color="var(--muted)">Sin resultados para "{q}"</Mono>
            </div>
          )}
          {sorted.map((p) => (
            <ResultRow key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ p }: { p: Politician }) {
  const flagCount = p.flags.length;
  return (
    <Link
      href={`/candidatos/${p.slug}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr 200px 100px 120px',
        gap: 18,
        alignItems: 'center',
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--bg)',
        padding: '18px 20px',
      }}
    >
      <PortraitSlot initials={p.photo} size={52} radius={8} />

      <div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--text)',
            letterSpacing: '-0.005em',
            marginBottom: 4,
          }}
        >
          {p.name}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 8 }}>
          {p.role} · {p.state}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Pill>{p.party}</Pill>
          <Pill kind={flagCount >= 3 ? 'flag' : flagCount > 0 ? 'warn' : 'ok'}>
            {flagCount} alertas
          </Pill>
        </div>
      </div>

      {/* mini dimension bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {p.dimensions.slice(0, 5).map((d) => (
          <div
            key={d.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '14px 1fr 22px',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Mono size={9} color="var(--muted)">{d.key[0].toUpperCase()}</Mono>
            <div
              style={{
                height: 3,
                background: 'var(--surface-2)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${d.score}%`,
                  background: scoreColor(d.score),
                  borderRadius: 2,
                }}
              />
            </div>
            <Mono size={9} color="var(--text-2)" style={{ textAlign: 'right' }}>{d.score}</Mono>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ScoreDial value={p.score} size={70} showLabel={false} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <Pill kind={pillKindForRisk(p.risk)}>{p.risk}</Pill>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)' }}>Abrir →</span>
      </div>
    </Link>
  );
}

export function SearchPageClient({ politicians }: { politicians: Politician[] }) {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mono size={12} color="var(--muted)">Cargando…</Mono>
      </div>
    }>
      <SearchPageInner politicians={politicians} />
    </Suspense>
  );
}