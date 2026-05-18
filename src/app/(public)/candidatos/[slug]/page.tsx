import { notFound } from 'next/navigation';

import { getPoliticianBySlug } from '@/lib/supabase-queries'
import { pillKindForRisk } from '@/lib/utils';

import { TopNav } from '@/components/top-nav';
import { Kicker, Mono } from '@/components/typography';
import { Pill } from '@/components/pill';
import { ScoreDial } from '@/components/score-dial';
import { PortraitSlot } from '@/components/portrait-slot';
import { ProfileTabs } from './profile-tabs';

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPoliticianBySlug(slug)
  if (!p) notFound()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Buscar" />

      {/* breadcrumb */}
      <div style={{
        padding: '12px 28px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Mono size={11} color="var(--muted)">Expedientes</Mono>
        <Mono size={11} color="var(--muted)">/</Mono>
        <Mono size={11} color="var(--muted)">Senado · MX</Mono>
        <Mono size={11} color="var(--muted)">/</Mono>
        <Mono size={11} color="var(--text)">{p.name.split(' ').slice(0, 2).join(' ')}</Mono>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <span
            title="Próximamente"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--muted)',
              padding: '5px 10px',
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: 'transparent',
              cursor: 'not-allowed',
              opacity: 0.5,
              textDecoration: 'none',
            }}
          >
            Compartir
          </span>
          {['PDF', 'Citar', 'Comparar'].map((b) => (
            <span
              key={b}
              title="Próximamente"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--muted)',
                padding: '5px 10px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* hero band */}
      <section style={{
        padding: '32px 28px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '120px 1fr 200px',
          gap: 28,
          alignItems: 'center',
        }}>
          <PortraitSlot initials={p.photo} photoUrl={p.photoUrl} size={120} radius={14} />

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
            {p.bio && (
              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--text-2)',
                maxWidth: 580,
                marginTop: 14,
              }}>
                {p.bio}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScoreDial value={p.score} size={140} />
            <div style={{ marginTop: 10 }}>
              <Pill kind={pillKindForRisk(p.risk)}>Riesgo {p.risk.toLowerCase()}</Pill>
            </div>
          </div>
        </div>
      </section>

      {/* tabs — client component handles all tab state and content */}
      <ProfileTabs p={p} />
    </div>
  );
}