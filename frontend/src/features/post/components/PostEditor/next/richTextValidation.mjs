import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { hasEquivalentRichTextHtml, prepareRichTextHtml } from './htmlFragment.mjs';
import { richTextHtmlExtensions } from './richTextHtml.mjs';
import { richTextImage } from './richTextImage.mjs';
import { postEditorTableExtensions } from './postEditorTable.mjs';

// HTML 검사와 시각 편집기에 같은 Tiptap 설정을 사용한다.
export const richTextExtensions = [
  StarterKit.configure({
    link: { openOnClick: false, HTMLAttributes: { target: null, rel: null, class: null } },
    // 코드 뒤에는 필요할 때 새 문단을 만든다. 모드 전환에서 사라질 빈 문단을 미리 넣지 않는다.
    trailingNode: { notAfter: ['codeBlock'] },
  }),
  richTextImage,
  ...richTextHtmlExtensions,
  ...postEditorTableExtensions,
];

// 화면에 보이지 않는 소스 공백을 제외하고 Tiptap이 받은 HTML을 그대로 돌려주는지 확인한다.
export function canEditRichText(html) {
  if (typeof html !== 'string' || typeof document === 'undefined') return false;

  let editor;
  try {
    const prepared = prepareRichTextHtml(html);
    if (prepared === null) return false;
    editor = new Editor({
      element: null,
      extensions: richTextExtensions,
      content: prepared,
      enableContentCheck: true,
      parseOptions: { preserveWhitespace: true },
    });
    return hasEquivalentRichTextHtml(prepared, editor.getHTML());
  } catch {
    return false;
  } finally {
    editor?.destroy();
  }
}
