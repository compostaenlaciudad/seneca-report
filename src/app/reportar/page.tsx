'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { Kicker, Mono } from '@/components/typography'

const ERROR_TYPES = [
  'Dato incorrecto en un expediente',
  'Fuente incorrecta o no disponible',
  'Score que parece erróneo',
  'Político faltante',
  'Error técnico en la plataforma',
  'Error en la extensión de Chrome',
  'Otro',
]

export default function ReportarPage() {
  const [type, setType] = useState('')
  const [politician, setPolitician] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const title = encodeURIComponent(`[Error] ${type}${politician ? ` — ${politician}` : ''}`)
    const body = encodeURIComponent(
      `## Tipo de error\n${type}\n\n## Político involucrado\n${politician || 'N/A'}\n\n## Descripción\n${description}`
    )
    window.open(
      `https://github.com/compostaenlaciudad/seneca-report/issues/new?title=${title}&body=${body}`,
      '_blank'
    )
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav />

      <section style={{ padding: '64px 28px 48px', maxWidth: 640, margin: '0 auto' }}>
        <Kicker>Reportar error</Kicker>
        <h1
          className="serif"
          style={{
            fontSize: 48,
            lineHeight: 1.0,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '12px 0 16px',
          }}
        >
          Ayúdanos a mejorar
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 40 }}>
          SÉNECA es un proyecto de código abierto. Si encuentras un error en los datos, una fuente incorrecta o cualquier problema técnico, repórtalo aquí. Cada reporte se revisa manualmente.
        </p>

        {submitted ? (
          <div style={{
            padding: 32,
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: 'var(--surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
              Reporte enviado
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 20 }}>
              Gracias por contribuir a la transparencia. Revisaremos tu reporte y actualizaremos el expediente si corresponde.
            </p>
            <button
              onClick={() => { setSubmitted(false); setType(''); setPolitician(''); setDescription('') }}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--accent)',
                background: 'none',
                border: '1px solid var(--accent)',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Enviar otro reporte
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Error type */}
            <div>
              <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Tipo de error *
              </Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ERROR_TYPES.map((t) => (
                  <label key={t} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    border: `1px solid ${type === t ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 8,
                    background: type === t ? 'var(--accent-bg)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}>
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={() => setType(t)}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: `2px solid ${type === t ? 'var(--accent)' : 'var(--border-2)'}`,
                      background: type === t ? 'var(--accent)' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {type === t && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: type === t ? 500 : 400 }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Politician */}
            <div>
              <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Político involucrado (opcional)
              </Mono>
              <input
                value={politician}
                onChange={e => setPolitician(e.target.value)}
                placeholder="Ej: Manuel Velasco Coello"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Descripción del error *
              </Mono>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe el error con el mayor detalle posible. Si tienes una fuente que lo respalda, inclúyela aquí."
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Alternative */}
            <div style={{
              padding: '14px 16px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                  También puedes abrir un issue en GitHub
                </div>
                <Mono size={10} color="var(--muted)">Para reportes técnicos detallados</Mono>
              </div>
              <a
                href="https://github.com/compostaenlaciudad/seneca-report/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  border: '1px solid var(--accent)',
                  padding: '6px 12px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                GitHub →
              </a>
            </div>

            <button
              type="submit"
              disabled={!type || !description}
              style={{
                padding: '12px 24px',
                background: !type || !description ? 'var(--surface)' : 'var(--accent)',
                color: !type || !description ? 'var(--muted)' : '#fff',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: !type || !description ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Enviar reporte
            </button>
          </form>
        )}
      </section>
    </div>
  )
}