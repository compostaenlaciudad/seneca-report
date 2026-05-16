chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SET_ICON') {
      if (message.enabled) {
        chrome.action.setBadgeText({ text: '' })
        chrome.action.setTitle({ title: 'SÉNECA — Activo' })
      } else {
        chrome.action.setBadgeText({ text: 'OFF' })
        chrome.action.setBadgeBackgroundColor({ color: '#94a3b8' })
        chrome.action.setTitle({ title: 'SÉNECA — Desactivado' })
      }
    }
  })