'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mono } from './typography';

const NAV = [
  { label: 'Buscar',      href: '/buscar' },
  { label: 'Comparar',    href: '/comparar' },
  { label: 'Metodología', href: '/metodologia' },
  { label: 'Fuentes',     href: '/fuentes' },
  { label: 'API',         href: '/api-docs' },
];

export function TopNav({ active }: { active?: string }) {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)' }}>
            Séneca
          </div>
          <Mono
            size={10}
            color="var(--muted)"
            style={{
              marginLeft: 4,
              padding: '2px 6px',
              border: '1px solid var(--border)',
              borderRadius: 4,
            }}
          >
            β · MX
          </Mono>
        </Link>

        <nav style={{ display: 'flex', gap: 24 }}>
  {NAV.map((l) => {
    const isActive = l.label === active || pathname === l.href
    return (
      <Link
        key={l.href}
        href={l.href}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: isActive ? 'var(--accent)' : 'var(--text-2)',
          borderBottom: `1.5px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
          paddingBottom: 2,
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.color = 'var(--text)'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
          }
        }}
      >
        {l.label}
      </Link>
    )
  })}
</nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mono size={11} color="var(--muted)">⌘K</Mono>
        <a
          href="/seneca-extension.zip"
          download
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 6,
            color: '#fff',
            background: 'var(--accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'opacity 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Descargar extensión
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}