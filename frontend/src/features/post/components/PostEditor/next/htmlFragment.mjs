import { htmlLanguage } from '@codemirror/lang-html';
import { readPostTypographyStyle } from '../../PostContent/postContentHtml.mjs';

const optionalEndTags = new Set([
  'colgroup', 'dd', 'dt', 'li', 'optgroup', 'option', 'p', 'rp', 'rt',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
]);
const voidTags = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);
const blockTags = new Set([
  'article', 'aside', 'blockquote', 'dd', 'details', 'div', 'dl', 'dt', 'fieldset',
  'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section',
  'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
]);
const blockContainers = new Set([
  'article', 'aside', 'blockquote', 'dd', 'div', 'dl', 'fieldset', 'figure', 'footer',
  'header', 'li', 'main', 'nav', 'ol', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
  'thead', 'tr', 'ul',
]);
const rawTextTags = new Set(['script', 'style', 'textarea', 'title']);
const whitespaceSensitiveTags = new Set(['pre', 'code', ...rawTextTags]);
const documentTags = new Set(['html', 'head', 'body']);
const invalidNodes = new Set(['DoctypeDecl', 'IncompleteTag', 'IncompleteCloseTag', 'MismatchedCloseTag', 'ProcessingInst']);
const nestingRestrictedTags = new Set(['a', 'form', 'button']);
const styleAttributes = ['style', 'class'];
const htmlWhitespace = /^[\t\n\f\r ]+$/;
const htmlWhitespaceOrEmpty = /^[\t\n\f\r ]*$/;

export const isHtmlBlockElement = element => blockTags.has(element.localName);

function inspectHtmlFragment(html, { collectLayout = false, collectTextSpacing = false } = {}) {
  if (typeof html !== 'string' || html.includes('\0')) return null;

  const spacing = [];
  const textSpacing = [];
  const layout = [];
  const protectedRanges = [];
  const verbatimRanges = [];
  const activeTags = new Set();
  const read = node => html.slice(node.from, node.to);
  const lowerText = node => node ? read(node).toLowerCase() : '';
  const tagName = node => lowerText(node?.getChild('TagName'));
  const attributeNames = node => node.getChildren('Attribute')
    .map(attribute => lowerText(attribute.getChild('AttributeName')));
  const hasStyle = node => node && attributeNames(node).some(name => styleAttributes.includes(name));
  const isBlockTag = node => node?.name === 'Element' && blockTags.has(tagName(node.firstChild));
  const isBlock = node => isBlockTag(node) && !hasStyle(node.firstChild);
  // 본문에서 pre에 허용하는 스타일은 블록 표시를 바꾸지 않는다.
  const isStyledPre = node => node?.name === 'Element' && tagName(node.firstChild) === 'pre';
  const isBlockBoundary = (left, right) => (
    (isBlock(left) && (!right || isBlock(right) || isStyledPre(right)))
      || (isBlock(right) && (!left || isStyledPre(left)))
  );
  const isLineBreak = node => node?.name === 'Element' && tagName(node.firstChild) === 'br'
    && !attributeNames(node.firstChild).some(name => name === 'hidden' || styleAttributes.includes(name));

  function addLayout(from, to, depth) {
    if (htmlWhitespaceOrEmpty.test(html.slice(from, to))) layout.push({ from, to, depth });
  }

  function check(node, preserveWhitespace = false, depth = 0) {
    if (node.type.isError || invalidNodes.has(node.name)) return false;
    const element = node.name === 'Element';
    const open = element ? node.firstChild : null;
    const close = node.lastChild?.name === 'CloseTag' ? node.lastChild : null;
    const tag = tagName(open);
    const optionalEnd = !close && optionalEndTags.has(tag);

    if (element) {
      if (!tag || documentTags.has(tag) || activeTags.has(tag)) return false;
      // 편집용 파서는 입력 중인 태그도 트리에 넣으므로 짝과 중복 속성을 따로 확인한다.
      if (close ? tagName(close) !== tag || !/^<\/[^\s/>]+[\t\n\f\r ]*>$/.test(read(close))
        : open.name !== 'SelfClosingTag' && !optionalEnd) return false;
      if (open.name === 'OpenTag' && read(open.getChild('EndTag') ?? open) === '/>') return false;
      if (open.name === 'SelfClosingTag' && !voidTags.has(tag) && !open.getChild('SelfClosingEndTag')) return false;
      const attributes = attributeNames(open);
      if (new Set(attributes).size !== attributes.length) return false;
    }

    const protectContent = whitespaceSensitiveTags.has(tag) || hasStyle(open);
    if (protectContent && !preserveWhitespace && close) protectedRanges.push({ from: open.to, to: close.from });
    if (collectTextSpacing && whitespaceSensitiveTags.has(tag) && close) {
      verbatimRanges.push({ from: open.to, to: close.from });
    }
    if (rawTextTags.has(tag)) return Boolean(close && check(open));
    if (nestingRestrictedTags.has(tag)) activeTags.add(tag);
    preserveWhitespace ||= protectContent;
    const blockContainer = node.name === 'Document' || blockContainers.has(tag);
    const childrenDepth = element ? depth + 1 : depth;
    let previousContent = null;
    for (let child = node.firstChild; child; child = child.nextSibling) {
      // 생략이 허용된 </dt> 등의 위치에 파서가 남기는 빈 오류 표시는 허용한다.
      if (optionalEnd && child.type.isError && child.from === child.to && child.to === node.to) continue;
      if (!check(child, preserveWhitespace, childrenDepth)) return false;
      if (collectTextSpacing && !preserveWhitespace && child.name === 'Text') {
        const previous = child.prevSibling;
        const next = child.nextSibling;
        let value = read(child);
        // 일반 문장의 소스 줄바꿈은 화면에서 공백 한 칸으로 접힌다.
        if (isLineBreak(previous)) value = value.replace(/^[\t\n\f\r ]+/, '');
        if (blockTags.has(tag) && previous?.name === 'OpenTag') {
          value = value.replace(/^[\t\n\f\r ]+/, '');
        }
        if ((blockTags.has(tag) && (!next || next.name === 'CloseTag')) || isLineBreak(next)) {
          value = value.replace(/[\t\n\f\r ]+$/, '');
        }
        value = collapseSoftLineBreaks(value);
        if (value !== read(child)) textSpacing.push({ from: child.from, to: child.to, value });
      }
      if (collectLayout && !preserveWhitespace && child.name !== 'OpenTag' && child.name !== 'CloseTag'
        && child.name !== 'SelfClosingTag'
        && !(child.name === 'Text' && htmlWhitespace.test(read(child)))) {
        // 블록 사이와 정상적으로 표시되는 <br> 뒤만 나눈다. 인라인 태그 사이의 공백은 그대로 둔다.
        if (isLineBreak(previousContent) || (blockContainer && (previousContent || open)
          && isBlockBoundary(previousContent, child))) {
          const leading = child.name === 'Text' ? read(child).match(/^[\t\n\f\r ]*/)[0].length : 0;
          addLayout((previousContent ?? open).to, child.from + leading, childrenDepth);
        }
        previousContent = child;
      }
      if (blockContainer && child.name === 'Text' && htmlWhitespace.test(read(child))
        && (!preserveWhitespace || (collectTextSpacing && tag === 'div'))) {
        const previous = child.prevSibling?.name === 'OpenTag' ? null : child.prevSibling;
        const next = child.nextSibling?.name === 'CloseTag' ? null : child.nextSibling;
        // 두 블록 사이 또는 블록과 컨테이너 경계 사이의 공백만 들여쓰기로 간주한다.
        const semanticBoundary = collectTextSpacing
          && (!previous || isBlockTag(previous)) && (!next || isBlockTag(next)) && (previous || next);
        if (semanticBoundary || (!preserveWhitespace && isBlockBoundary(previous, next))) {
          spacing.push(child);
        }
      }
    }
    if (collectLayout && !preserveWhitespace && blockContainer && close && isBlock(previousContent)) {
      addLayout(previousContent.to, close.from, depth);
    }
    activeTags.delete(tag);
    return true;
  }

  return check(htmlLanguage.parser.parse(html).topNode) ? { spacing, textSpacing, protectedRanges, verbatimRanges, layout } : null;
}

export function isValidHtmlFragment(html) {
  return inspectHtmlFragment(html) !== null;
}

// 저장된 소스는 그대로 두고, 시각 편집에서 같은 글로 표현할 수 있는 태그만 바꾼다.
export function prepareRichTextHtml(html) {
  if (!isValidHtmlFragment(html)) return null;

  const { topNode } = htmlLanguage.parser.parse(html);
  const ranges = [];
  const readName = (node, source = html) => node && source.slice(node.from, node.to).toLowerCase();
  const elementName = (node, source) => readName(node.firstChild.getChild('TagName'), source);
  function visit(node) {
    if (node.name !== 'Element') {
      for (let child = node.firstChild; child; child = child.nextSibling) visit(child);
      return;
    }
    const open = node.firstChild;
    const close = node.lastChild;
    const tag = elementName(node);
    const attributes = open.getChildren('Attribute');
    const preserve = whitespaceSensitiveTags.has(tag)
      || attributes.some(attribute => styleAttributes.includes(readName(attribute.getChild('AttributeName'))));
    if (preserve) return;

    if (attributes.length === 0 && close.name === 'CloseTag') {
      if (tag === 'div' && node.parent.name === 'Document'
        && !node.getChildren('Element').some(child => blockTags.has(elementName(child)))) {
        ranges.push({ from: open.from, to: open.to, value: '<p>' });
        ranges.push({ from: close.from, to: close.to, value: '</p>' });
      } else if (tag === 'a') {
        // 주소와 속성이 없는 a는 화면에서 링크 역할을 하지 않는다.
        ranges.push({ from: open.from, to: open.to }, { from: close.from, to: close.to });
      }
    }
    for (let child = open.nextSibling; child && child !== close; child = child.nextSibling) visit(child);
  }
  visit(topNode);
  const prepared = replaceTextRanges(html, ranges.sort((left, right) => left.from - right.from));
  const root = htmlLanguage.parser.parse(prepared).topNode;
  const inlineOnly = !root.getChildren('Element').some(element => blockTags.has(elementName(element, prepared)));
  // 문서에 바로 들어 있는 인라인 내용은 시각 편집기의 문단 하나로 연다.
  return normalizeRichTextSpacing(inlineOnly && prepared.trim() ? `<p>${prepared}</p>` : prepared);
}

// 코드나 별도 CSS가 적용될 수 있는 가장 바깥 요소의 내부를 정렬 전 그대로 보관한다.
export function readProtectedHtmlRanges(html) {
  return inspectHtmlFragment(html)?.protectedRanges ?? null;
}

// 문단 전체를 다시 쓰기 어려운 HTML도 안전한 태그 경계만 골라 정리한다.
export function formatHtmlBlockLayout(html, indentWidth) {
  const fragment = inspectHtmlFragment(html, { collectLayout: true });
  if (!fragment?.layout.length) return null;

  const eol = html.match(/\r\n|\r|\n/)?.[0] ?? '\n';
  const ranges = fragment.layout.map(({ from, to, depth }) => ({
    from, to, value: eol + ' '.repeat(indentWidth * depth),
  }));
  return replaceTextRanges(html, ranges.sort((left, right) => left.from - right.from));
}

function replaceTextRanges(html, ranges) {
  let result = '';
  let from = 0;
  for (const gap of ranges) {
    result += html.slice(from, gap.from) + (gap.value ?? '');
    from = gap.to;
  }
  return result + html.slice(from);
}

export function collapseSoftLineBreaks(text) {
  return text.replace(/[\t\n\f\r ]*[\n\r][\t\n\f\r ]*/g, ' ');
}

// 시각 편집에서는 줄바꿈을 접은 뒤 나머지 HTML이 그대로 남는지 확인한다.
export function normalizeRichTextSpacing(html) {
  const fragment = inspectHtmlFragment(html, { collectTextSpacing: true });
  if (!fragment) return null;
  const blockGaps = new Set(fragment.spacing.map(gap => gap.from));
  const ranges = fragment.spacing.concat(fragment.textSpacing.filter(gap => !blockGaps.has(gap.from)));
  return replaceTextRanges(html, ranges.sort((left, right) => left.from - right.from));
}

function htmlTree(html, forRichText = false) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const hasStyle = node => styleAttributes.some(name => node.hasAttribute(name));
  const isBlock = node => node?.nodeType === 1 && blockTags.has(node.localName) && !hasStyle(node);
  const isLineBreak = node => node?.localName === 'br' && !node.hasAttribute('hidden') && !hasStyle(node);

  function children(parent, preserveWhitespace = false) {
    const blockContainer = blockContainers.has(parent.localName);
    return Array.from(parent.childNodes).flatMap(node => {
      if (node.nodeType === 3 && !preserveWhitespace) {
        // 목록의 블록 경계와 <br> 직후의 들여쓰기는 본문에서 표시되지 않는다.
        let value = node.data;
        if (isLineBreak(node.previousSibling) || blockContainer && (!node.previousSibling || isBlock(node.previousSibling))) {
          value = value.replace(/^[\t\n\f\r ]+/, '');
        }
        if (blockContainer && (!node.nextSibling || isBlock(node.nextSibling))) value = value.replace(/[\t\n\f\r ]+$/, '');
        return value ? [[node.nodeType, value]] : [];
      }
      if (node.nodeType !== 1) return [[node.nodeType, node.nodeValue]];
      const attributes = Array.from(node.attributes, ({ name, value }) => [
        name, forRichText && name === 'style' ? readPostTypographyStyle(node) ?? value : value,
      ]).sort();
      const keepWhitespace = preserveWhitespace || whitespaceSensitiveTags.has(node.localName) || hasStyle(node);
      return [[node.namespaceURI, node.localName, attributes, children(node.content ?? node, keepWhitespace)]];
    });
  }

  return children(template.content);
}

export function hasEquivalentRichTextHtml(prepared, rendered) {
  const normalized = normalizeRichTextSpacing(rendered);
  if (normalized === null) return false;
  if (prepared === normalized) return true;

  // 태그와 속성 값은 같아야 한다. 속성 순서와 따옴표 표기 차이는 무시한다.
  const verbatim = html => inspectHtmlFragment(html, { collectTextSpacing: true }).verbatimRanges
    .map(({ from, to }) => html.slice(from, to));
  return JSON.stringify(verbatim(prepared)) === JSON.stringify(verbatim(normalized))
    && JSON.stringify(htmlTree(prepared, true)) === JSON.stringify(htmlTree(normalized, true));
}

// 정렬은 태그 표기와 속성 따옴표를 바꿀 수 있으므로 구조와 실제 값으로 비교한다.
export function hasEquivalentHtmlFormatting(before, after) {
  const original = inspectHtmlFragment(before);
  const formatted = inspectHtmlFragment(after);
  if (!original || !formatted || typeof document === 'undefined') return false;
  // DOM 파싱 과정에서 바뀔 수 있는 코드의 CRLF와 <pre> 첫 줄바꿈도 검사한다.
  const readContents = (html, ranges) => ranges.map(({ from, to }) => html.slice(from, to));
  if (JSON.stringify(readContents(before, original.protectedRanges))
    !== JSON.stringify(readContents(after, formatted.protectedRanges))) return false;
  return JSON.stringify(htmlTree(replaceTextRanges(before, original.spacing)))
    === JSON.stringify(htmlTree(replaceTextRanges(after, formatted.spacing)));
}
