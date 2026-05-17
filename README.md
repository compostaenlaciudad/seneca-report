# SÉNECA — El antídoto al algoritmo

> *"Nusquam est qui ubique est."* — El que está en todas partes, no está en ninguna. — Séneca

## El problema

Cada semana, millones de mexicanos toman decisiones políticas basadas en publicidad disfrazada de información. Facebook muestra posts patrocinados de políticos con $685M en irregularidades documentadas. Twitter amplifica declaraciones de gobernadores acusados por el DOJ de EEUU de vínculos con el Cártel de Sinaloa. El algoritmo no distingue entre propaganda y verdad — y la mayoría de los ciudadanos tampoco tiene las herramientas para hacerlo.

**SÉNECA existe para romper ese hechizo.**

## La solución

SÉNECA es un sistema de dos componentes:

### 1. La base de datos pública — seneca-report.vercel.app
Un directorio de expedientes verificados de políticos mexicanos. Cada expediente incluye:
- **Índice Séneca** — score de 0 a 100 basado en 5 dimensiones de integridad pública
- **Alertas documentadas** — irregularidades con fuentes citadas
- **Dimensiones detalladas** — coherencia, transparencia patrimonial, rendición de cuentas
- **Fuentes verificables** — cada dato remite a un registro público oficial

### 2. La extensión de Chrome — El escudo político
Una extensión que detecta nombres de políticos mexicanos en **cualquier página web** — incluyendo Facebook, Twitter, El Financiero y cualquier sitio de noticias — e inyecta su expediente verificado en tiempo real, directamente sobre el contenido que estás leyendo.

**El momento que define el producto:** Un ciudadano está en Facebook viendo un post de Rubén Rocha Moya (gobernador de Sinaloa acusado formalmente por el DOJ el 29 de abril de 2026 de conspirar con el Cártel de Sinaloa). SÉNECA detecta su nombre automáticamente, muestra su score de **8/100** y su alerta crítica. El ciudadano selecciona su declaración "No tengo vínculos con el crimen organizado", hace clic en "Verificar con Séneca" — y en segundos Claude devuelve tres contradicciones documentadas con fuentes citadas.

Eso es SÉNECA. No compite con el algoritmo. **Vive dentro de él.**

## Demo en vivo

- **Plataforma:** https://seneca-report.vercel.app
- **Extensión:** Descargable en https://seneca-report.vercel.app/seneca-extension.zip
- **API pública:** https://seneca-report.vercel.app/api-docs

### Demo flow recomendado
1. Abrir https://seneca-report.vercel.app — ver el expediente destacado de Rubén Rocha Moya (score 8, DOJ indictment)
2. Buscar "Velasco" — ver los $1,185M en irregularidades documentadas
3. Comparar Rocha (8) vs Sheinbaum (74) — el delta visual lo dice todo
4. Instalar la extensión e ir a Facebook → buscar "Rubén Rocha Moya"
5. El badge ⚖8▲3 aparece automáticamente en sus posts
6. Seleccionar cualquier declaración suya → "Verificar con Séneca"

## Instalación de la extensión

1. Descargar el ZIP desde https://seneca-report.vercel.app/seneca-extension.zip
2. Descomprimir en cualquier carpeta
3. Abrir `chrome://extensions/` en Chrome, Arc, Brave o Edge
4. Activar **Modo desarrollador** (toggle superior derecho)
5. Clic en **Cargar sin empaquetar** → seleccionar la carpeta
6. El ícono ⚖ aparece en la barra del navegador con punto verde activo

## Stack técnico

| Componente | Tecnología |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| Base de datos | Supabase (PostgreSQL) |
| IA — Scoring | Claude Sonnet 4.6 (Anthropic) via Make.com |
| IA — Verificación | Claude Sonnet 4.6 (Anthropic) via API directa |
| Extensión | Chrome Extension MV3 (Vanilla JS) |
| Deploy | Vercel |
| Automatización | Make.com (pipeline webhook → Supabase → Claude → Supabase) |
| Imágenes | MiniMax Image-01 (busto de Séneca) |

## Perks del hackathon utilizados

| Perk | Uso |
|---|---|
| **Context7** | Documentación actualizada de Next.js y Supabase en Cursor durante el desarrollo |
| **Make.com** | Pipeline de scoring automatizado: webhook → Supabase → Claude → score actualizado |
| **v0** | Generación de UI para landing page móvil y página de búsqueda con filtros |
| **MiniMax** | Generación del busto de Séneca con expresiones para el hero de la landing |

## Arquitectura

```
seneca-report.vercel.app
├── /                    Landing — directorio + extensión
├── /buscar              Búsqueda con filtros en tiempo real
├── /candidatos/[slug]   Expediente completo con tabs
├── /comparar            Comparación lado a lado
├── /card/[slug]         Tarjeta compartible (OG image)
├── /metodologia         Metodología de scoring
├── /fuentes             Fuentes oficiales utilizadas
├── /api-docs            Documentación de la API pública
├── /api/politicians     API REST pública (CORS habilitado)
└── /api/verificar       Verificación de declaraciones con IA

seneca-extension/
├── manifest.json        Chrome Extension MV3
├── content.js           Detección y badges en tiempo real
├── overlay.css          Estilos del panel y badges
├── popup.html           UI del popup con toggle
├── popup.js             Lógica del toggle y estado
└── background.js        Badge verde en el ícono
```

## La metodología

El **Índice Séneca** evalúa 5 dimensiones de integridad pública (20% cada una):

1. **Integridad filosófica** — Coherencia ideológica documentada
2. **Coherencia dichos/hechos** — Promesas vs. registro verificable
3. **Transparencia patrimonial** — Declaraciones 3-de-3 vs. bienes reales
4. **Rendición de cuentas** — Respuesta ante fiscalizadores
5. **Independencia del poder** — Vínculos con grupos de interés

Todas las alertas tienen fuente citada. Todo el código es abierto. Cada error corregido queda en el historial.

## Por qué Séneca

Lucio Anneo Séneca predicó la austeridad y la virtud mientras acumulaba una de las fortunas más grandes del Imperio Romano. Su vida es la historia más antigua de un político que dice una cosa y hace otra. Lo nombramos así porque su contradicción no es una anomalía histórica — es el patrón que se repite en cada ciclo político mexicano.

La información ya existe. Solo faltaba ponerla en el lugar correcto: **en manos de quienes votan.**

## Licencia

CC BY-SA 4.0 — Datos abiertos. Código abierto. Sin patrocinadores.

---

*Construido en hack.indies.la 2026 · Chihuahua · by abri.*