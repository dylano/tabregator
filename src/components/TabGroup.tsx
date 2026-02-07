import styles from './TabGroup.module.css';
import type { TabGroup as TabGroupType, GroupBy, DragState, DropTarget } from '../types';
import { TabItem } from './TabItem';

export interface TabGroupProps {
  group: TabGroupType;
  groupBy: GroupBy;
  searchTerm: string;
  selectedTabIds: Set<number>;
  onSwitchToTab: (tabId: number, windowId: number) => void;
  onCloseTab: (tabId: number) => void;
  onCloseWindow: (windowId: number) => void;
  onCloseGroup: (tabIds: number[]) => void;
  onToggleSelection: (tabId: number) => void;
  dragState: DragState | null;
  dropTarget: DropTarget | null;
  onMouseDown: (tab: chrome.tabs.Tab, e: React.MouseEvent) => void;
  onMouseUp: (switchToTab: () => void) => void;
  onMouseEnterTab: (windowId: number, index: number) => void;
}

export function TabGroup({
  group,
  groupBy,
  searchTerm,
  selectedTabIds,
  onSwitchToTab,
  onCloseTab,
  onCloseWindow,
  onCloseGroup,
  onToggleSelection,
  dragState,
  dropTarget,
  onMouseDown,
  onMouseUp,
  onMouseEnterTab,
}: TabGroupProps) {
  const windowId =
    groupBy === 'window' ? Number(group.id.replace('window-', '')) : null;

  const isDragEnabled = groupBy === 'window';

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
          {groupBy === 'domain' && (
            <button
              className={styles.btnCloseWindow}
              onClick={() => onCloseGroup(group.tabs.map((t) => t.id!))}
            >
              Close Group
            </button>
          )}
        </div>
      </div>
      {group.tabs.map((tab, index) => (
        <TabItem
          key={tab.id}
          tab={tab}
          searchTerm={searchTerm}
          isSelected={selectedTabIds.has(tab.id!)}
          onSwitch={() => onSwitchToTab(tab.id!, tab.windowId)}
          onClose={() => onCloseTab(tab.id!)}
          onToggleSelection={() => onToggleSelection(tab.id!)}
          isDragEnabled={isDragEnabled}
          isDragging={!!(dragState?.isDragging && dragState?.tabId === tab.id)}
          isDropTarget={
            !!(
              dragState?.isDragging &&
              dropTarget?.windowId === tab.windowId &&
              dropTarget?.index === index
            )
          }
          onMouseDown={(e) => onMouseDown(tab, e)}
          onMouseUp={() => onMouseUp(() => onSwitchToTab(tab.id!, tab.windowId))}
          onMouseEnter={() =>
            windowId !== null && onMouseEnterTab(windowId, index)
          }
        />
      ))}
      {isDragEnabled && (
        <div
          className={`${styles.dropZoneEnd} ${
            dragState?.isDragging ? styles.dropZoneVisible : ''
          } ${
            dropTarget?.windowId === windowId && dropTarget?.index === -1
              ? styles.dropZoneActive
              : ''
          }`}
          onMouseEnter={() => {
            if (windowId !== null) onMouseEnterTab(windowId, -1);
          }}
        >
          Drop here to move to end
        </div>
      )}
    </div>
  );
}
