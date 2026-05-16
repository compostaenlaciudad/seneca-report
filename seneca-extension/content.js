const API_BASE = 'https://seneca-report.vercel.app/api/politicians'

// For local dev testing, swap to:
// const API_BASE = 'http://localhost:3000/api/politicians'

const POLITICIAN_NAMES = [
  // Claudia Sheinbaum
  'Claudia Sheinbaum Pardo',
  'Claudia Sheinbaum',

  // Ricardo Monreal
  'Ricardo Monreal Ávila',
  'Ricardo Monreal',

  // Rubén Rocha Moya
  'Rubén Rocha Moya',
  'Rubén Rocha',
  'Rocha Moya',

  // Alejandro Moreno
  'Alejandro Moreno Cárdenas',
  'Alejandro Moreno',
  'Alito Moreno',

  // Layda Sansores
  'Layda Sansores San Román',
  'Layda Sansores',

  // Manuel Velasco
  'Manuel Velasco Coello',
  'Manuel Velasco',

  // Jorge Romero
  'Jorge Romero Herrera',
  'Jorge Romero',

  // Xóchitl Gálvez
  'Xóchitl Gálvez Ruiz',
  'Xóchitl Gálvez',

  // Jorge Álvarez Máynez
  'Jorge Álvarez Máynez',
  'Álvarez Máynez',

  // Alejandra Lagunes
  'Alejandra Lagunes Soto Ruiz',
  'Alejandra Lagunes',
]

const NAME_TO_QUERY = {
  'alito moreno':   'alejandro moreno',
  'rocha moya':     'rubén rocha',
  'álvarez máynez': 'jorge álvarez',
}

const cache = {}
let activePanel = null
let processedNodes = new WeakSet()

// ── Helpers ──────────────────────────────────────────────────

function scoreClass(score) {
  if (score >= 70) return 'seneca-ok'
  if (score >= 45) return 'seneca-warn'
  return ''
}

function scoreColor(score) {
  if (score >= 70) return '#16a34a'
  if (score >= 45) return '#d97706'
  return '#dc2626'
}

function riskLabel(r) {
  if (r === 'BAJO')     return { word: 'BAJO',     css: 'ok'   }
  if (r === 'MODERADO') return { word: 'MODERADO', css: 'warn' }
  if (r === 'ELEVADO')  return { word: 'ELEVADO',  css: 'warn' }
  return                       { word: 'ALTO',     css: 'alto' }
}

function riskColors(css) {
  if (css === 'ok')   return { color: '#16a34a', border: '#16a34a', bg: '#f0fdf4', soft: '#bbf7d0' }
  if (css === 'warn') return { color: '#d97706', border: '#d97706', bg: '#fffbeb', soft: '#fde68a' }
  return                     { color: '#dc2626', border: '#dc2626', bg: '#fef2f2', soft: '#fecaca' }
}

function highlightColor(score) {
  if (score >= 70) return { bg: 'rgba(22,163,74,0.10)',  border: '#16a34a' }
  if (score >= 45) return { bg: 'rgba(217,119,6,0.10)',  border: '#d97706' }
  return                  { bg: 'rgba(220,38,38,0.10)',  border: '#dc2626' }
}

// ── API ──────────────────────────────────────────────────────

async function fetchPolitician(name) {
  const key = name.toLowerCase()
  if (cache[key]) return cache[key]

  const query = NAME_TO_QUERY[key] ?? name

  try {
    const res = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}`)
    if (!res.ok) return null
    const data = await res.json()
    const match = data.politicians?.[0]
    if (match) cache[key] = match
    return match ?? null
  } catch {
    return null
  }
}

// ── Panel ────────────────────────────────────────────────────

function closePanel() {
  if (activePanel) {
    activePanel.remove()
    activePanel = null
  }
}

function showPanel(politician) {
  closePanel()

  const rl = riskLabel(politician.risk)
  const rc = riskColors(rl.css)
  const color = scoreColor(politician.score)

  const caseId = 'SEN-' + String(
    politician.id
      ? parseInt(politician.id.replace(/-/g, '').slice(0, 8), 16) % 10000
      : [...politician.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 10000
  ).toString().padStart(4, '0') + '-' + new Date().getFullYear()

  const panel = document.createElement('div')
  panel.className = 'seneca-panel'
  panel.innerHTML = `
    <div class="seneca-panel-header">
      <span class="seneca-panel-logo">
        <span class="seneca-panel-logo-mark">⚖</span>
        SÉNECA · EXPEDIENTE
      </span>
      <button class="seneca-panel-close" id="seneca-close" aria-label="Cerrar">✕</button>
    </div>

    <div class="seneca-panel-body">

      <div class="seneca-panel-meta">
        <span><strong>EXP.</strong> ${caseId}</span>
        <span><strong>${politician.flagCount ?? 0}</strong> ALERTAS</span>
      </div>

      <div class="seneca-panel-name">${politician.name}</div>
      <div class="seneca-panel-role">${politician.party} · ${politician.state}</div>

      <div class="seneca-panel-score-row">
        <div class="seneca-panel-score-block">
          <div class="seneca-panel-score" style="color:${color}">
            ${politician.score}<span class="seneca-panel-score-suffix">/100</span>
          </div>
          <div class="seneca-panel-score-label">Índice Séneca</div>
        </div>
        <div class="seneca-panel-risk"
             style="color:${rc.color};border-color:${rc.border}">
          <span class="seneca-panel-risk-prefix">RIESGO</span>
          <span class="seneca-panel-risk-level">${rl.word}</span>
        </div>
      </div>

      ${politician.topFlag ? `
        <div class="seneca-panel-flag"
             style="border-left-color:${rc.border};background:${rc.bg};border-color:${rc.soft}">
          <div class="seneca-panel-flag-label" style="color:${rc.color}">
            Alerta documentada · ${politician.flagCount} total
          </div>
          <div class="seneca-panel-flag-title">${politician.topFlag.title}</div>
          <div class="seneca-panel-flag-body">${politician.topFlag.body}</div>
        </div>
      ` : ''}

      <div class="seneca-panel-section-label">Dimensiones</div>

      <div class="seneca-panel-dims">
        ${(politician.dimensions ?? []).slice(0, 5).map(d => {
          const pct = d.score * 5
          const dc = scoreColor(pct)
          const label = (d.label ?? d.key ?? '').split(' ')[0].toUpperCase()
          return `
            <div class="seneca-panel-dim-row">
              <span class="seneca-panel-dim-label">${label}</span>
              <div class="seneca-panel-dim-bar-bg">
                <div class="seneca-panel-dim-bar" style="width:${pct}%;background:${dc}"></div>
              </div>
              <span class="seneca-panel-dim-score">${pct}</span>
            </div>
          `
        }).join('')}
      </div>

    </div>

    <div class="seneca-panel-footer">
      <span class="seneca-panel-link" data-url="${politician.profileUrl}">
        Ver expediente completo →
      </span>
      <span class="seneca-panel-source">seneca.report</span>
    </div>
  `

  document.body.appendChild(panel)
  activePanel = panel

  panel.querySelector('[data-url]').addEventListener('click', (e) => {
    window.open(e.currentTarget.dataset.url, '_blank')
  })
  document.getElementById('seneca-close').addEventListener('click', closePanel)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel()
  }, { once: true })
}

// ── Badge + highlight ────────────────────────────────────────

function injectBadge(textNode, name, politician) {
  const parent = textNode.parentNode
  if (!parent) return

  // Skip seneca's own elements
  if (parent.closest?.('.seneca-panel')) return
  if (parent.closest?.('.seneca-badge')) return
  if (parent.classList?.contains('seneca-badge')) return
  if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return

  // Skip if parent or ancestor already processed
  if (parent.closest?.('[data-seneca-processed]')) return
  if (parent.querySelector?.('.seneca-badge')) return

  const text = textNode.textContent
  const idx = text.toLowerCase().indexOf(name.toLowerCase())
  if (idx === -1) return

  // Mark parent as processed to prevent re-injection
  try { parent.setAttribute('data-seneca-processed', 'true') } catch(e) {}

  const before = document.createTextNode(text.slice(0, idx))
  const after  = document.createTextNode(text.slice(idx + name.length))

  // Highlighted name span
  const hc = highlightColor(politician.score)
  const nameSpan = document.createElement('span')
  nameSpan.style.cssText = [
    `background: ${hc.bg} !important`,
    `border-bottom: 2px solid ${hc.border} !important`,
    `border-radius: 2px !important`,
    `padding: 0 2px !important`,
    `cursor: pointer !important`,
    `display: inline !important`,
    `transition: background 150ms ease !important`,
  ].join(';')
  nameSpan.textContent = name

  nameSpan.addEventListener('mouseenter', () => {
    nameSpan.style.setProperty('background',
      hc.bg.replace('0.10', '0.22'), 'important')
  })
  nameSpan.addEventListener('mouseleave', () => {
    nameSpan.style.setProperty('background', hc.bg, 'important')
  })
  nameSpan.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    showPanel(politician)
  }, true)

  // Badge
  const badge = document.createElement('span')
  badge.className = `seneca-badge ${scoreClass(politician.score)}`
  badge.title = `Índice Séneca: ${politician.score}/100 · ${politician.flagCount} alertas documentadas`

  const alerts = politician.flagCount > 0
    ? `<span class="seneca-badge-alerts">▲${politician.flagCount}</span>`
    : ''

  badge.innerHTML = `
    <span class="seneca-badge-brand">⚖</span>
    <span class="seneca-badge-score">${politician.score}</span>
    ${alerts}
  `
  badge.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    showPanel(politician)
  }, true) // true = capture phase, fires before Facebook's handler

  const fragment = document.createDocumentFragment()
  fragment.appendChild(before)
  fragment.appendChild(nameSpan)
  fragment.appendChild(badge)
  fragment.appendChild(after)

  parent.replaceChild(fragment, textNode)
}

// ── DOM scanning ─────────────────────────────────────────────

function getTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const p = node.parentElement
        if (!p) return NodeFilter.FILTER_REJECT
        if (['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT'].includes(p.tagName))
          return NodeFilter.FILTER_REJECT
        if (p.classList?.contains('seneca-badge') || p.classList?.contains('seneca-panel'))
          return NodeFilter.FILTER_REJECT
        if (p.closest?.('.seneca-panel') || p.closest?.('.seneca-badge'))
          return NodeFilter.FILTER_REJECT
        if (p.closest?.('[data-seneca-processed]'))
          return NodeFilter.FILTER_REJECT
        if (processedNodes.has(node))
          return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  const nodes = []
  let node
  while ((node = walker.nextNode())) nodes.push(node)
  return nodes
}

async function scanAndInject(root = document.body) {
  if (!root) return

  const textNodes = getTextNodes(root)

  for (const name of POLITICIAN_NAMES) {
    const matched = textNodes.filter(n =>
      n.textContent.toLowerCase().includes(name.toLowerCase())
    )

    if (matched.length === 0) continue

    const politician = await fetchPolitician(name)
    if (!politician) continue

    for (const node of matched) {
      if (processedNodes.has(node)) continue
      processedNodes.add(node)
      injectBadge(node, name, politician)
    }
  }
}

// ── Init ─────────────────────────────────────────────────────

console.log('SENECA loaded')

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const debouncedScan = debounce((node) => {
  try { scanAndInject(node) } catch(e) {}
}, 500)

try {
  // Initial scan after page loads
  setTimeout(() => {
    try { scanAndInject() } catch(e) { console.warn('SENECA scan error:', e) }
  }, 2000)

  // Second scan for late-loading content
  setTimeout(() => {
    try { scanAndInject() } catch(e) {}
  }, 5000)

  // Facebook-specific: poll every 3s for new feed content
  if (window.location.hostname.includes('facebook.com')) {
    setInterval(() => {
      try { scanAndInject() } catch(e) {}
    }, 3000)
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.classList?.contains('seneca-panel') ||
            node.classList?.contains('seneca-badge') ||
            node.closest?.('.seneca-panel') ||
            node.hasAttribute?.('data-seneca-processed')
          ) continue
          debouncedScan(node)
        }
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
} catch(e) {
  console.warn('SENECA init error:', e)
}