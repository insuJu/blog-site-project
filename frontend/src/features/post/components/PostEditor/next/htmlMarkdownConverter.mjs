import { Editor, Node } from '@tiptap/react';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { Marked, Renderer } from 'marked';
import { collapseSoftLineBreaks, readProtectedHtmlRanges } from './htmlFragment.mjs';
import { postEditorTableExtensions } from './postEditorTable.mjs';

// 변환용 스키마에서 Markdown 이미지의 주소, 대체 텍스트, 제목을 읽고 쓴다.
const image = Node.create({
  name: 'image',
  inline: true,
  group: 'inline',
  addAttributes: () => ({ src: { default: null }, alt: { default: null }, title: { default: null } }),
  parseHTML: () => [{ tag: 'img[src]' }],
  renderHTML: ({ HTMLAttributes }) => ['img', HTMLAttributes],
  parseMarkdown: (token, helpers) => helpers.createNode('image', {
    src: token.href, alt: token.text, title: token.title ?? null,
  }),
  renderMarkdown: ({ attrs }) => {
    const alt = (attrs.alt ?? '').replace(/[\\\[\]]/g, '\\$&');
    const title = attrs.title == null ? '' : ` "${attrs.title.replace(/[\\"]/g, '\\$&')}"`;
    return `![${alt}](<${attrs.src}>${title})`;
  },
});

const conversionStarterKit = StarterKit.extend({
  addExtensions() {
    return this.parent().map(extension => {
      if (extension.name === 'paragraph') return extension.extend({
        renderMarkdown: (node, helpers) => node.content?.length ? helpers.renderChildren(node.content) : '&nbsp;',
      });
      if (extension.name === 'codeBlock') return extension.extend({
        renderMarkdown: node => {
          const code = (node.content ?? []).map(part => part.text ?? '').join('');
          // 코드 안에 펜스처럼 보이는 줄이 있어도 바깥 펜스가 먼저 닫히지 않게 한다.
          const width = [...code.matchAll(/`+/g)].reduce((max, run) => Math.max(max, run[0].length + 1), 3);
          const fence = '`'.repeat(width);
          return `${fence}${node.attrs?.language ?? ''}\n${code}\n${fence}`;
        },
      });
      return extension;
    });
  },
});

const conversionExtensions = [
  conversionStarterKit.configure({ link: { HTMLAttributes: { target: null, rel: null, class: null } } }),
  image,
  ...postEditorTableExtensions,
];
const referenceParser = new Marked();
const tagAliases = { b: 'strong', i: 'em', del: 's', strike: 's' };
const blockTags = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'hr', 'ol', 'ul', 'li',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
]);
const blockContainers = new Set(['root', 'blockquote', 'li', 'ol', 'ul', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td']);
const inlineParagraphContainers = new Set(['li', 'th', 'td']);
const paragraphContainers = new Set(['root', 'div', 'blockquote', 'li']);
const preservedTextTags = new Set(['pre', 'code', 'script', 'style', 'textarea', 'title']);
const languageClass = /^language-[a-zA-Z0-9_+.-]+$/;

function moveCodeLanguage(pre) {
  const code = pre.firstChild;
  const language = pre.getAttribute('class')?.trim();
  if (!languageClass.test(language ?? '') || pre.childNodes.length !== 1 || code.localName !== 'code') return;

  const existing = code.getAttribute('class')?.trim();
  if (existing && existing !== language) return;
  code.setAttribute('class', language);
  pre.removeAttribute('class');
}

function prepareHtmlForMarkdown(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const isBlock = node => node?.localName === 'div' || blockTags.has(node?.localName);
  const isLineBoundary = node => node?.localName === 'br' || isBlock(node);

  function prepareChildren(parent, tag) {
    for (const child of Array.from(parent.children)) {
      const name = child.localName;
      if (name === 'pre') moveCodeLanguage(child);
      if (preservedTextTags.has(name) || child.hasAttribute('style') || child.hasAttribute('class')) continue;
      prepareChildren(child, name);

      // 속성이 없는 span과 a는 화면에서 별도 서식이나 링크를 만들지 않는다.
      if (child.attributes.length === 0 && (name === 'span' || name === 'a' || (name === 'div' && child.hasChildNodes()))) {
        child.replaceWith(...child.childNodes);
      }
    }
    parent.normalize();

    const block = tag === 'root' || tag === 'div' || blockTags.has(tag);
    if (block) {
      // 소스 줄바꿈과 들여쓰기만 정리한다. 같은 줄 안의 단어 사이 공백과 코드는 따로 검증한다.
      for (const child of Array.from(parent.childNodes)) {
        if (child.nodeType !== 3) continue;
        const { previousSibling, nextSibling } = child;
        const atStart = !previousSibling || isLineBoundary(previousSibling);
        const atEnd = !nextSibling || isLineBoundary(nextSibling);
        if (atStart && atEnd && /^[\t\n\f\r ]+$/.test(child.data)) {
          child.remove();
          continue;
        }
        let content = child.data;
        if (atStart) content = content.replace(/^[\t\f ]*[\n\r][\t\n\f\r ]*/, '');
        if (atEnd) content = content.replace(/[\t\n\f\r ]*[\n\r][\t\f ]*$/, '');
        child.data = collapseSoftLineBreaks(content);
      }
    }

    if (paragraphContainers.has(tag)) {
      // Markdown의 문단에 맞춰 컨테이너에 바로 들어 있는 텍스트와 인라인 요소를 문단으로 묶는다.
      let paragraph;
      for (const child of Array.from(parent.childNodes)) {
        if (isBlock(child)) {
          paragraph = null;
          continue;
        }
        if (!paragraph) {
          paragraph = document.createElement('p');
          child.before(paragraph);
        }
        paragraph.append(child);
      }
    }
  }

  prepareChildren(template.content, 'root');
  return template.innerHTML;
}

function htmlStructure(html) {
  // 태그 표기의 차이는 줄이되, 속성과 문장 안의 공백, 코드 원문은 비교에 남긴다.
  const template = document.createElement('template');
  template.innerHTML = html;

  function children(parent, parentTag) {
    const wrapsInline = inlineParagraphContainers.has(parentTag);
    const nodes = Array.from(parent.childNodes);
    const result = [];
    let inline = [];
    for (const [index, node] of nodes.entries()) {
      if (node.nodeType === 3) {
        const previous = nodes[index - 1];
        const next = nodes[index + 1];
        if (blockContainers.has(parentTag) && /^[\t\n\r ]*$/.test(node.data)
          && (!previous || blockTags.has(previous.localName))
          && (!next || blockTags.has(next.localName))) continue;
        (wrapsInline ? inline : result).push(node.data);
        continue;
      }
      const value = structure(node);
      if (wrapsInline && !blockTags.has(node.localName)) {
        inline.push(value);
        continue;
      }
      if (inline.length) result.push(['p', [], inline]);
      inline = [];
      result.push(value);
    }
    // Markdown이 생성한 목록 항목과 표 셀의 직접 텍스트도 문단 하나로 비교한다.
    if (inline.length) result.push(['p', [], inline]);
    if (result.length === 0 && (parentTag === 'td' || parentTag === 'th')) result.push(['p', [], []]);
    return result;
  }

  function structure(node) {
    if (node.nodeType !== 1) return [node.nodeType, node.nodeValue];
    const tag = Object.hasOwn(tagAliases, node.localName) ? tagAliases[node.localName] : node.localName;
    const attrs = Array.from(node.attributes, ({ name, value }) => [name, value]);
    const attributes = attrs.filter(([name, value]) => !(tag === 'ol' && name === 'start' && value === '1'));
    return [tag, attributes.sort(), children(node, tag)];
  }

  return JSON.stringify(children(template.content, 'root'));
}

function markdownReference(markdown) {
  // Tiptap에서 누락된 내용도 찾을 수 있도록 별도의 파서로 비교 기준을 만든다.
  const renderer = new Renderer();
  const renderParagraph = renderer.paragraph;
  // 따로 입력한 빈 문단은 Markdown에 빈 줄만 쓰면 사라지므로 예약된 표기로 왕복한다.
  renderer.paragraph = function (token) {
    return token.text === '&nbsp;' ? '<p></p>\n' : renderParagraph.call(this, token);
  };
  let hasRawHtml = false;
  let hasCode = false;
  // 비교용 HTML에는 코드 토큰의 줄바꿈을 그대로 넣는다.
  renderer.code = ({ text, lang }) => {
    hasCode = true;
    const code = document.createElement('code');
    if (lang) code.className = `language-${lang}`;
    code.textContent = text;
    return `<pre>${code.outerHTML}</pre>\n`;
  };
  renderer.html = () => {
    hasRawHtml = true;
    return '';
  };
  const template = document.createElement('template');
  template.innerHTML = referenceParser.parse(markdown, { renderer });
  for (const table of template.content.querySelectorAll('table')) {
    // 표 헤더 셀(th)과 열 정렬은 유지하고, 비교할 때 행 그룹만 편집기 표 구조에 맞춘다.
    const header = table.tHead;
    if (header) {
      (table.tBodies[0] ?? table.createTBody()).prepend(...header.rows);
      header.remove();
    }
    for (const cell of table.querySelectorAll('th[align], td[align]')) {
      cell.style.textAlign = cell.getAttribute('align');
      cell.removeAttribute('align');
    }
  }
  return { html: template.innerHTML, hasRawHtml, hasCode };
}

function restoreImageParagraphs(node) {
  if (!node.content) return node;
  const blockParent = ['doc', 'listItem', 'blockquote'].includes(node.type);
  // Tiptap은 이미지 하나만 있는 Markdown 문단에서 문단을 제거한다.
  const content = node.content.map(child => blockParent && child.type === 'image'
    ? { type: 'paragraph', content: [child] }
    : restoreImageParagraphs(child));
  return { ...node, content };
}

function convert(value, format) {
  // 호출부는 실패 여부를 확인하고, 입력받았던 초안을 그대로 사용할 수 있다.
  const failed = reason => ({ ok: false, value, reason });
  if (typeof value !== 'string') return failed('invalid_input');
  if (value.includes('\0')) return failed('information_loss');
  // Tiptap의 빈 문단 하나와 빈 Markdown은 편집을 시작하기 전의 빈 글을 뜻한다.
  if (/^[\t\n\r ]*$/.test(value) || (format === 'html' && value === '<p></p>')) {
    return { ok: true, value: format === 'html' ? '' : '<p></p>' };
  }
  let editor;
  try {
    let htmlSource;
    if (format === 'html') {
      // DOM으로 읽기 전에 태그 문법을 검사하고, 코드의 CRLF가 LF로 바뀌는 변환도 막는다.
      const ranges = readProtectedHtmlRanges(value);
      if (ranges === null || ranges.some(({ from, to }) => value.slice(from, to).includes('\r'))) {
        return failed('information_loss');
      }
      htmlSource = prepareHtmlForMarkdown(value);
    }

    editor = new Editor({
      element: null,
      extensions: [...conversionExtensions, Markdown.configure({ marked: new Marked() })],
    });
    const manager = editor.markdown;
    const readMarkdown = markdown => editor.commands.setContent(
      restoreImageParagraphs(manager.parse(markdown)), { errorOnInvalidContent: true },
    );
    const matches = (left, right) => htmlStructure(left) === htmlStructure(right);

    if (format === 'html') {
      editor.commands.setContent(htmlSource, {
        errorOnInvalidContent: true, parseOptions: { preserveWhitespace: true },
      });
      // HTML을 읽을 때와 Markdown으로 왕복할 때 각각 정보가 남는지 확인한다.
      if (!matches(htmlSource, editor.getHTML())) return failed('information_loss');
      const markdown = editor.getMarkdown();
      const reference = markdownReference(markdown);
      if (reference.hasRawHtml || !matches(htmlSource, reference.html)) return failed('information_loss');
      readMarkdown(markdown);
      if (!matches(htmlSource, editor.getHTML())) return failed('information_loss');
      return { ok: true, value: markdown };
    }

    const reference = markdownReference(value);
    if (reference.hasRawHtml) return failed('unsupported_raw_html');
    if (reference.hasCode && value.includes('\r')) return failed('information_loss');
    readMarkdown(value);
    const html = editor.getHTML();
    if (!matches(reference.html, html)) return failed('information_loss');
    return { ok: true, value: html };
  } catch {
    return failed('conversion_failed');
  } finally {
    editor?.destroy();
  }
}

export const htmlToMarkdown = html => convert(html, 'html');
export const markdownToHtml = markdown => convert(markdown, 'markdown');
