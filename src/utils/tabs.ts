export async function fetchTabs(): Promise<chrome.tabs.Tab[]> {
  const allTabs = await chrome.tabs.query({});
  const dashboardUrl = chrome.runtime.getURL('popup.html');
  return allTabs.filter((tab) => !tab.url?.startsWith(dashboardUrl));
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

export function cleanUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}
