import type { Theme, GroupBy, SearchMode } from '../types';

export async function loadTheme(): Promise<Theme> {
  const result = await chrome.storage.local.get('theme');
  return (result.theme as Theme) || 'light';
}

export async function saveTheme(theme: Theme): Promise<void> {
  await chrome.storage.local.set({ theme });
}

export async function loadGroupBy(): Promise<GroupBy> {
  const result = await chrome.storage.local.get('groupBy');
  return (result.groupBy as GroupBy) || 'window';
}

export async function saveGroupBy(groupBy: GroupBy): Promise<void> {
  await chrome.storage.local.set({ groupBy });
}

export async function loadSearchMode(): Promise<SearchMode> {
  const result = await chrome.storage.local.get('searchMode');
  return (result.searchMode as SearchMode) || 'highlight';
}

export async function saveSearchMode(searchMode: SearchMode): Promise<void> {
  await chrome.storage.local.set({ searchMode });
}
