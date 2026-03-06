import styles from './DragPreview.module.css';

export interface DragPreviewProps {
  tabs: chrome.tabs.Tab[];
  x: number;
  y: number;
}

export function DragPreview({ tabs, x, y }: DragPreviewProps) {
  const firstTab = tabs[0];
  const count = tabs.length;

  return (
    <div
      className={styles.dragPreview}
      style={{
        left: x,
        top: y,
      }}
    >
      {firstTab.favIconUrl && (
        <img className={styles.dragPreviewFavicon} src={firstTab.favIconUrl} alt="" />
      )}
      <span className={styles.dragPreviewTitle}>
        {count > 1 ? `${count} tabs` : firstTab.title || 'Untitled'}
      </span>
    </div>
  );
}
