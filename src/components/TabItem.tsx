import styles from './TabItem.module.css';
import { cleanUrl } from '../utils/tabs';
import { highlightText } from '../utils/text';

export interface TabItemProps {
  tab: chrome.tabs.Tab;
  searchTerm: string;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
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
  isHighlighted,
  isDimmed,
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
    isSelected && styles.selected,
    isHighlighted && styles.highlighted,
    isDimmed && styles.dimmed,
    isDragging && styles.dragging,
    isDropTarget && styles.dropTarget,
    isDragEnabled && styles.draggable,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={itemClasses}
      onMouseEnter={isDragEnabled ? onMouseEnter : undefined}
    >
      {tab.pinned ? (
        <svg
          className={styles.pinIcon}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <title>Pinned tab</title>
          <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z" />
        </svg>
      ) : (
        <input
          type="checkbox"
          className={styles.tabCheckbox}
          checked={isSelected}
          onChange={onToggleSelection}
        />
      )}
      <div
        className={styles.tabClickArea}
        onClick={isDragEnabled ? undefined : onSwitch}
        onMouseDown={isDragEnabled ? onMouseDown : undefined}
        onMouseUp={isDragEnabled ? onMouseUp : undefined}
      >
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
          <div
            className={styles.tabUrl}
            title={tab.url}
            dangerouslySetInnerHTML={{ __html: highlightText(url, searchTerm) }}
          />
        </div>
      </div>
      <button className={styles.tabClose} title="Close tab" onClick={onClose}>
        x
      </button>
    </div>
  );
}
