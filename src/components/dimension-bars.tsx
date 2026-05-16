import type { Dimension } from '@/lib/types';
import { DIMENSION_LABELS, scoreColor } from '@/lib/utils';
import { Mono } from './typography';

export function DimensionBars({
  dimensions,
  compact = false,
}: {
  dimensions: Dimension[];
  compact?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 8 : 14 }}>
      {dimensions.map((d) => {
        const label = d.label ?? DIMENSION_LABELS[d.key];
        const color = scoreColor(d.score);
        return (
          <div key={d.key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</span>
              <Mono size={12} weight={600} color={color}>{d.score}</Mono>
            </div>
            <div
              style={{
                height: 4,
                background: 'var(--surface-2)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${d.score}%`,
                  background: color,
                  borderRadius: 2,
                }}
              />
            </div>
            {!compact && d.note && (
              <Mono size={10} color="var(--muted)" style={{ display: 'block', marginTop: 4 }}>
                {d.note}
              </Mono>
            )}
          </div>
        );
      })}
    </div>
  );
}
