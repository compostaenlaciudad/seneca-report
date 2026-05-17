chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SET_ICON') {
      if (message.enabled) {
        chrome.action.setBadgeText({ text: '●' })
        chrome.action.setBadgeBackgroundColor({ color: '#16a34a' })
        chrome.action.setTitle({ title: 'SÉNECA — Monitoreo activo' })
      } else {
        chrome.action.setBadgeText({ text: 'OFF' })
        chrome.action.setBadgeBackgroundColor({ color: '#94a3b8' })
        chrome.action.setTitle({ title: 'SÉNECA — Pausado' })
      }
    }
  })
  
  // Set green badge on install/startup
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: '●' })
    chrome.action.setBadgeBackgroundColor({ color: '#16a34a' })
    chrome.action.setTitle({ title: 'SÉNECA — Monitoreo activo' })
  })
  
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(['senecaEnabled'], (result) => {
      const enabled = result.senecaEnabled !== false
      if (enabled) {
        chrome.action.setBadgeText({ text: '●' })
        chrome.action.setBadgeBackgroundColor({ color: '#16a34a' })
      } else {
        chrome.action.setBadgeText({ text: 'OFF' })
        chrome.action.setBadgeBackgroundColor({ color: '#94a3b8' })
      }
    })
  })