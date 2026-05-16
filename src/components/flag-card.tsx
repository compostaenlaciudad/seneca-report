import type { Flag } from '@/lib/types';
import { Mono } from './typography';

const SEVERITY_LABEL: Record<Flag['severity'], string> = {
  A: 'Crítica',
  B: 'Grave',
  C: 'Menor',
};

/** The loud red box. Severity-aware. Always lists numbered sources. */
export function FlagCard({ flag }: { flag: Flag }) {
  return (
    <div
      style={{
        border: '1px solid var(--flag)',
        borderRadius: 10,
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* header strip */}
      <div
        style={{
          background: 'var(--flag-bg)',
          color: 'var(--flag)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--flag)',
        }}
      >
        <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
          <path d="M7 1 L13 12 L1 12 Z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
          <path d="M7 5.5 L7 8.5 M7 10 L7 10.6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }}>
          Alerta · {SEVERITY_LABEL[flag.severity]}
        </span>
        <Mono size={10} color="var(--flag)" style={{ marginLeft: 'auto' }}>
          SEV {flag.severity}
        </Mono>
      </div>

      {/* body */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: 'var(--text)', marginBottom: 6 }}>
          {flag.title}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-2)', marginBottom: 12 }}>
          {flag.body}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {flag.sources.map((s, i) => (
            <span
              key={i}
              className="mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10.5,
                fontWeight: 500,
                color: 'var(--text-2)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '3px 7px',
                borderRadius: 4,
              }}
            >
              <span style={{ color: 'var(--muted)' }}>[{i + 1}]</span> {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
