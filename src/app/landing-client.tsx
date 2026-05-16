'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
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

export function LandingClient({ politicians }: { politicians: Politician[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const featured = politicians[0];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Buscar" />

      {/* Hero */}
      <section style={{ padding: '88px 28px 56px', maxWidth: 1080, margin: '0 auto' }}>
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
            fontSize: 76,
            lineHeight: 0.96,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '0 0 20px',
            maxWidth: 880,
          }}
        >
          Datos públicos. Expedientes verificables. Para votantes mexicanos.
        </h1>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--text-2)',
            maxWidth: 560,
            marginBottom: 36,
          }}
        >
          Séneca rastrea declaraciones patrimoniales, votos y conflictos de
          interés de políticos en activo. Cada dato remite a una fuente pública.
          Sin patrocinadores. Sin opinión editorial.
        </p>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          style={{ display: 'flex', alignItems: 'center', maxWidth: 640, gap: 8 }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid var(--border-2)',
              borderRadius: 10,
              padding: '14px 16px',
              background: 'var(--bg)',
              boxShadow: '0 1px 0 rgba(0,0,0,0.02)',
            }}
          >
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
      </section>

      {/* Featured dossier card */}
      {featured && (
        <section style={{ padding: '0 28px 64px', maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <Kicker>Expediente destacado</Kicker>
            <Mono size={10} color="var(--muted)">Actualizado {featured.lastUpdated}</Mono>
          </div>

          <article
            style={{
              border: '1px solid var(--border)',
              borderRadius: 14,
              background: 'var(--bg)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '320px 1fr 280px',
            }}
          >
            {/* Identity column */}
            <div
              style={{
                background: 'var(--surface)',
                padding: '32px 28px',
                borderRight: '1px solid var(--border)',
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <PortraitSlot initials={featured.photo} size={96} />
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: 24,
                  lineHeight: 1.15,
                  fontWeight: 500,
                  color: 'var(--text)',
                  letterSpacing: '-0.015em',
                  marginBottom: 4,
                }}
              >
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

            {/* Synthesis column */}
            <div style={{ padding: '32px 28px' }}>
              <Kicker>Síntesis</Kicker>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: 'var(--text-2)',
                  marginTop: 12,
                  marginBottom: 18,
                }}
              >
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

            {/* Score column */}
            <div
              style={{
                background: 'var(--surface)',
                padding: '32px 24px',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
        <h2
          className="serif"
          style={{
            fontSize: 36,
            lineHeight: 1.1,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            margin: '10px 0 28px',
          }}
        >
          Cinco dimensiones. Una sola pregunta.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {HOW_IT_WORKS.map(([n, label, sub]) => (
            <div
              key={n}
              style={{
                padding: '20px 18px',
                border: '1px solid var(--border)',
                borderRadius: 10,
                background: 'var(--bg)',
              }}
            >
              <Mono size={11} color="var(--muted)">{n}</Mono>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginTop: 10,
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface)',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
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