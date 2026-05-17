const toggleBtn = document.getElementById('toggle-btn')
const statusDot = document.getElementById('status-dot')
const statusText = document.getElementById('status-text')
const pausedOverlay = document.getElementById('paused-overlay')
const activeContent = document.getElementById('active-content')

chrome.storage.sync.get(['senecaEnabled'], (result) => {
  const enabled = result.senecaEnabled !== false
  updateUI(enabled)
})

toggleBtn.addEventListener('click', () => {
  chrome.storage.sync.get(['senecaEnabled'], (result) => {
    const current = result.senecaEnabled !== false
    const next = !current

    chrome.storage.sync.set({ senecaEnabled: next })
    updateUI(next)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE', enabled: next })
          .catch(() => {})
      }
    })
  })
})

function updateUI(enabled) {
  if (enabled) {
    statusDot.className = 'status-dot active'
    statusText.className = 'status-text active'
    statusText.textContent = 'Monitoreo activo'
    toggleBtn.className = 'toggle-btn active'
    toggleBtn.textContent = 'Pausar'
    pausedOverlay.classList.remove('visible')
    activeContent.style.display = 'block'
  } else {
    statusDot.className = 'status-dot paused'
    statusText.className = 'status-text paused'
    statusText.textContent = 'Pausado'
    toggleBtn.className = 'toggle-btn paused'
    toggleBtn.textContent = 'Activar'
    pausedOverlay.classList.add('visible')
    activeContent.style.display = 'none'
  }
}