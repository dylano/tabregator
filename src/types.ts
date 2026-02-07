export type Theme = 'light' | 'dark';
export type GroupBy = 'window' | 'domain';

export interface TabGroup {
  id: string;
  label: string;
  tabs: chrome.tabs.Tab[];
}

export interface DragState {
  tabId: number;
  sourceWindowId: number;
  sourceIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

export interface DropTarget {
  windowId: number;
  index: number;
}
