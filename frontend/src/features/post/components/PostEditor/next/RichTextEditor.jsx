import { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { canEditRichText, richTextExtensions } from './richTextValidation.mjs';
import { prepareRichTextHtml } from './htmlFragment.mjs';
import RichTextToolbar from './RichTextToolbar';

// 검사에 통과한 글을 열어 굵게, 제목, 목록 같은 서식을 화면에서 편집한다.
function EditableRichText({ initialHtml, onChange, readOnly, label, prepareImage, contentClassName }) {
  // initialHtml은 편집기를 열 때 쓰는 값이다. 입력할 때마다 바꾸면 편집기가 다시 만들어진다.
  const content = useMemo(() => prepareRichTextHtml(initialHtml), [initialHtml]);
  const editor = useEditor({
    extensions: richTextExtensions,
    content,
    // 화면이 브라우저에 붙은 뒤 편집기를 만든다.
    immediatelyRender: false,
    enableContentCheck: true,
    parseOptions: { preserveWhitespace: true },
    editable: !readOnly,
    editorProps: {
      attributes: { role: 'textbox', 'aria-label': label, 'aria-multiline': 'true' },
    },
    onUpdate: ({ editor, transaction, appendedTransactions }) => {
      if (transaction.docChanged || appendedTransactions.some(change => change.docChanged)) {
        onChange(editor.getHTML());
      }
    },
  }, [initialHtml]);

  // 편집 상태 변경을 알리면 이미지 크기 조절 핸들도 함께 바뀐다.
  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  return (
    <>
      {editor && prepareImage && <RichTextToolbar editor={editor} prepareImage={prepareImage} readOnly={readOnly} />}
      <EditorContent editor={editor} className={contentClassName} />
    </>
  );
}

export default function RichTextEditor({
  initialHtml, onChange, readOnly = false, label = '본문', prepareImage, contentClassName,
}) {
  // initialHtml은 호출부가 시각 편집을 열 때 전달한 HTML이다.
  const compatible = useMemo(() => canEditRichText(initialHtml), [initialHtml]);
  // 검사에 실패하면 안내만 보여준다. 소스 모드를 여는 일은 이 화면을 호출하는 쪽에서 맡는다.
  if (!compatible) {
    return (
      <p role="status">
        이 글을 시각 편집기로 열면 내용이나 서식이 바뀔 수 있어요. HTML 소스에서 계속 수정해 주세요.
      </p>
    );
  }

  return (
    <EditableRichText
      initialHtml={initialHtml}
      onChange={onChange}
      readOnly={readOnly}
      label={label}
      prepareImage={prepareImage}
      contentClassName={contentClassName}
    />
  );
}
