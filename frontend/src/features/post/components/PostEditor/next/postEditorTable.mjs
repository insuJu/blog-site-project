import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';

const alignmentMarkers = { left: ':---', center: ':---:', right: '---:' };

// 편집용 열 너비와 colgroup은 게시글 HTML에 넣지 않는다.
const postTable = Table.extend({
  parseHTML() {
    return [{
      tag: 'table',
      contentElement: element => element.tBodies.length === 1 && element.children.length === 1
        ? element.tBodies[0] : element,
    }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['table', HTMLAttributes, ['tbody', 0]];
  },
  renderMarkdown(node, helpers) {
    const [header, ...body] = node.content ?? [];
    if (!header) return '';
    const line = cells => `| ${cells.join(' | ')} |`;
    const renderRow = row => line(row.content.map(cell => {
      const content = cell.content ?? [];
      if (content.length === 1 && content[0].type === 'paragraph' && !content[0].content?.length) return '';
      // 열 구분자만 이스케이프한다. 인라인 코드와 셀 본문의 공백은 원문 그대로 둔다.
      return helpers.renderChildren(content).replace(/\\.|\|/g, value => value === '|' ? '\\|' : value);
    }));
    return [
      renderRow(header),
      line(header.content.map(cell => alignmentMarkers[cell.attrs?.align] ?? '---')),
      ...body.map(renderRow),
    ].join('\n');
  },
});

export const postEditorTableExtensions = [postTable, TableRow, TableHeader, TableCell];
