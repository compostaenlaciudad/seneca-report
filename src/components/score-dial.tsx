import { scoreColor } from '@/lib/utils';
import { Mono } from './typography';

/** Radial gauge with serif score in center. Used everywhere a score appears. */
export function ScoreDial({
  value,
  size = 140,
  showLabel = true,
}: {
  value: number;
  size?: number;
  showLabel?: boolean;
}) {
  const r = (size - 16) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const color = scoreColor(value);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={r} stroke="var(--border)" strokeWidth={6} fill="none" />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="serif"
          style={{
            fontSize: size * 0.32,
            fontWeight: 500,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}
        >
          {value}
        </div>
        {showLabel && (
          <Mono size={9} color="var(--muted)" style={{ marginTop: 4, letterSpacing: '0.08em' }}>
            / 100
          </Mono>
        )}
      </div>
    </div>
  );
}
