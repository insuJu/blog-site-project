import styles from './EditorModeSelector.module.css';

export default function EditorModeSelector({
  editorMode, modeLabels, controls, onModeChange, fontSize, onFontSizeChange, disabled, sourceActions,
}) {
  return (
    <div
      className={sourceActions ? `${styles.modeSelector} ${styles.sourceModeSelector}` : styles.modeSelector}
      role="group"
      aria-label="본문 편집 방식"
    >
      {Object.entries(modeLabels).map(([mode, title]) => (
        <button
          key={mode}
          type="button"
          className={`${styles.modeButton} ${editorMode === mode ? styles.activeModeButton : ''}`}
          aria-controls={controls}
          aria-pressed={editorMode === mode}
          disabled={disabled}
          onClick={() => onModeChange(mode)}
        >
          {title}
        </button>
      ))}
      {editorMode === 'visual' && (
        <label className={styles.fontSizeControl}>
          <span>보기 크기</span>
          <select
            className={styles.fontSizeSelect}
            value={fontSize}
            disabled={disabled}
            onChange={(event) => onFontSizeChange(event.target.value)}
          >
            <option value="small">작게</option>
            <option value="medium">보통</option>
            <option value="large">크게</option>
            <option value="xlarge">매우 크게</option>
          </select>
        </label>
      )}
      {sourceActions}
    </div>
  );
}
