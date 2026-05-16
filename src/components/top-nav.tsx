import Link from 'next/link';
import { Mono } from './typography';

const NAV = [
  { label: 'Buscar',      href: '/buscar' },
  { label: 'Comparar',    href: '/comparar' },
  { label: 'Metodología', href: '/metodologia' },
  { label: 'Fuentes',     href: '/fuentes' },
  { label: 'API',         href: '/api' },
];

export function TopNav({ active }: { active?: string }) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

        <nav style={{ display: 'flex', gap: 20 }}>
          {NAV.map((l) => {
            const isActive = l.label === active;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-2)',
                  paddingBottom: 2,
                  borderBottom: `1.5px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mono size={11} color="var(--muted)">⌘K</Mono>
        <button
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 12px',
            border: '1px solid var(--border-2)',
            borderRadius: 6,
            color: 'var(--text)',
            background: 'transparent',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </header>
  );
}
