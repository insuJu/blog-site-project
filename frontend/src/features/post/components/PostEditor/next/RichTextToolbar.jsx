import { useRef, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import CodeBlockModal from '../components/CodeBlockModal';
import { Icons } from '../components/EditorIcons';
import styles from './RichTextToolbar.module.css';

const headingLevels = [1, 2, 3, 4, 5, 6];

export default function RichTextToolbar({ editor, prepareImage, readOnly }) {
  const [codeBlock, setCodeBlock] = useState(null);
  const [imageError, setImageError] = useState('');
  const [pickedColor, setPickedColor] = useState('#294497');
  const imageInput = useRef(null);
  const { headingLevel, canUndo, canRedo, isInTable } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      headingLevel: headingLevels.find(level => editor.isActive('heading', { level })) ?? 0,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
      isInTable: editor.isActive('table'),
    }),
  });

  function changeBlockStyle(event) {
    const level = Number(event.target.value);
    const chain = editor.chain().focus();
    if (level === 0) chain.setParagraph().run();
    else chain.setHeading({ level }).run();
  }

  function editCodeBlock() {
    const { from, to, $from } = editor.state.selection;
    const block = $from.parent;
    setCodeBlock(block.type.name === 'codeBlock' ? {
      range: { from: $from.before(), to: $from.after() },
      code: block.textContent,
      language: block.attrs.language || 'plaintext',
    } : {
      range: { from, to },
      code: editor.state.doc.textBetween(from, to, '\n'),
      language: 'plaintext',
    });
  }

  function saveCodeBlock(code, language) {
    // Tiptap 문서에는 강조용 HTML 없이 코드 원문과 언어만 넣는다.
    editor.chain().focus().insertContentAt(codeBlock.range, {
      type: 'codeBlock',
      attrs: { language },
      content: code ? [{ type: 'text', text: code }] : [],
    }).run();
  }

  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImageError('');
    try {
      const src = await prepareImage(file);
      if (!editor.isDestroyed) {
        editor.chain().focus().insertContent({ type: 'image', attrs: { src, alt: file.name } }).run();
      }
    } catch (error) {
      setImageError(error.message);
    }
  }

  const formats = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    strikethrough: () => editor.chain().focus().toggleStrike().run(),
    list: () => editor.chain().focus().toggleBulletList().run(),
    orderedList: () => editor.chain().focus().toggleOrderedList().run(),
    quote: () => editor.chain().focus().toggleBlockquote().run(),
    code: () => editor.chain().focus().toggleCode().run(),
    codeBlock: editCodeBlock,
    link: () => {
      const href = window.prompt('링크 URL을 입력하세요:', editor.getAttributes('link').href || 'https://');
      if (href === null) return;
      const chain = editor.chain().focus().extendMarkRange('link');
      if (href.trim()) chain.setLink({ href: href.trim() }).run();
      else chain.unsetLink().run();
    },
    image: () => imageInput.current?.click(),
  };

  return (
    <>
      <fieldset className={styles.toolbar} disabled={readOnly} aria-label="본문 서식">
        <div className={styles.toolbarGroup}>
          <select
            className={styles.blockStyleSelect}
            aria-label="문단 서식"
            value={headingLevel}
            onChange={changeBlockStyle}
          >
            <option value={0}>본문</option>
            {headingLevels.map(level => (
              <option key={level} value={level}>{`제목 ${level} (H${level})`}</option>
            ))}
          </select>
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => editor.chain().focus().undo().run()}
            title="실행 취소"
            disabled={!canUndo}
          >
            <Icons.Undo />
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => editor.chain().focus().redo().run()}
            title="다시 실행"
            disabled={!canRedo}
          >
            <Icons.Redo />
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <label className={styles.colorPicker} title="글자 색상">
            <input
              type="color"
              aria-label="글자 색상"
              value={pickedColor}
              onChange={event => {
                setPickedColor(event.target.value);
                editor.commands.setMark('postTextColor', { color: event.target.value });
              }}
            />
          </label>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => editor.commands.unsetMark('postTextColor')}
            title="글자 색상 지우기"
          >
            <Icons.Eraser />
          </button>
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

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="구분선"
          >
            <Icons.Hr />
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="표 삽입"
            disabled={isInTable}
          >
            <Icons.Table />
          </button>
        </div>
      </fieldset>
      <input ref={imageInput} type="file" accept="image/*" hidden onChange={selectImage} />
      {imageError && <p role="status">{imageError}</p>}
      <CodeBlockModal
        isOpen={codeBlock !== null}
        onClose={() => setCodeBlock(null)}
        onSave={saveCodeBlock}
        initialCode={codeBlock?.code}
        initialLanguage={codeBlock?.language}
      />
    </>
  );
}
