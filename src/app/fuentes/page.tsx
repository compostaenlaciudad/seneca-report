'use client'

import { TopNav } from '@/components/top-nav'
import { Kicker, Mono } from '@/components/typography'

const SOURCES = [
  {
    category: 'Transparencia patrimonial',
    items: [
      { name: 'Plataforma Nacional de Transparencia — Declaranet', url: 'https://declaranet.gob.mx', desc: 'Declaraciones patrimoniales, de intereses y fiscales de servidores públicos.' },
      { name: 'Sistema de Información Pública de Organizaciones y Fideicomisos', url: 'https://sipot.org.mx', desc: 'Información patrimonial de organizaciones con financiamiento público.' },
      { name: 'Registro Público de la Propiedad', url: 'https://www.registropublico.cdmx.gob.mx', desc: 'Registro de bienes inmuebles a nivel federal y estatal.' },
    ],
  },
  {
    category: 'Fiscalización y auditoría',
    items: [
      { name: 'Auditoría Superior de la Federación (ASF)', url: 'https://www.asf.gob.mx', desc: 'Informes de auditoría al ejercicio del gasto público federal.' },
      { name: 'Secretaría de la Función Pública (SFP)', url: 'https://www.gob.mx/sfp', desc: 'Sanciones administrativas, inhabilitaciones y resoluciones de responsabilidad.' },
      { name: 'Sistema Nacional Anticorrupción (SNA)', url: 'https://www.plataformadigitalnacional.org', desc: 'Plataforma Digital Nacional: servidores sancionados, declaraciones y contratos.' },
    ],
  },
  {
    category: 'Contrataciones y gasto público',
    items: [
      { name: 'CompraNet', url: 'https://compranet.hacienda.gob.mx', desc: 'Sistema de contrataciones del gobierno federal. Licitaciones, contratos y proveedores.' },
      { name: 'Transparencia Presupuestaria', url: 'https://www.transparenciapresupuestaria.gob.mx', desc: 'Ejercicio del presupuesto público federal por dependencia y programa.' },
    ],
  },
  {
    category: 'Registro legislativo',
    items: [
      { name: 'Cámara de Diputados — Diario de Debates', url: 'https://www.diputados.gob.mx', desc: 'Registro oficial de votaciones, asistencias e iniciativas en la Cámara de Diputados.' },
      { name: 'Senado de la República', url: 'https://www.senado.gob.mx', desc: 'Registro de votaciones, iniciativas y comisiones del Senado.' },
      { name: 'Sistema de Información Legislativa (SIL)', url: 'http://sil.gobernacion.gob.mx', desc: 'Base de datos de iniciativas, dictámenes y legisladores.' },
    ],
  },
  {
    category: 'Registro electoral',
    items: [
      { name: 'Instituto Nacional Electoral (INE)', url: 'https://www.ine.mx', desc: 'Financiamiento de campañas, plataformas electorales y candidaturas registradas.' },
      { name: 'Tribunal Electoral del Poder Judicial (TEPJF)', url: 'https://www.te.gob.mx', desc: 'Resoluciones y sanciones electorales.' },
    ],
  },
  {
    category: 'Investigaciones internacionales',
    items: [
      { name: 'Departamento de Justicia de EEUU (DOJ)', url: 'https://www.justice.gov', desc: 'Acusaciones formales, indictments y comunicados de prensa sobre casos con nexo mexicano.' },
      { name: 'Oficina de Control de Activos Extranjeros (OFAC)', url: 'https://ofac.treasury.gov', desc: 'Lista de personas sancionadas por vínculos con narcotráfico y crimen organizado.' },
      { name: 'Transparencia Internacional', url: 'https://www.transparency.org', desc: 'Índice de Percepción de la Corrupción y reportes por país.' },
    ],
  },
  {
    category: 'Prensa verificada',
    items: [
      { name: 'Animal Político', url: 'https://animalpolitico.com', desc: 'Periodismo de datos e investigación política verificada.' },
      { name: 'SinEmbargo', url: 'https://sinembargo.mx', desc: 'Investigación periodística sobre política y poder en México.' },
      { name: 'Expansión Política', url: 'https://politica.expansion.mx', desc: 'Cobertura política verificada con énfasis en datos públicos.' },
      { name: 'Proceso', url: 'https://proceso.com.mx', desc: 'Periodismo de investigación político-económico.' },
    ],
  },
]

export default function FuentesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Fuentes" />

      {/* Hero */}
      <section style={{ padding: '64px 28px 48px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>Fuentes · v1.0</Kicker>
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
          De dónde vienen<br />
          <span style={{ color: 'var(--accent)' }}>los datos</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-2)', maxWidth: 640 }}>
          SÉNECA utiliza exclusivamente fuentes públicas verificables. Ningún dato proviene de fuentes anónimas, filtraciones no verificadas o declaraciones sin respaldo documental. Todo lo que aparece en un expediente tiene una fuente citada.
        </p>
      </section>

      {/* Sources */}
      <section style={{ padding: '0 28px 96px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {SOURCES.map((group) => (
            <div key={group.category}>
              <Kicker>{group.category}</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                {group.items.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      padding: '16px 20px',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      background: 'var(--surface)',
                      textDecoration: 'none',
                      transition: 'border-color 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                      <Mono size={10} color="var(--muted)" style={{ marginTop: 6 }}>
                        {item.url}
                      </Mono>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginTop: 2 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}