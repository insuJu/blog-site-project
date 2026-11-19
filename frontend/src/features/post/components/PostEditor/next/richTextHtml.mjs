import { Extension, Mark, Node } from '@tiptap/react';
import { readPostTypographyStyle } from '../../PostContent/postContentHtml.mjs';
import { isHtmlBlockElement } from './htmlFragment.mjs';

const htmlTypes = [
  'paragraph', 'heading', 'htmlTextDivision', 'htmlDivision', 'htmlSpan', 'htmlAnchor', 'htmlAnchorTarget',
  'blockquote', 'bulletList', 'orderedList', 'listItem', 'horizontalRule', 'hardBreak',
  'link', 'image', 'bold', 'italic', 'strike', 'underline', 'table', 'tableRow', 'tableHeader', 'tableCell',
];

const htmlAttributes = Extension.create({
  name: 'postHtmlAttributes',
  addGlobalAttributes() {
    const attributes = names => Object.fromEntries(names.map(name => [name, { default: null }]));
    return [
      { types: htmlTypes, attributes: attributes(['id', 'lang', 'dir']) },
      {
        types: htmlTypes.filter(type => type !== 'link' && type !== 'image'),
        attributes: attributes(['class', 'title']),
      },
      { types: ['image'], attributes: attributes(['class']) },
      {
        types: ['paragraph', 'heading', 'htmlTextDivision', 'htmlDivision', 'htmlSpan'],
        attributes: { style: { default: null, parseHTML: readPostTypographyStyle } },
      },
    ];
  },
});

// 인라인 내용을 담은 div와 문단을 감싸는 div를 각각 원래 태그로 다시 내보낸다.
function division(name, content, containsBlocks) {
  return Node.create({
    name,
    group: 'block',
    content,
    parseHTML: () => [{
      tag: 'div',
      getAttrs: element => Array.from(element.children).some(isHtmlBlockElement) === containsBlocks ? null : false,
    }],
    renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes, 0],
  });
}

const htmlSpan = Mark.create({
  name: 'htmlSpan',
  excludes: '',
  parseHTML: () => [{ tag: 'span' }],
  renderHTML: ({ HTMLAttributes }) => ['span', HTMLAttributes, 0],
});

// 글자 일부의 색을 바꿔도 바깥 span의 id, class, 다른 스타일을 한곳에 보존한다.
const postTextColor = Mark.create({
  name: 'postTextColor',
  addAttributes: () => ({ color: { default: null, rendered: false } }),
  parseHTML: () => [{
    tag: 'span[style]',
    priority: 60,
    getAttrs: element => {
      if (element.attributes.length !== 1) return false;
      const color = /^color: ([^;]+)$/.exec(readPostTypographyStyle(element) ?? '')?.[1];
      return color ? { color } : false;
    },
  }],
  renderHTML: ({ mark }) => ['span', { style: `color: ${mark.attrs.color}` }, 0],
});

const htmlAnchor = Mark.create({
  name: 'htmlAnchor',
  inclusive: false,
  parseHTML: () => [{ tag: 'a:not([href])' }],
  renderHTML: ({ HTMLAttributes }) => ['a', HTMLAttributes, 0],
});

const htmlAnchorTarget = Node.create({
  name: 'htmlAnchorTarget',
  inline: true,
  group: 'inline',
  atom: true,
  parseHTML: () => [{
    tag: 'a[id]:not([href])',
    priority: 70,
    getAttrs: element => element.hasChildNodes() ? false : null,
  }],
  renderHTML: ({ HTMLAttributes }) => ['a', HTMLAttributes],
});

export const richTextHtmlExtensions = [
  htmlAttributes,
  division('htmlTextDivision', 'inline*', false),
  division('htmlDivision', 'block+', true),
  htmlSpan,
  postTextColor,
  htmlAnchor,
  htmlAnchorTarget,
];
