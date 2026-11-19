import { Node, ResizableNodeView } from '@tiptap/react';

export const richTextImage = Node.create({
  name: 'image',
  inline: true,
  group: 'inline',
  addAttributes: () => ({
    src: { default: null },
    alt: { default: null },
    title: { default: null },
    width: { default: null },
    height: { default: null },
  }),
  parseHTML: () => [{ tag: 'img[src]' }],
  renderHTML: ({ HTMLAttributes }) => ['img', HTMLAttributes],
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const image = document.createElement('img');

      function applyAttributes(attrs) {
        for (const [name, value] of Object.entries(attrs)) {
          if (value == null) image.removeAttribute(name);
          else image.setAttribute(name, value);
        }
        image.style.removeProperty('width');
        image.style.removeProperty('height');
      }

      applyAttributes(node.attrs);
      return new ResizableNodeView({
        element: image,
        node,
        editor,
        getPos,
        onCommit: (width, height) => editor.commands.command(({ tr }) => {
          const pos = getPos();
          const current = pos == null ? null : tr.doc.nodeAt(pos);
          if (current?.type !== node.type) return false;
          // 편집 중 보이는 핸들 대신 최종 크기만 HTML 속성에 저장한다.
          tr.setNodeMarkup(pos, undefined, {
            ...current.attrs, width: Math.round(width), height: Math.round(height),
          });
          return true;
        }),
        onUpdate: (next) => {
          if (next.type !== node.type) return false;
          applyAttributes(next.attrs);
          return true;
        },
        options: {
          min: { width: 50, height: 50 },
          preserveAspectRatio: true,
        },
      });
    };
  },
});
