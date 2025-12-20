// Open dashboard in a new tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  openDashboard()
})

// Open dashboard in a new tab (or focus existing one)
async function openDashboard() {
  const dashboardUrl = chrome.runtime.getURL('popup.html')

  // Check if dashboard tab already exists
  const tabs = await chrome.tabs.query({ url: dashboardUrl })

  if (tabs.length > 0) {
    // Focus existing dashboard tab
    await chrome.tabs.update(tabs[0].id, { active: true })
    await chrome.windows.update(tabs[0].windowId, { focused: true })
  } else {
    // Open new dashboard tab
    await chrome.tabs.create({ url: dashboardUrl })
  }
}
