const API_BASE = 'https://seneca-report.vercel.app/api/politicians'

// For local dev testing, swap to:
//const API_BASE = 'http://localhost:3000/api/politicians'

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
  'alito moreno': 'alejandro moreno',
  'rocha moya': 'rubén rocha',
  'álvarez máynez': 'jorge álvarez',
}

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

const cache = {}
let activePanel = null
let processedNodes = new WeakSet()

function scoreClass(score) {
  if (score >= 70) return 'seneca-ok'
  if (score >= 45) return 'seneca-warn'
  return ''
}

function scoreColor(score) {
  if (score >= 70) return '#15803d'
  if (score >= 45) return '#d97706'
  return '#dc2626'
}

function riskStyle(risk) {
  if (risk === 'BAJO')     return { bg: '#dcfce7', color: '#15803d', border: '#15803d' }
  if (risk === 'MODERADO') return { bg: '#fef3c7', color: '#d97706', border: '#d97706' }
  return { bg: '#fee2e2', color: '#dc2626', border: '#dc2626' }
}

async function fetchPolitician(name) {
  const key = name.toLowerCase()
  if (cache[key]) return cache[key]

  try {
    const res = await fetch(`${API_BASE}?q=${encodeURIComponent(name)}`)
    if (!res.ok) return null
    const data = await res.json()
    const match = data.politicians?.[0]
    if (match) cache[key] = match
    return match ?? null
  } catch {
    return null
  }
}

function closePanel() {
  if (activePanel) {
    activePanel.remove()
    activePanel = null
  }
}

function showPanel(politician, anchorEl) {
  closePanel()

  const rs = riskStyle(politician.risk)
  const color = scoreColor(politician.score)

  const panel = document.createElement('div')
  panel.className = 'seneca-panel'
  panel.innerHTML = `
    <div class="seneca-panel-header">
      <span class="seneca-panel-logo">⚖ SÉNECA</span>
      <button class="seneca-panel-close" id="seneca-close">✕</button>
    </div>
    <div class="seneca-panel-body">
      <div class="seneca-panel-name">${politician.name}</div>
      <div class="seneca-panel-role">${politician.party} · ${politician.state}</div>

      <div class="seneca-panel-score-row">
        <div>
          <div class="seneca-panel-score" style="color: ${color}">${politician.score}</div>
          <div class="seneca-panel-score-label">Índice Séneca / 100</div>
        </div>
        <div
          class="seneca-panel-risk"
          style="background:${rs.bg}; color:${rs.color}; border: 1px solid ${rs.border}"
        >
          Riesgo ${politician.risk.toLowerCase()}
        </div>
      </div>

      ${politician.topFlag ? `
        <div class="seneca-panel-flag">
          <div class="seneca-panel-flag-label">▲ Alerta documentada · ${politician.flagCount} total</div>
          <div class="seneca-panel-flag-title">${politician.topFlag.title}</div>
          <div class="seneca-panel-flag-body">${politician.topFlag.body}</div>
        </div>
      ` : ''}

      <div class="seneca-panel-dims">
        ${(politician.dimensions ?? []).slice(0, 5).map(d => {
          const dc = scoreColor(d.score * 5)
          const shortLabel = (d.label ?? d.key ?? '').split(' ')[0]
          return `
            <div class="seneca-panel-dim-row">
              <span class="seneca-panel-dim-label">${shortLabel}</span>
              <div class="seneca-panel-dim-bar-bg">
                <div class="seneca-panel-dim-bar" style="width:${d.score * 5}%; background:${dc}"></div>
              </div>
              <span class="seneca-panel-dim-score" style="color:${dc}">${d.score * 5}</span>
            </div>
          `
        }).join('')}
      </div>
    </div>
    <div class="seneca-panel-footer">
  <span
    class="seneca-panel-link"
    data-url="${politician.profileUrl}"
    style="cursor:pointer"
  >
    Ver expediente completo →
  </span>
  <span class="seneca-panel-source">seneca.report</span>
</div>
  `

  document.body.appendChild(panel)
  panel.querySelector('[data-url]').addEventListener('click', (e) => {
    window.open(e.target.dataset.url, '_blank')
  })
  activePanel = panel

  document.getElementById('seneca-close').addEventListener('click', closePanel)
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel() }, { once: true })
}

function injectBadge(textNode, name, politician) {
  const parent = textNode.parentNode
  if (!parent || parent.classList?.contains('seneca-badge')) return
  if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return

  if (parent.querySelector?.('.seneca-badge')) return

  const text = textNode.textContent
  const idx = text.toLowerCase().indexOf(name.toLowerCase())
  if (idx === -1) return

  const before = document.createTextNode(text.slice(0, idx))
  const after  = document.createTextNode(text.slice(idx + name.length))

  const badge = document.createElement('span')
  badge.className = `seneca-badge ${scoreClass(politician.score)}`
  badge.title = `Índice Séneca: ${politician.score}/100 · ${politician.flagCount} alertas`
  badge.innerHTML = `⚖ ${politician.score}`
  badge.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    showPanel(politician, badge)
  })

  const fragment = document.createDocumentFragment()
  fragment.appendChild(before)
  fragment.appendChild(document.createTextNode(name))
  fragment.appendChild(badge)
  fragment.appendChild(after)

  parent.replaceChild(fragment, textNode)
}

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

// Initial scan
scanAndInject()

// Watch for dynamic content (Facebook loads content as you scroll)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        scanAndInject(node)
      }
    }
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})