import styles from './EditorModeSelector.module.css';

const EditorModeSelector = ({ editorMode, onModeChange, fontSize, onFontSizeChange }) => {
  return (
    <div className={styles.modeSelector}>
      <button
        type="button"
        className={`${styles.modeButton} ${
          editorMode === 'wysiwyg' ? styles.activeModeButton : ''
        }`}
        onClick={() => onModeChange('wysiwyg')}
      >
        일반 모드
      </button>
      <button
        type="button"
        className={`${styles.modeButton} ${
          editorMode === 'markdown' ? styles.activeModeButton : ''
        }`}
        onClick={() => onModeChange('markdown')}
      >
        Markdown
      </button>
      <button
        type="button"
        className={`${styles.modeButton} ${
          editorMode === 'html' ? styles.activeModeButton : ''
        }`}
        onClick={() => onModeChange('html')}
      >
        HTML
      </button>

      {editorMode === 'wysiwyg' && (
        <>
          <div className={styles.modeSpacer}></div>

          <select
            className={styles.fontSizeSelect}
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
          >
            <option value="small">작게</option>
            <option value="medium">보통</option>
            <option value="large">크게</option>
            <option value="xlarge">매우 크게</option>
          </select>
        </>
      )}
    </div>
  );
};

export default EditorModeSelector;
