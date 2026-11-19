import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { BsEye, BsEyeSlash, BsTextIndentLeft } from 'react-icons/bs';
import PostContent from '../../PostContent/PostContent';
import contentStyles from '../../PostContent/PostContent.module.css';
import EditorModeSelector from '../components/EditorModeSelector';
import styles from '../PostEditor.module.css';
import RichTextEditor from './RichTextEditor';
import SourceEditor from './SourceEditor';
import {
  openPostBodyEditor, readPostBodyHtml, switchPostBodyEditorMode, updatePostBodyDraft,
} from './postBodyEditorSession.mjs';

const modeLabels = {
  visual: '시각 편집',
  html: 'HTML 소스',
  markdown: 'Markdown 소스',
};

const transitionMessages = {
  visual_incompatible: '이 글을 시각 편집기로 열면 내용이나 서식이 바뀔 수 있어요.',
  information_loss: '형식을 바꾸면 내용이나 서식이 사라질 수 있어요.',
  unsupported_raw_html: 'Markdown 초안에 포함된 HTML을 변환할 수 없어요.',
  invalid_input: '본문을 변환할 수 없어요.',
  conversion_failed: '본문을 변환하는 중 문제가 생겼어요.',
};

const formatMessages = {
  invalid_html: '완성되지 않았거나 올바르지 않은 HTML이 있어요.',
  format_information_loss: '정렬하면 본문의 내용이나 공백이 달라질 수 있어요.',
  format_failed: 'HTML을 정렬하는 중 문제가 생겼어요.',
};

// 모드 버튼을 보여 주고, 세션에서 현재 모드의 초안을 꺼내 해당 편집기를 연다.
export default function PostBodyModeSwitcher({
  ref, initialHtml = '<p></p>', onChange, onDraftChange, readOnly = false, label = '본문',
  prepareImage,
}) {
  const editorId = useId();
  // initialHtml은 처음 글을 열 때 사용한다. 다른 글을 열 때는 React key를 바꾼다.
  const [session, setSession] = useState(() => openPostBodyEditor(initialHtml));
  const latestSession = useRef(session);
  const reportedHtml = useRef(session.html);
  const [fontSize, setFontSize] = useState('medium');
  const [preview, setPreview] = useState(null);
  const [sourceError, setSourceError] = useState(null);
  const [formatting, setFormatting] = useState(false);
  const sourceEditor = useRef(null);
  const { mode, html, markdown, visualInitialHtml, transitionError } = session;

  useImperativeHandle(ref, () => ({
    readHtml: () => readPostBodyHtml(latestSession.current),
  }), []);

  function updateSession(update) {
    // 화면이 다시 그려지기 전에도 저장과 미리보기가 최신 입력을 읽을 수 있게 한다.
    const previous = latestSession.current;
    const next = update(previous);
    if (next === previous) return;
    latestSession.current = next;
    setSession(next);
  }

  useEffect(() => {
    // Markdown에서 수정한 내용은 전환 검사를 거쳐 HTML에 반영된 뒤에 알린다.
    if (html === reportedHtml.current) return;
    reportedHtml.current = html;
    onChange?.(html);
  }, [html, onChange]);

  function handleChange(value) {
    setSourceError(null);
    updateSession(current => current.mode === mode ? updatePostBodyDraft(current, value) : current);
    onDraftChange?.();
  }

  function selectMode(nextMode) {
    setPreview(null);
    setSourceError(null);
    updateSession(current => switchPostBodyEditorMode(current, nextMode));
  }

  function togglePreview() {
    if (preview !== null) {
      setPreview(null);
      return;
    }
    const result = readPostBodyHtml(latestSession.current);
    if (result.ok) setPreview(result.value);
    setSourceError(result.ok ? null : transitionMessages[result.reason]);
  }

  async function handleFormatHtml() {
    const editor = sourceEditor.current;
    if (!editor) return;
    setSourceError(null);
    setFormatting(true);
    try {
      const result = await editor.formatHtml();
      if (result && !result.ok && sourceEditor.current === editor) {
        setSourceError(formatMessages[result.reason]);
      }
    } finally {
      setFormatting(false);
    }
  }

  const message = sourceError || transitionMessages[transitionError];
  const isSource = mode !== 'visual';
  const isPreview = preview !== null;
  const sourceActions = isSource && (
    <div className={styles.sourceActions} role="group" aria-label="소스 편집 도구">
      {mode === 'html' && (
        <button type="button" disabled={readOnly || formatting || isPreview} onClick={handleFormatHtml}>
          <BsTextIndentLeft aria-hidden="true" />
          {formatting ? 'HTML 정렬 중…' : 'HTML 정렬'}
        </button>
      )}
      <button
        type="button"
        className={styles.sourcePreviewButton}
        disabled={readOnly || formatting}
        aria-pressed={isPreview}
        onClick={togglePreview}
      >
        {isPreview ? <BsEyeSlash aria-hidden="true" /> : <BsEye aria-hidden="true" />}
        {isPreview ? '미리보기 닫기' : '미리보기'}
      </button>
    </div>
  );

  return (
    <div className={styles.editorPanel}>
      <EditorModeSelector
        editorMode={mode}
        modeLabels={modeLabels}
        controls={editorId}
        onModeChange={selectMode}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        disabled={readOnly}
        sourceActions={sourceActions}
      />
      {message && (
        <p className={isSource ? styles.sourceStatus : undefined} role="status">
          {message} {modeLabels[mode]}에서 계속 수정해 주세요.
        </p>
      )}
      <div id={editorId}>
        {isPreview && <PostContent content={preview} preview className={styles.sourcePreview} />}
        {mode === 'visual' ? (
          <RichTextEditor
            initialHtml={visualInitialHtml}
            onChange={handleChange}
            readOnly={readOnly}
            label={label}
            prepareImage={prepareImage}
            contentClassName={`${contentStyles.body} ${styles.richTextInput} ${styles[`fontSize-${fontSize}`]}`}
          />
        ) : (
          // 소스 형식이 바뀌면 새 CodeMirror 문서를 열어 이전 형식의 실행 취소 기록을 끊는다.
          <div className={styles.sourceInput} hidden={isPreview}>
            <SourceEditor
              key={mode}
              ref={sourceEditor}
              value={mode === 'markdown' ? markdown : html}
              format={mode}
              onChange={handleChange}
              readOnly={readOnly}
              label={`${label} ${modeLabels[mode]}`}
            />
          </div>
        )}
      </div>
      {mode === 'markdown' && !isPreview && (
        <p className={styles.sourceHint}>제목은 <code># 제목</code>처럼 # 뒤에 공백을 넣어 주세요.</p>
      )}
    </div>
  );
}
