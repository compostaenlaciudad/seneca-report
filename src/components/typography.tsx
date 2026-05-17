import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type MonoProps = {
  children: ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: CSSProperties;
} & Pick<ComponentPropsWithoutRef<'span'>, 'className'>;

/** Mono inline label — for numbers, IDs, source citations, kicker indices. */
export function Mono({
  children,
  size = 11,
  weight = 500,
  color,
  style,
  className,
}: MonoProps) {
  return (
    <span
      className={className ? `mono ${className}` : 'mono'}
      style={{
        fontSize: size,
        lineHeight: 1.3,
        fontWeight: weight,
        color: color ?? 'inherit',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Uppercase mono eyebrow. */
export function Kicker({
  children,
  color = 'var(--muted)',
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 10.5,
        lineHeight: 1,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </div>
  );
}
