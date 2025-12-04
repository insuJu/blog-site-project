import styles from './EditorToolbar.module.css';
import { Icons } from './EditorIcons';

const EditorToolbar = ({ editorMode, formats, showPreview, onTogglePreview }) => {
  const renderHTMLToolbar = () => (
    <>
      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(1)}
          title="제목 1"
        >
          <Icons.Heading1 />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(2)}
          title="제목 2"
        >
          <Icons.Heading2 />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(3)}
          title="제목 3"
        >
          <Icons.Heading3 />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.bold}
          title="굵게"
        >
          <Icons.Bold />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.italic}
          title="기울임"
        >
          <Icons.Italic />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.underline}
          title="밑줄"
        >
          <Icons.Underline />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.strikethrough}
          title="취소선"
        >
          <Icons.Strikethrough />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.list}
          title="목록"
        >
          <Icons.ListUL />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.orderedList}
          title="숫자 목록"
        >
          <Icons.ListOL />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.quote}
          title="인용구"
        >
          <Icons.Quote />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.code}
          title="인라인 코드"
        >
          <Icons.Code />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.codeBlock}
          title="코드 블록"
        >
          <Icons.CodeBlock />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.link}
          title="링크"
        >
          <Icons.Link />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.image}
          title="이미지"
        >
          <Icons.Image />
        </button>
      </div>
    </>
  );

  const renderMarkdownToolbar = () => (
    <>
      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(1)}
          title="제목 1"
        >
          <Icons.Heading1 />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(2)}
          title="제목 2"
        >
          <Icons.Heading2 />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => formats.heading(3)}
          title="제목 3"
        >
          <Icons.Heading3 />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.bold}
          title="굵게"
        >
          <Icons.Bold />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.italic}
          title="기울임"
        >
          <Icons.Italic />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.strikethrough}
          title="취소선"
        >
          <Icons.Strikethrough />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.list}
          title="목록"
        >
          <Icons.ListUL />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.orderedList}
          title="숫자 목록"
        >
          <Icons.ListOL />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.quote}
          title="인용구"
        >
          <Icons.Quote />
        </button>
      </div>

      <div className={styles.toolbarDivider}></div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.code}
          title="인라인 코드"
        >
          <Icons.Code />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.codeBlock}
          title="코드 블록"
        >
          <Icons.CodeBlock />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.link}
          title="링크"
        >
          <Icons.Link />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.image}
          title="이미지"
        >
          <Icons.Image />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={formats.horizontalRule}
          title="구분선"
        >
          <Icons.Hr />
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.toolbar}>
      {editorMode === 'markdown' ? renderMarkdownToolbar() : renderHTMLToolbar()}

      <div className={styles.toolbarSpacer}></div>

      {/* 미리보기 버튼은 Markdown/HTML 모드에서만 표시 */}
      {editorMode !== 'wysiwyg' && (
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.toolbarButton} ${styles.previewButton} ${showPreview ? styles.active : ''}`}
            onClick={onTogglePreview}
            title="미리보기"
          >
            미리보기
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
