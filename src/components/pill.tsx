import type { ReactNode } from 'react';

export type PillKind = 'default' | 'flag' | 'ok' | 'warn';

const KIND_STYLES: Record<PillKind, { bg: string; border: string; color: string }> = {
  default: { bg: 'var(--surface)',  border: 'var(--border)', color: 'var(--text-2)' },
  flag:    { bg: 'var(--flag-bg)',  border: 'var(--flag)',   color: 'var(--flag)'   },
  ok:      { bg: 'var(--ok-bg)',    border: 'var(--ok)',     color: 'var(--ok)'     },
  warn:    { bg: 'var(--warn-bg)',  border: 'var(--warn)',   color: 'var(--warn)'   },
};

export function Pill({
  children,
  kind = 'default',
}: {
  children: ReactNode;
  kind?: PillKind;
}) {
  const s = KIND_STYLES[kind];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: '3px 8px',
        borderRadius: 999,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </span>
  );
}
