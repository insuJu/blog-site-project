import createDOMPurify from 'dompurify';
const tags = [
  'p', 'div', 'span', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del', 'blockquote', 'pre', 'code', 'font',
  'ul', 'ol', 'li', 'a', 'img', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
];
const linkProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const imageProtocols = new Set(['http:', 'https:']);
const rasterDataUrl = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,[a-z0-9+/=]+$/i;
const imageSize = /^(?:auto|0|[0-9]+(?:\.[0-9]+)?(?:px|%))$/i;
const color = /^(?:#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})|rgb\(\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*\))$/;
const fontSize = /^[0-9]{1,3}(?:\.[0-9]{1,2})?(?:px|em|rem|%)$/;
const codeSpacing = /^[0-9]{1,2}px(?: [0-9]{1,2}px)?$/;
const typographyStyle = {
  color: /^(?:[a-z]{1,24}|#[a-f0-9]{3}|#[a-f0-9]{6}|rgb\(\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*\))$/i,
  'font-size': fontSize,
  'font-weight': /^(?:normal|[1-9]00)$/,
};
const typographyTags = new Set(['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const codeStyle = {
  'background-color': color,
  color,
  'font-size': fontSize,
  'font-family': /^monospace$/,
  padding: codeSpacing,
  'border-radius': codeSpacing,
};
// 저장 정책(PostBodyStyles.java)과 같은 값 범위만 미리보기와 상세 화면에 적용한다.
const bodyStyles = {
  img: { width: imageSize, height: imageSize, 'max-width': imageSize },
  strike: { 'font-size': fontSize },
  br: { 'font-size': fontSize },
  li: { 'text-decoration-line': /^line-through$/ },
  th: { 'text-align': /^(?:left|center|right)$/ },
  td: { 'text-align': /^(?:left|center|right)$/ },
  code: codeStyle,
  pre: {
    ...codeStyle,
    'line-height': /^[1-3](?:\.[0-9]{1,2})?$/,
    overflow: /^auto$/,
    'white-space': /^(?:pre|pre-wrap)$/,
  },
};

export function readPostTypographyStyle(element) {
  const source = element.getAttribute('style');
  if (!typographyTags.has(element.localName) || source === null) return null;

  // 편집기에 적용하는 스타일은 선언마다 검사한다. 알 수 없는 선언은 건너뛰지 않는다.
  const declarations = new Map();
  for (const declaration of source.split(';')) {
    if (!declaration.trim()) continue;
    const [name, value, extra] = declaration.split(':').map(part => part.trim());
    if (extra !== undefined || !Object.hasOwn(typographyStyle, name) || !typographyStyle[name].test(value ?? '')
      || declarations.has(name)) return null;
    const parsed = element.style.getPropertyValue(name).trim();
    if (!parsed) return null;
    declarations.set(name, parsed);
  }
  return [...declarations].sort().map(([name, value]) => `${name}: ${value}`).join('; ');
}

function filterStyle(element) {
  const rules = typographyTags.has(element.localName) ? typographyStyle : bodyStyles[element.localName] || {};
  return Object.entries(rules).flatMap(([name, rule]) => {
    const value = element.style?.getPropertyValue(name).trim() || '';
    return rule.test(value) ? [`${name}: ${value}`] : [];
  }).join('; ');
}

function hasAllowedProtocol(value, protocols) {
  try {
    return Boolean(value.trim()) && protocols.has(new URL(value, 'https://post.invalid/').protocol);
  } catch {
    return false;
  }
}

export function renderPostHtml(content, { preview = false } = {}) {
  if (!content) return '';
  const purifier = createDOMPurify(window);

  purifier.addHook('uponSanitizeAttribute', (element, attr) => {
    const tag = element.localName;
    switch (attr.attrName) {
      case 'href':
        attr.keepAttr = tag === 'a' && hasAllowedProtocol(attr.attrValue, linkProtocols);
        break;
      case 'src':
        attr.keepAttr = tag === 'img' && (hasAllowedProtocol(attr.attrValue, imageProtocols)
          || (preview && rasterDataUrl.test(attr.attrValue)));
        break;
      case 'class': {
        if (tag !== 'pre' && tag !== 'code') {
          attr.attrValue = attr.attrValue.split(/\s+/).filter(value => value && value !== 'image-resize-wrapper').join(' ');
          attr.keepAttr = Boolean(attr.attrValue);
          break;
        }
        const language = attr.attrValue.split(/\s+/).find(value => /^language-[a-z0-9_+.-]+$/i.test(value));
        attr.attrValue = language || '';
        attr.keepAttr = Boolean(language);
        break;
      }
      case 'style': {
        attr.attrValue = filterStyle(element);
        attr.keepAttr = Boolean(attr.attrValue);
        break;
      }
      case 'color':
        attr.keepAttr = tag === 'font' && color.test(attr.attrValue);
        break;
    }
  });

  return purifier.sanitize(content, {
    ALLOWED_TAGS: tags,
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class', 'id', 'lang', 'dir',
      'start', 'reversed', 'type', 'value', 'colspan', 'rowspan', 'scope', 'color',
    ],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
  });
}
