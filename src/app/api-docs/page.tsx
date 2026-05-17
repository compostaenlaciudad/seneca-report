'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { Kicker, Mono } from '@/components/typography'

const BASE_URL = 'https://seneca-report.vercel.app/api'

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/politicians',
    description: 'Busca políticos por nombre, partido o estado.',
    params: [
      { name: 'q', type: 'string', required: true, desc: 'Término de búsqueda (mínimo 3 caracteres)' },
    ],
    example: `${BASE_URL}/politicians?q=velasco`,
    response: `{
  "politicians": [
    {
      "slug": "manuel-velasco-coello",
      "name": "Manuel Velasco Coello",
      "party": "PVEM",
      "state": "Chiapas",
      "role": "Coordinador bancada PVEM",
      "score": 22,
      "scoreColor": "#dc2626",
      "risk": "ALTO",
      "riskColor": "#dc2626",
      "summary": "...",
      "topFlag": {
        "title": "Inconsistencia patrimonial",
        "body": "La ASF detectó irregularidades...",
        "severity": "danger",
        "source": "https://..."
      },
      "flagCount": 4,
      "profileUrl": "https://seneca-report.vercel.app/candidatos/manuel-velasco-coello",
      "cardUrl": "https://seneca-report.vercel.app/card/manuel-velasco-coello"
    }
  ],
  "query": "velasco",
  "count": 1
}`,
  },
  {
    method: 'GET',
    path: '/politicians/[slug]',
    description: 'Obtiene el expediente completo de un político por su slug.',
    params: [
      { name: 'slug', type: 'string', required: true, desc: 'Identificador único del político (ej: manuel-velasco-coello)' },
    ],
    example: `${BASE_URL}/politicians/ruben-rocha-moya`,
    response: `{
  "politician": {
    "id": "uuid",
    "slug": "ruben-rocha-moya",
    "name": "Rubén Rocha Moya",
    "party": "Morena",
    "state": "Sinaloa",
    "score": 8,
    "risk": "ALTO",
    "bio": "...",
    "dimensions": [...],
    "flags": [...],
    "education": [...],
    "sources": [...],
    "lastUpdated": "2026-05-16"
  }
}`,
  },
  {
    method: 'POST',
    path: '/verificar',
    description: 'Verifica una declaración pública contra el expediente documentado de un político usando IA.',
    params: [
      { name: 'claim', type: 'string', required: true, desc: 'La declaración a verificar (mínimo 15 caracteres)' },
      { name: 'politician_slug', type: 'string', required: false, desc: 'Slug del político para cruzar contra su expediente' },
      { name: 'context', type: 'string', required: false, desc: 'URL o contexto donde se encontró la declaración' },
    ],
    example: `POST ${BASE_URL}/verificar
Content-Type: application/json

{
  "claim": "Nunca he tenido vínculos con el crimen organizado",
  "politician_slug": "ruben-rocha-moya"
}`,
    response: `{
  "verdict": "INCONSISTENTE",
  "confidence": "ALTA",
  "summary": "La declaración contradice directamente...",
  "contradictions": [
    {
      "claim": "Nunca he tenido vínculos...",
      "reality": "El DOJ acusó formalmente a Rocha Moya...",
      "source": "https://politica.expansion.mx/..."
    }
  ],
  "verdict_es": "FALSO: Acusación formal del DOJ lo contradice",
  "profileUrl": "https://seneca-report.vercel.app/candidatos/ruben-rocha-moya"
}`,
  },
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        background: '#0f172a',
        color: '#e2e8f0',
        padding: '16px 20px',
        borderRadius: 8,
        fontSize: 12,
        lineHeight: 1.7,
        overflowX: 'auto',
        margin: 0,
        fontFamily: 'ui-monospace, monospace',
      }}>
        {code}
      </pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 8px',
          borderRadius: 4,
          border: '1px solid #334155',
          background: copied ? '#16a34a' : '#1e293b',
          color: copied ? '#fff' : '#94a3b8',
          cursor: 'pointer',
          fontFamily: 'ui-monospace, monospace',
          letterSpacing: '0.06em',
        }}
      >
        {copied ? 'COPIADO' : 'COPIAR'}
      </button>
    </div>
  )
}

export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="API" />

      {/* Hero */}
      <section style={{ padding: '64px 28px 48px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>API pública · v1.0 · REST</Kicker>
        <h1
          className="serif"
          style={{
            fontSize: 52,
            lineHeight: 1.0,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '12px 0 20px',
          }}
        >
          Construye sobre<br />
          <span style={{ color: 'var(--accent)' }}>SÉNECA</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-2)', maxWidth: 640, marginBottom: 24 }}>
          La API de SÉNECA es pública, gratuita y sin autenticación. Cualquier desarrollador puede acceder a los expedientes, scores y verificación de declaraciones para construir herramientas de transparencia.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Base URL', value: BASE_URL },
            { label: 'Formato', value: 'JSON' },
            { label: 'Auth', value: 'Ninguna' },
            { label: 'CORS', value: 'Habilitado' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'inline-flex',
              alignItems: 'stretch',
              height: 24,
              border: '1px solid var(--border)',
              borderRadius: 4,
              overflow: 'hidden',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 11,
            }}>
              <div style={{ padding: '0 8px', background: 'var(--surface)', color: 'var(--muted)', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }}>
                {label}
              </div>
              <div style={{ padding: '0 8px', background: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Endpoints */}
      <section style={{ padding: '0 28px 96px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              background: 'var(--surface)',
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: ep.method === 'GET' ? '#dbeafe' : '#fef3c7',
                  color: ep.method === 'GET' ? '#1d4ed8' : '#d97706',
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '0.06em',
                }}>
                  {ep.method}
                </span>
                <Mono size={13} color="var(--text)" style={{ fontWeight: 600 }}>
                  /api{ep.path}
                </Mono>
              </div>

              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                  {ep.description}
                </p>

                {/* Params */}
                {ep.params.length > 0 && (
                  <div>
                    <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Parámetros
                    </Mono>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {ep.params.map((param) => (
                        <div key={param.name} style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto auto 1fr',
                          gap: 10,
                          alignItems: 'baseline',
                          padding: '8px 12px',
                          background: 'var(--bg)',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                        }}>
                          <Mono size={12} color="var(--accent)" style={{ fontWeight: 600 }}>{param.name}</Mono>
                          <Mono size={10} color="var(--muted)">{param.type}{param.required ? ' · requerido' : ' · opcional'}</Mono>
                          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{param.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example */}
                <div>
                  <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Ejemplo de solicitud
                  </Mono>
                  <CodeBlock code={ep.example} />
                </div>

                {/* Response */}
                <div>
                  <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Respuesta
                  </Mono>
                  <CodeBlock code={ep.response} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: 48,
          padding: 28,
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--surface)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            ¿Construiste algo con la API de SÉNECA?
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
            Abre un issue en GitHub para que lo incluyamos en la documentación y lo compartamos con la comunidad.
          </p>
          <a
            href="https://github.com/compostaenlaciudad/seneca-report/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
              border: '1px solid var(--accent)',
              padding: '8px 16px',
              borderRadius: 8,
            }}
          >
            Abrir issue en GitHub →
          </a>
        </div>
      </section>
    </div>
  )
}