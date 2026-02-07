# Tabregator

A Chrome extension for managing all your browser tabs across windows from a single dashboard.

## Features

- View all open tabs across all Chrome windows
- Group tabs by window or by domain
- Search/filter tabs by title in real-time
- Click any tab to switch to it (activates tab and focuses window)
- Close individual tabs or select multiple tabs to close at once
- Close entire windows with all their tabs
- **Drag and drop tabs** (in window view) to reorder within a window, move between windows, or create a new window
- Light and dark mode themes with persistent preference
- Responsive layout: automatically switches to two-column grid on wide screens
- Auto-updates when tabs or windows are created, closed, or changed
- Keyboard shortcut to open dashboard: `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows/Linux)

## Development

Requires Node.js 20.19+ or 22.12+ (Node 24 recommended).

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Development mode with hot reload
npm run dev
```

## Installation

1. Build the extension with `npm run build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `dist` folder
5. The Tabregator icon will appear in your toolbar

## Usage

- Click the Tabregator icon or press `Cmd+Shift+M` to open the dashboard
- Type in the search box to filter tabs by title
- Click a tab row to switch to that tab
- Use the Window/Domain toggle to group tabs by browser window or by domain
- Use checkboxes to select multiple tabs, then click "Close Selected"
- Click "Close Window" to close all tabs in a window (when grouped by window)
- Toggle the sun/moon icon to switch between light and dark themes
- **Drag and drop** (when grouped by Window):
  - Drag a tab to reorder it within its window
  - Drag a tab to another window group to move it there
  - Drag a tab to the yellow "Move to new window" zone to open it in a new window
  - Press ESC while dragging to cancel
