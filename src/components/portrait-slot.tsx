/**
 * Portrait placeholder. Diagonal stripe pattern + initials in serif.
 * Replace with an <Image> tag when real photos are available.
 */
export function PortraitSlot({
  initials,
  size = 96,
  radius = 12,
}: {
  initials: string;
  size?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'repeating-linear-gradient(135deg, transparent 0 6px, var(--border) 6px 7px)',
      }}
    >
      <span
        className="serif"
        style={{
          fontSize: size * 0.32,
          fontWeight: 500,
          color: 'var(--muted)',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
