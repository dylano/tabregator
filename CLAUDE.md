# Tabregator

A Chrome extension for managing all browser tabs across windows from a single dashboard.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** (rolldown-vite) for bundling
- **CSS Modules** for component-scoped styling
- **Chrome Extension Manifest V3**

## Project Structure

```
src/
  App.tsx          # Main component - all state, tab operations, rendering
  main.tsx         # React entry point
  App.module.css   # All component styling, theme variables
  index.css        # Global styles
public/
  manifest.json    # Extension manifest (permissions, service worker, commands)
  background.js    # Service worker - opens/focuses dashboard tab
  icons/           # Extension icons (16, 48, 128px)
popup.html         # HTML entry point
```

## Key Features

- View all tabs across all Chrome windows
- Group tabs by window or by domain
- Search/filter tabs by title
- Switch to any tab with one click
- Close individual tabs or entire windows
- Bulk select and close tabs
- Light/dark theme with persistence
- Keyboard shortcut: `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
- Auto-updates when tabs change
- **Drag and drop** (window grouping mode):
  - Reorder tabs within a window
  - Move tabs between windows
  - Drop on "Move to new window" zone to open tab in a new window
  - Press ESC to cancel drag

## Chrome APIs Used

- `chrome.tabs` - query, update, remove tabs
- `chrome.windows` - query, update, focus windows
- `chrome.storage.local` - persist theme and grouping preferences
- `chrome.action` - handle extension icon clicks

## Architecture Notes

### State (in App.tsx)
- `tabs: Tab[]` - all open tabs (excludes the dashboard itself)
- `searchTerm: string` - current filter
- `selectedTabIds: Set<number>` - selected for bulk operations
- `theme: 'light' | 'dark'` - persisted to storage
- `groupBy: 'window' | 'domain'` - persisted to storage
- `dragState: DragState | null` - tracks active drag operation (tab id, source window, cursor position)
- `dropTarget: { windowId, index } | null` - current drop target during drag

### Key Functions
- `fetchTabs()` - queries chrome.tabs API, filters out dashboard
- `switchToTab()` - activates tab and focuses its window
- `closeTab()` / `closeSelectedTabs()` / `closeWindow()` - removal operations
- `moveTab()` - moves tab to new position/window via `chrome.tabs.move()`
- `moveTabToNewWindow()` - creates new window with tab via `chrome.windows.create()`

### Event Listeners
The app listens to `chrome.tabs.onCreated`, `onRemoved`, `onUpdated`, and `chrome.windows.onRemoved` to auto-refresh the tab list.

### Derived State (useMemo)
- `filteredTabs` - tabs matching search term
- `tabGroups` - tabs grouped by window ID or domain

## Styling

Theme variables are defined in App.module.css with `[data-theme="dark"]` and `[data-theme="light"]` selectors. Layout uses CSS Grid with `repeat(auto-fit, minmax(500px, 1fr))` for responsive columns.

## Build & Development

**Node version**: This project requires Node 24. Run `nvm use 24` to switch to the correct version (see `engines` in package.json).

```bash
npm run dev      # Dev server with hot reload
npm run build    # TypeScript compile + Vite build to dist/
npm run lint     # ESLint
```

Output goes to `dist/` - load this as an unpacked extension in Chrome.

## Permissions

Minimal permissions in manifest.json:
- `tabs` - required to query and manage tabs
- `storage` - required to persist user preferences
