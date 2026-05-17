import { TopNav } from '@/components/top-nav'
import { Kicker, Mono } from '@/components/typography'

const DIMENSIONS = [
  {
    n: '01',
    name: 'Integridad filosófica',
    key: 'integridad_filosofica',
    description: 'Coherencia entre las posiciones ideológicas declaradas del político y su historial de acciones verificables. Incluye consistencia de discurso a lo largo del tiempo, cambios de partido, y alineación entre valores declarados y votaciones.',
    sources: ['Diario de Debates (Cámara de Diputados y Senado)', 'Declaraciones públicas verificadas', 'Historial de militancia partidista'],
  },
  {
    n: '02',
    name: 'Coherencia dichos / hechos',
    key: 'coherencia_hechos',
    description: 'Medición directa entre promesas de campaña o declaraciones públicas y el registro documentado de acciones concretas. Incluye promesas incumplidas, contradicciones documentadas y acciones opuestas al discurso.',
    sources: ['Registros de votación (INE, Cámara)', 'Plataformas electorales registradas ante el INE', 'Bases de datos de promesas vs. acciones de organizaciones civiles'],
  },
  {
    n: '03',
    name: 'Transparencia patrimonial',
    key: 'transparencia_patrimonial',
    description: 'Análisis de declaraciones patrimoniales 3-de-3 (patrimonio, intereses y fiscal). Evalúa consistencia entre ingresos históricos y patrimonio declarado, presentación voluntaria de declaraciones, y ausencia de discrepancias inexplicables.',
    sources: ['Plataforma Nacional de Transparencia (Declaranet)', 'Servicio de Administración Tributaria (SAT)', 'Registro Público de la Propiedad', 'Catastro estatal'],
  },
  {
    n: '04',
    name: 'Rendición de cuentas',
    key: 'rendicion_cuentas',
    description: 'Evaluación de la respuesta del político ante cuestionamientos públicos documentados. Incluye respuesta a solicitudes de información, comparecencias voluntarias, reacción ante señalamientos de organismos fiscalizadores y transparencia en el ejercicio del gasto.',
    sources: ['Auditoría Superior de la Federación (ASF)', 'Instituto Nacional de Transparencia (INAI)', 'Solicitudes de acceso a la información respondidas', 'Secretaría de la Función Pública (SFP)'],
  },
  {
    n: '05',
    name: 'Independencia del poder',
    key: 'independencia_poder',
    description: 'Evaluación de vínculos documentados con grupos de poder económico, político o criminal. Incluye conflictos de interés, contratos con empresas relacionadas, financiamiento de campaña y relaciones con grupos de presión.',
    sources: ['Sistema de Contrataciones Gubernamentales (CompraNet)', 'Registro de financiamiento electoral (INE)', 'Investigaciones de organismos anticorrupción', 'Reportes del DOJ, DEA y organismos internacionales'],
  },
]

export default function MetodologiaPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav active="Metodología" />

      {/* Hero */}
      <section style={{ padding: '64px 28px 48px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>Metodología · v1.0</Kicker>
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
          Cómo funciona el<br />
          <span style={{ color: 'var(--accent)' }}>Índice Séneca</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-2)', maxWidth: 640 }}>
          SÉNECA no califica ideologías. Documenta la distancia entre lo que un político dice y lo que el registro público demuestra. Cada cifra remite a una fuente verificable. Cada alerta tiene una fuente citada.
        </p>
      </section>

      {/* Principios */}
      <section style={{ padding: '0 28px 64px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>Principios editoriales</Kicker>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          {[
            { title: 'No partidista', body: 'SÉNECA evalúa a políticos de todos los partidos con los mismos criterios. No existe financiamiento de partidos, gobierno ni empresas con vínculos políticos.' },
            { title: 'Fuentes públicas únicamente', body: 'Toda alerta y puntuación se basa exclusivamente en registros públicos verificables: declaraciones oficiales, auditorías, registros judiciales y bases de datos gubernamentales.' },
            { title: 'Transparencia metodológica', body: 'El código fuente de SÉNECA es abierto. La metodología de scoring está documentada públicamente y cualquier cambio queda registrado en el historial de versiones.' },
            { title: 'Corrección pública', body: 'Si se documenta un error, se corrige y se registra el cambio en el historial del expediente. Los datos corregidos quedan disponibles públicamente.' },
          ].map(({ title, body }) => (
            <div key={title} style={{
              padding: 24,
              border: '1px solid var(--border)',
              borderRadius: 12,
              background: 'var(--surface)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formula */}
      <section style={{ padding: '0 28px 64px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>La fórmula</Kicker>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '12px 0 16px' }}>
          Cómo se calcula el índice
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 24 }}>
          El Índice Séneca es el promedio ponderado de cinco dimensiones, cada una calificada de 0 a 100. La ponderación es igual para cada dimensión (20% cada una).
        </p>

        <div style={{
          padding: 24,
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--surface)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 14,
          marginBottom: 24,
        }}>
          <div style={{ color: 'var(--muted)', marginBottom: 8, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fórmula</div>
          <div style={{ color: 'var(--text)' }}>
            Índice = (D1 + D2 + D3 + D4 + D5) / 5
          </div>
          <div style={{ color: 'var(--muted)', marginTop: 12, fontSize: 12 }}>
            Donde D1–D5 son las puntuaciones de cada dimensión (0–100)
          </div>
        </div>

        <div style={{
          padding: 20,
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 8,
          background: 'var(--surface)',
        }}>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)', margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>Nota importante:</strong> Una puntuación baja no indica que el político sea una mala persona o tenga una ideología incorrecta. Indica que existen discrepancias documentadas entre su discurso y su registro público. Una puntuación alta indica consistencia y transparencia documentadas, no necesariamente acuerdo ideológico con el evaluador.
          </p>
        </div>
      </section>

      {/* Dimensions */}
      <section style={{ padding: '0 28px 64px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>Las cinco dimensiones</Kicker>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '12px 0 24px' }}>
          Qué medimos y cómo
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {DIMENSIONS.map((d) => (
            <div key={d.key} style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              background: 'var(--surface)',
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'var(--bg)',
              }}>
                <Mono size={11} color="var(--muted)">{d.n}</Mono>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{d.name}</div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)', margin: '0 0 16px' }}>
                  {d.description}
                </p>
                <div>
                  <Mono size={10} color="var(--muted)" style={{ display: 'block', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Fuentes utilizadas
                  </Mono>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {d.sources.map((s) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        <Mono size={11} color="var(--text-2)">{s}</Mono>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Pipeline */}
      <section style={{ padding: '0 28px 64px', maxWidth: 800, margin: '0 auto' }}>
        <Kicker>Pipeline automatizado</Kicker>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em', margin: '12px 0 16px' }}>
          Inteligencia artificial en SÉNECA
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)', marginBottom: 24 }}>
          SÉNECA utiliza un pipeline automatizado construido con Make.com y Claude (Anthropic) para actualizar scores periódicamente. El proceso es el siguiente:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '01', title: 'Trigger automático', body: 'Un webhook recibe la señal de actualización, ya sea programada o manual, con el identificador del político a evaluar.' },
            { n: '02', title: 'Consulta a Supabase', body: 'El sistema recupera el expediente completo del político: alertas documentadas, dimensiones previas, fuentes citadas y resumen editorial.' },
            { n: '03', title: 'Evaluación con Claude', body: 'Claude (Anthropic) analiza el expediente como analista político no partidista y genera una puntuación actualizada con justificación por dimensión.' },
            { n: '04', title: 'Validación editorial', body: 'El score generado por IA se contrasta con el historial. Cambios mayores a 15 puntos requieren revisión editorial humana antes de publicarse.' },
            { n: '05', title: 'Actualización en base de datos', body: 'El score validado se escribe en Supabase y queda disponible inmediatamente en la plataforma y la extensión de Chrome.' },
          ].map(({ n, title, body }, i, arr) => (
            <div key={n} style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              gap: 20,
              paddingBottom: 28,
              paddingLeft: 24,
              borderLeft: i < arr.length - 1 ? '2px solid var(--border)' : '2px solid transparent',
              marginLeft: 24,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: -8,
                top: 0,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--accent)',
                border: '2px solid var(--bg)',
              }} />
              <div>
                <Mono size={11} color="var(--muted)">{n}</Mono>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)', margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
<section style={{ padding: '0 28px 96px', maxWidth: 800, margin: '0 auto' }}>
  <div style={{
    padding: 32,
    border: '1px solid var(--border)',
    borderRadius: 12,
    background: 'var(--surface)',
  }}>
    <Kicker>Por qué Séneca</Kicker>
    <h2 className="serif" style={{
      fontSize: 24,
      fontWeight: 500,
      color: 'var(--text)',
      letterSpacing: '-0.02em',
      margin: '12px 0 16px',
    }}>
      Un filósofo como espejo del poder
    </h2>
    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-2)', marginBottom: 16 }}>
      Lucio Anneo Séneca fue el filósofo más influyente de su época y consejero del emperador Nerón. Predicó la austeridad, la virtud y la coherencia entre pensamiento y acción — y sin embargo acumuló una de las fortunas más grandes del Imperio Romano. Su vida es la historia más antigua de un político que dice una cosa y hace otra.
    </p>
    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-2)', marginBottom: 16 }}>
      Lo nombramos así porque su contradicción no es una anomalía histórica — es el patrón que se repite en cada ciclo político. El discurso de austeridad y el patrimonio inexplicable. La promesa de transparencia y la opacidad en los registros. La defensa del pueblo y los contratos a empresas fantasma.
    </p>
    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-2)', margin: 0 }}>
      SÉNECA existe porque los ciudadanos merecen herramientas para exigir coherencia. No para juzgar ideologías — sino para documentar la distancia entre lo que se promete y lo que el registro público demuestra. La información ya existe. Solo faltaba ponerla en el lugar correcto: en manos de quienes votan.
    </p>
  </div>
</section>
    </div>
  )
}