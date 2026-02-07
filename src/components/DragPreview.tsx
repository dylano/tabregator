import styles from './DragPreview.module.css';

export interface DragPreviewProps {
  tab: chrome.tabs.Tab;
  x: number;
  y: number;
}

export function DragPreview({ tab, x, y }: DragPreviewProps) {
  return (
    <div
      className={styles.dragPreview}
      style={{
        left: x,
        top: y,
      }}
    >
      {tab.favIconUrl && (
        <img className={styles.dragPreviewFavicon} src={tab.favIconUrl} alt="" />
      )}
      <span className={styles.dragPreviewTitle}>{tab.title || 'Untitled'}</span>
    </div>
  );
}
