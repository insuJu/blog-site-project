import { htmlToMarkdown, markdownToHtml } from './htmlMarkdownConverter.mjs';
import { canEditRichText } from './richTextValidation.mjs';

// 처음 받은 HTML을 Tiptap으로 읽어도 그대로 남으면 시각 편집에서 시작한다.
export function openPostBodyEditor(initialHtml) {
  const canOpenVisual = canEditRichText(initialHtml);
  return {
    mode: canOpenVisual ? 'visual' : 'html',
    html: initialHtml,
    markdown: '',
    visualInitialHtml: canOpenVisual ? initialHtml : null,
    lastVerifiedHtml: canOpenVisual ? initialHtml : null,
    convertedPair: null,
    transitionError: canOpenVisual ? null : 'visual_incompatible',
  };
}

export function updatePostBodyDraft(session, value) {
  const field = session.mode === 'markdown' ? 'markdown' : 'html';
  if (value === session[field]) return session;

  return {
    ...session,
    [field]: value,
    // 시각 편집에서 바뀐 HTML은 Tiptap이 출력한 값이다. 소스 초안은 전환할 때 검사한다.
    lastVerifiedHtml: session.mode === 'visual' ? value : session.lastVerifiedHtml,
    transitionError: null,
  };
}

export function readPostBodyHtml(session) {
  if (session.mode !== 'markdown' || session.markdown === session.convertedPair?.markdown) {
    return { ok: true, value: session.html };
  }
  return markdownToHtml(session.markdown);
}

export function switchPostBodyEditorMode(session, mode) {
  if (mode === session.mode) return session;

  const { convertedPair } = session;
  if (mode === 'markdown') {
    // HTML이 그대로면 이전에 검증한 Markdown 초안을 다시 연다.
    const result = convertedPair && convertedPair.html === session.html
      ? { ok: true, value: convertedPair.markdown }
      : htmlToMarkdown(session.html);

    if (!result.ok) return { ...session, transitionError: result.reason };

    return {
      ...session,
      mode,
      markdown: result.value,
      lastVerifiedHtml: session.html,
      convertedPair: { html: session.html, markdown: result.value },
      transitionError: null,
    };
  }

  const fromMarkdown = session.mode === 'markdown';
  const opensVisual = mode === 'visual';
  // 시각 편집은 Markdown을 변환한 HTML로 연다. HTML 소스와 저장은 수정 전 원문을 재사용할 수 있다.
  const result = fromMarkdown && opensVisual ? markdownToHtml(session.markdown) : readPostBodyHtml(session);
  if (!result.ok) return { ...session, transitionError: result.reason };
  const html = result.value;

  if (opensVisual && !canEditRichText(html)) {
    // Markdown 변환에 성공했더라도 시각 편집 검사까지 통과해야 HTML을 반영한다.
    return { ...session, transitionError: 'visual_incompatible' };
  }

  return {
    ...session,
    mode,
    html,
    visualInitialHtml: opensVisual ? html : session.visualInitialHtml,
    lastVerifiedHtml: opensVisual || fromMarkdown ? html : session.lastVerifiedHtml,
    convertedPair: fromMarkdown ? { html, markdown: session.markdown } : convertedPair,
    transitionError: null,
  };
}
