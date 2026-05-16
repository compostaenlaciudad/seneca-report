const API_BASE = 'https://seneca-report.vercel.app/api/politicians'
const VERIFICAR_API = 'https://seneca-report.vercel.app/api/verificar'

// For local dev testing, swap to:
// const API_BASE = 'http://localhost:3000/api/politicians'
// const VERIFICAR_API = 'http://localhost:3000/api/verificar'

const POLITICIAN_NAMES = [
  'Claudia Sheinbaum Pardo', 'Claudia Sheinbaum',
  'Ricardo Monreal Ávila', 'Ricardo Monreal',
  'Rubén Rocha Moya', 'Rubén Rocha', 'Rocha Moya',
  'Alejandro Moreno Cárdenas', 'Alejandro Moreno', 'Alito Moreno',
  'Layda Sansores San Román', 'Layda Sansores',
  'Manuel Velasco Coello', 'Manuel Velasco',
  'Jorge Romero Herrera', 'Jorge Romero',
  'Xóchitl Gálvez Ruiz', 'Xóchitl Gálvez',
  'Jorge Álvarez Máynez', 'Álvarez Máynez',
  'Alejandra Lagunes Soto Ruiz', 'Alejandra Lagunes',
]

const NAME_TO_QUERY = {
  'alito moreno':   'alejandro moreno',
  'rocha moya':     'rubén rocha',
  'álvarez máynez': 'jorge álvarez',
}

const cache = {}
let activePanel = null
let verifyPopup = null
let verifyPanel = null
let processedNodes = new WeakSet()
let isEnabled = true
let lastDetectedSlug = null

// ── Load toggle state ─────────────────────────────────────────

chrome.storage.sync.get(['senecaEnabled'], (result) => {
  isEnabled = result.senecaEnabled !== false
  updateIcon()
})

function updateIcon() {
  chrome.runtime.sendMessage({
    type: 'SET_ICON',
    enabled: isEnabled,
  }).catch(() => {})
}

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

function verdictStyle(verdict) {
  if (verdict === 'INCONSISTENTE') return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '✗' }
  if (verdict === 'CONSISTENTE')   return { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓' }
  return                                  { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '?' }
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
  } catch { return null }
}

async function verifyClaim(claim, slug, context) {
  try {
    const res = await fetch(VERIFICAR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claim,
        politician_slug: slug ?? null,
        context: context ?? window.location.href,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    console.log('SENECA verify result:', JSON.stringify(data))
    return data
  } catch(e) {
    console.error('SENECA verify error:', e)
    return null
  }
}

// ── Panel ────────────────────────────────────────────────────

function closePanel() {
  if (activePanel) { activePanel.remove(); activePanel = null }
}

function closeVerifyPanel() {
  if (verifyPanel) { verifyPanel.remove(); verifyPanel = null }
}

function closeVerifyPopup() {
  if (verifyPopup) { verifyPopup.remove(); verifyPopup = null }
}

function showPanel(politician) {
  closePanel()
  const rl = riskLabel(politician.risk)
  const rc = riskColors(rl.css)
  const color = scoreColor(politician.score)

  const caseId = 'SEN-' + String(
    [...politician.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 10000
  ).padStart(4, '0') + '-' + new Date().getFullYear()

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
        <div class="seneca-panel-risk" style="color:${rc.color};border-color:${rc.border}">
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
    if (e.key === 'Escape') { closePanel(); closeVerifyPanel(); closeVerifyPopup() }
  }, { once: true })
}

// ── Verify panel ─────────────────────────────────────────────

function showVerifyPanel(result, claim) {
  closeVerifyPanel()
  closePanel()

  const vs = verdictStyle(result.verdict)

  const panel = document.createElement('div')
  panel.className = 'seneca-panel'
  panel.style.cssText = 'width: 360px !important;'
  panel.innerHTML = `
    <div class="seneca-panel-header">
      <span class="seneca-panel-logo">
        <span class="seneca-panel-logo-mark">⚖</span>
        SÉNECA · VERIFICACIÓN
      </span>
      <button class="seneca-panel-close" id="seneca-verify-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="seneca-panel-body">

      <div style="
        padding: 10px 12px;
        background: ${vs.bg};
        border: 1px solid ${vs.border};
        border-left: 3px solid ${vs.color};
        border-radius: 4px;
        margin-bottom: 14px;
      ">
        <div style="
          font-size: 10px;
          font-weight: 700;
          color: ${vs.color};
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
          font-family: ui-monospace, monospace;
        ">${vs.icon} VEREDICTO · ${result.confidence ?? 'MEDIA'}</div>
        <div style="
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        ">${result.verdict_es ?? result.verdict ?? 'Sin veredicto'}</div>
      </div>

      <div style="
        font-size: 11px;
        color: #64748b;
        font-style: italic;
        padding: 8px 10px;
        background: #f8fafc;
        border-radius: 3px;
        margin-bottom: 14px;
        border-left: 2px solid #e2e8f0;
        line-height: 1.5;
        font-family: -apple-system, sans-serif;
      ">"${claim.length > 120 ? claim.slice(0, 120) + '…' : claim}"</div>

      <div style="font-size: 12px; color: #475569; line-height: 1.55; margin-bottom: 14px; font-family: -apple-system, sans-serif;">
      ${result.summary ?? 'No se encontró información suficiente para verificar esta declaración.'}
      </div>

      ${(result.contradictions ?? []).length > 0 ? `
        <div class="seneca-panel-section-label">Contradicciones documentadas</div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
          ${result.contradictions.map((c, i) => `
            <div style="
              padding: 10px 12px;
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-left: 3px solid #dc2626;
              border-radius: 3px;
            ">
              <div style="font-size: 10px; font-weight: 700; color: #dc2626; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; font-family: ui-monospace, monospace;">
                ▲ Contradicción ${i + 1}
              </div>
              <div style="font-size: 12px; color: #0f172a; line-height: 1.5; margin-bottom: 6px; font-family: -apple-system, sans-serif;">
                ${c.reality}
              </div>
              ${c.source ? `
                <div style="font-size: 10px; color: #94a3b8; font-family: ui-monospace, monospace; word-break: break-all;">
                  ${c.source}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

    </div>
    <div class="seneca-panel-footer">
      <span class="seneca-panel-link" data-url="${result.profileUrl}">
        Ver expediente completo →
      </span>
      <span class="seneca-panel-source">seneca.report</span>
    </div>
  `

  document.body.appendChild(panel)
  verifyPanel = panel

  panel.querySelector('[data-url]').addEventListener('click', (e) => {
    window.open(e.currentTarget.dataset.url, '_blank')
  })
  document.getElementById('seneca-verify-close').addEventListener('click', closeVerifyPanel)
}

// ── Verify popup (selection tooltip) ─────────────────────────

function showVerifyPopup(x, y, selectedText) {
  closeVerifyPopup()

  const popup = document.createElement('div')
  popup.className = 'seneca-verify-popup'
  popup.style.cssText = `
    position: fixed !important;
    left: ${Math.min(x, window.innerWidth - 220)}px !important;
    top: ${y - 44}px !important;
    z-index: 2147483647 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    background: #0f172a !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 8px 12px !important;
    font-family: ui-monospace, monospace !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 0.06em !important;
    cursor: pointer !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
    white-space: nowrap !important;
    animation: seneca-badge-enter 200ms ease both !important;
    user-select: none !important;
  `
  popup.innerHTML = `<span style="color:#1d4ed8;font-size:13px">⚖</span> Verificar con Séneca`

  popup.addEventListener('click', async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Show loading state
    popup.innerHTML = `<span style="opacity:0.7">Verificando…</span>`
    popup.style.background = '#1d4ed8 !important'

    const result = await verifyClaim(
      selectedText,
      lastDetectedSlug,
      window.location.href
    )

    closeVerifyPopup()

    if (result) {
      showVerifyPanel(result, selectedText)
    } else {
      // Show error briefly
      const err = document.createElement('div')
      err.style.cssText = `
        position: fixed !important;
        left: ${x}px !important;
        top: ${y - 44}px !important;
        z-index: 2147483647 !important;
        background: #dc2626 !important;
        color: white !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
        font-family: ui-monospace, monospace !important;
      `
      err.textContent = 'Error al verificar. Intenta de nuevo.'
      document.body.appendChild(err)
      setTimeout(() => err.remove(), 3000)
    }
  })

  document.body.appendChild(popup)
  verifyPopup = popup

  // Auto-hide after 5 seconds
  setTimeout(() => closeVerifyPopup(), 5000)
}

// ── Text selection listener ───────────────────────────────────

document.addEventListener('mouseup', (e) => {
  if (!isEnabled) return

  // Don't trigger inside our own panels
  if (e.target.closest?.('.seneca-panel') || e.target.closest?.('.seneca-verify-popup')) return

  setTimeout(() => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    if (!selectedText || selectedText.length < 15 || selectedText.length > 500) {
      closeVerifyPopup()
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    showVerifyPopup(
      rect.left + rect.width / 2 - 80,
      rect.top,
      selectedText
    )
  }, 100)
})

// Hide popup when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (!e.target.closest?.('.seneca-verify-popup')) {
    closeVerifyPopup()
  }
})

// ── Badge + highlight ────────────────────────────────────────

function injectBadge(textNode, name, politician) {
  if (!isEnabled) return

  const parent = textNode.parentNode
  if (!parent) return
  if (parent.closest?.('.seneca-panel')) return
  if (parent.closest?.('.seneca-badge')) return
  if (parent.classList?.contains('seneca-badge')) return
  if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return
  if (parent.closest?.('[data-seneca-processed]')) return
  if (parent.querySelector?.('.seneca-badge')) return

  const text = textNode.textContent
  const idx = text.toLowerCase().indexOf(name.toLowerCase())
  if (idx === -1) return

  try { parent.setAttribute('data-seneca-processed', 'true') } catch(e) {}

  // Track the last detected politician slug for verify feature
  if (politician.slug) lastDetectedSlug = politician.slug

  const before = document.createTextNode(text.slice(0, idx))
  const after  = document.createTextNode(text.slice(idx + name.length))

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
    nameSpan.style.setProperty('background', hc.bg.replace('0.10', '0.22'), 'important')
  })
  nameSpan.addEventListener('mouseleave', () => {
    nameSpan.style.setProperty('background', hc.bg, 'important')
  })
  nameSpan.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    showPanel(politician)
  }, true)

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
    showPanel(politician)
  }, true)

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
  if (!root || !isEnabled) return

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

// ── Message listener (from popup toggle) ─────────────────────

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE') {
    isEnabled = message.enabled
    chrome.storage.sync.set({ senecaEnabled: isEnabled })
    updateIcon()

    if (!isEnabled) {
      // Remove all badges and highlights
      document.querySelectorAll('.seneca-badge').forEach(el => el.remove())
      document.querySelectorAll('[data-seneca-processed]').forEach(el => {
        el.removeAttribute('data-seneca-processed')
      })
      closePanel()
      closeVerifyPanel()
      closeVerifyPopup()
      processedNodes = new WeakSet()
    } else {
      // Re-scan when re-enabled
      setTimeout(() => scanAndInject(), 500)
    }
  }
})

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
  setTimeout(() => {
    try { scanAndInject() } catch(e) { console.warn('SENECA scan error:', e) }
  }, 2000)

  setTimeout(() => {
    try { scanAndInject() } catch(e) {}
  }, 5000)

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