/**
 * Portrait slot — shows real photo if photoUrl is provided,
 * falls back to diagonal stripe pattern + initials in serif.
 */
'use client'

export function PortraitSlot({
  initials,
  photoUrl,
  size = 96,
  radius = 12,
}: {
  initials: string;
  photoUrl?: string | null;
  size?: number;
  radius?: number;
}) {
  if (photoUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          border: '1px solid var(--border)',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'var(--surface)',
        }}
      >
        <img
          src={photoUrl}
          alt={initials}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          onError={(e) => {
            // Fall back to initials on broken image
            const parent = e.currentTarget.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-image: repeating-linear-gradient(135deg, transparent 0 6px, var(--border) 6px 7px);
                  font-family: serif;
                  font-size: ${size * 0.32}px;
                  font-weight: 500;
                  color: var(--muted);
                ">${initials}</div>
              `
            }
          }}
        />
      </div>
    )
  }

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
        flexShrink: 0,
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
  )
}