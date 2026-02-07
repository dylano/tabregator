import styles from './TabItem.module.css';
import { cleanUrl } from '../utils/tabs';
import { highlightText } from '../utils/text';

export interface TabItemProps {
  tab: chrome.tabs.Tab;
  searchTerm: string;
  isSelected: boolean;
  onSwitch: () => void;
  onClose: () => void;
  onToggleSelection: () => void;
  isDragEnabled: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseEnter: () => void;
}

export function TabItem({
  tab,
  searchTerm,
  isSelected,
  onSwitch,
  onClose,
  onToggleSelection,
  isDragEnabled,
  isDragging,
  isDropTarget,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}: TabItemProps) {
  const title = tab.title || 'Untitled';
  const url = cleanUrl(tab.url || '');

  const itemClasses = [
    styles.tabItem,
    tab.active && styles.active,
    isSelected && styles.selected,
    isDragging && styles.dragging,
    isDropTarget && styles.dropTarget,
    isDragEnabled && styles.draggable,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={itemClasses}
      onClick={isDragEnabled ? undefined : onSwitch}
      onMouseDown={isDragEnabled ? onMouseDown : undefined}
      onMouseUp={isDragEnabled ? onMouseUp : undefined}
      onMouseEnter={isDragEnabled ? onMouseEnter : undefined}
    >
      <input
        type="checkbox"
        className={styles.tabCheckbox}
        checked={isSelected}
        onChange={onToggleSelection}
        onClick={(e) => e.stopPropagation()}
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
