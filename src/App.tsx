import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './App.module.css';

type Tab = chrome.tabs.Tab;
type Theme = 'light' | 'dark';
type GroupBy = 'window' | 'domain';

interface TabGroup {
  id: string;
  label: string;
  tabs: Tab[];
}

async function fetchTabs() {
  const allTabs = await chrome.tabs.query({});
  // Filter out the dashboard tab itself
  const dashboardUrl = chrome.runtime.getURL('popup.html');
  return allTabs.filter((tab) => !tab.url?.startsWith(dashboardUrl));
}

async function loadTheme(): Promise<Theme> {
  const result = await chrome.storage.local.get('theme');
  return (result.theme as Theme) || 'light';
}

async function saveTheme(theme: Theme) {
  await chrome.storage.local.set({ theme });
}

async function loadGroupBy(): Promise<GroupBy> {
  const result = await chrome.storage.local.get('groupBy');
  return (result.groupBy as GroupBy) || 'window';
}

async function saveGroupBy(groupBy: GroupBy) {
  await chrome.storage.local.set({ groupBy });
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(new Set());
  const [theme, setTheme] = useState<Theme>('light');
  const [groupBy, setGroupBy] = useState<GroupBy>('window');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load theme and groupBy on mount
  useEffect(() => {
    loadTheme().then(setTheme);
    loadGroupBy().then(setGroupBy);
  }, []);

  // Focus and select search input when window gains focus
  useEffect(() => {
    const handleWindowFocus = () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, []);

  // Update body background when theme changes
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === 'dark' ? '#1e1e1e' : '#ffffff';
  }, [theme]);

  // Load tabs and listen for changes
  useEffect(() => {
    fetchTabs().then(setTabs);

    const handleChange = () => {
      fetchTabs().then(setTabs);
    };

    chrome.tabs.onCreated.addListener(handleChange);
    chrome.tabs.onRemoved.addListener(handleChange);
    chrome.tabs.onUpdated.addListener(handleChange);
    chrome.windows.onRemoved.addListener(handleChange);

    return () => {
      chrome.tabs.onCreated.removeListener(handleChange);
      chrome.tabs.onRemoved.removeListener(handleChange);
      chrome.tabs.onUpdated.removeListener(handleChange);
      chrome.windows.onRemoved.removeListener(handleChange);
    };
  }, []);

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  }

  const filteredTabs = useMemo(() => {
    if (!searchTerm.trim()) return tabs;
    const term = searchTerm.toLowerCase();
    return tabs.filter((tab) => tab.title?.toLowerCase().includes(term));
  }, [tabs, searchTerm]);

  const tabGroups = useMemo((): TabGroup[] => {
    if (groupBy === 'window') {
      const groups: Record<number, Tab[]> = {};
      for (const tab of filteredTabs) {
        const wid = tab.windowId;
        if (!groups[wid]) groups[wid] = [];
        groups[wid].push(tab);
      }
      const windowIds = Object.keys(groups)
        .map(Number)
        .sort((a, b) => a - b);
      return windowIds.map((windowId, index) => ({
        id: `window-${windowId}`,
        label: `Window ${index + 1}`,
        tabs: groups[windowId],
      }));
    } else {
      const groups: Record<string, Tab[]> = {};
      for (const tab of filteredTabs) {
        const domain = getDomain(tab.url || '');
        if (!groups[domain]) groups[domain] = [];
        groups[domain].push(tab);
      }
      return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([domain, tabs]) => ({
          id: `domain-${domain}`,
          label: domain,
          tabs,
        }));
    }
  }, [filteredTabs, groupBy]);

  async function switchToTab(tabId: number, windowId: number) {
    await chrome.tabs.update(tabId, { active: true });
    await chrome.windows.update(windowId, { focused: true });
  }

  async function closeTab(tabId: number) {
    await chrome.tabs.remove(tabId);
    setSelectedTabIds((prev) => {
      const next = new Set(prev);
      next.delete(tabId);
      return next;
    });
    const updatedTabs = await fetchTabs();
    setTabs(updatedTabs);
  }

  async function closeSelectedTabs() {
    const ids = Array.from(selectedTabIds);
    if (ids.length === 0) return;
    await chrome.tabs.remove(ids);
    setSelectedTabIds(new Set());
    const updatedTabs = await fetchTabs();
    setTabs(updatedTabs);
  }

  async function closeWindow(windowId: number) {
    await chrome.windows.remove(windowId);
    setSelectedTabIds((prev) => {
      const next = new Set(prev);
      tabs
        .filter((t) => t.windowId === windowId)
        .forEach((t) => next.delete(t.id!));
      return next;
    });
    const updatedTabs = await fetchTabs();
    setTabs(updatedTabs);
  }

  function toggleSelection(tabId: number) {
    setSelectedTabIds((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) {
        next.delete(tabId);
      } else {
        next.add(tabId);
      }
      return next;
    });
  }

  const tabCount = filteredTabs.length;
  const totalCount = tabs.length;
  const selectedCount = selectedTabIds.size;

  const containerClasses = [
    styles.container,
    theme === 'dark' ? styles.dark : styles.light,
  ].join(' ');

  return (
    <div className={containerClasses}>
      <header className={styles.header}>
        <input
          ref={searchInputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search tabs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className={styles.headerActions}>
          <div className={styles.headerLeft}>
            <span className={styles.tabCount}>
              {tabCount === totalCount
                ? `${totalCount} tab${totalCount !== 1 ? 's' : ''}`
                : `${tabCount} of ${totalCount} tabs`}
            </span>
          </div>
          <div className={styles.headerRight}>
            Group by:
            <div className={styles.toggleSwitch}>
              <button
                className={`${styles.toggleOption} ${
                  groupBy === 'window' ? styles.toggleActive : ''
                }`}
                onClick={() => {
                  setGroupBy('window');
                  saveGroupBy('window');
                }}
              >
                Window
              </button>
              <button
                className={`${styles.toggleOption} ${
                  groupBy === 'domain' ? styles.toggleActive : ''
                }`}
                onClick={() => {
                  setGroupBy('domain');
                  saveGroupBy('domain');
                }}
              >
                Domain
              </button>
            </div>
            <button
              className={styles.btnIcon}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={selectedCount === 0}
              onClick={closeSelectedTabs}
            >
              {selectedCount > 0
                ? `Close Selected (${selectedCount})`
                : 'Close Selected'}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.tabList}>
        {filteredTabs.length === 0 ? (
          <div className={styles.emptyState}>No tabs found</div>
        ) : (
          tabGroups.map((group) => (
            <TabGroupComponent
              key={group.id}
              group={group}
              groupBy={groupBy}
              searchTerm={searchTerm}
              selectedTabIds={selectedTabIds}
              onSwitchToTab={switchToTab}
              onCloseTab={closeTab}
              onCloseWindow={closeWindow}
              onToggleSelection={toggleSelection}
            />
          ))
        )}
      </main>
    </div>
  );
}

interface TabGroupProps {
  group: TabGroup;
  groupBy: GroupBy;
  searchTerm: string;
  selectedTabIds: Set<number>;
  onSwitchToTab: (tabId: number, windowId: number) => void;
  onCloseTab: (tabId: number) => void;
  onCloseWindow: (windowId: number) => void;
  onToggleSelection: (tabId: number) => void;
}

function TabGroupComponent({
  group,
  groupBy,
  searchTerm,
  selectedTabIds,
  onSwitchToTab,
  onCloseTab,
  onCloseWindow,
  onToggleSelection,
}: TabGroupProps) {
  // For window groups, extract the windowId from the group id
  const windowId =
    groupBy === 'window' ? Number(group.id.replace('window-', '')) : null;

  return (
    <div className={styles.windowGroup}>
      <div className={styles.windowHeader}>
        <span className={styles.windowTitle}>{group.label}</span>
        <div className={styles.windowActions}>
          <span className={styles.windowTabCount}>
            {group.tabs.length} tab{group.tabs.length !== 1 ? 's' : ''}
          </span>
          {groupBy === 'window' && windowId !== null && (
            <button
              className={styles.btnCloseWindow}
              onClick={() => onCloseWindow(windowId)}
            >
              Close Window
            </button>
          )}
        </div>
      </div>
      {group.tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          searchTerm={searchTerm}
          isSelected={selectedTabIds.has(tab.id!)}
          onSwitch={() => onSwitchToTab(tab.id!, tab.windowId)}
          onClose={() => onCloseTab(tab.id!)}
          onToggleSelection={() => onToggleSelection(tab.id!)}
        />
      ))}
    </div>
  );
}

interface TabItemProps {
  tab: Tab;
  searchTerm: string;
  isSelected: boolean;
  onSwitch: () => void;
  onClose: () => void;
  onToggleSelection: () => void;
}

function TabItem({
  tab,
  searchTerm,
  isSelected,
  onSwitch,
  onClose,
  onToggleSelection,
}: TabItemProps) {
  const title = tab.title || 'Untitled';
  const url = cleanUrl(tab.url || '');

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('input, button')) return;
    onSwitch();
  }

  const itemClasses = [
    styles.tabItem,
    tab.active && styles.active,
    isSelected && styles.selected,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={itemClasses} onClick={handleClick}>
      <input
        type="checkbox"
        className={styles.tabCheckbox}
        checked={isSelected}
        onChange={onToggleSelection}
      />
      {tab.favIconUrl ? (
        <img
          className={styles.tabFavicon}
          src={tab.favIconUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className={styles.tabFaviconPlaceholder} />
      )}
      <div className={styles.tabInfo}>
        <div
          className={styles.tabTitle}
          title={title}
          dangerouslySetInnerHTML={{ __html: highlightText(title, searchTerm) }}
        />
        <div className={styles.tabUrl} title={tab.url}>
          {url}
        </div>
      </div>
      <button className={styles.tabClose} title="Close tab" onClick={onClose}>
        x
      </button>
    </div>
  );
}

function cleanUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}

function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return escapeHtml(text);

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerSearch);

  if (index === -1) return escapeHtml(text);

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return (
    escapeHtml(before) +
    `<span class="${styles.highlight}">` +
    escapeHtml(match) +
    '</span>' +
    escapeHtml(after)
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default App;
