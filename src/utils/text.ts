import styles from '../App.module.css';

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function highlightText(text: string, searchTerm: string): string {
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
