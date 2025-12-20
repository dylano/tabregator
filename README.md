# Tabregator

A Chrome extension for managing all your browser tabs across windows from a single dashboard.

## Features

- View all open tabs across all Chrome windows
- Search/filter tabs by title in real-time
- Click any tab to switch to it (activates tab and focuses window)
- Close individual tabs or select multiple tabs to close at once
- Close entire windows with all their tabs
- Light and dark mode themes with persistent preference
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
- Use checkboxes to select multiple tabs, then click "Close Selected"
- Click "Close Window" to close all tabs in a window
- Toggle the sun/moon icon to switch between light and dark themes
