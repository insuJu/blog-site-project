import { useCallback } from 'react';

export const useEditorFormat = (textareaRef, setFormData) => {
  const insertText = useCallback(
    (before, after = '', placeholder = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      setFormData((prev) => {
        const selectedText = prev.content.substring(start, end);
        const textToInsert = selectedText || placeholder;

        const newContent =
          prev.content.substring(0, start) +
          before +
          textToInsert +
          after +
          prev.content.substring(end);

        setTimeout(() => {
          textarea.focus();
          const newPos = start + before.length + textToInsert.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);

        return { ...prev, content: newContent };
      });
    },
    [textareaRef, setFormData]
  );

  const htmlFormats = {
    bold: () => insertText('<strong>', '</strong>', '굵은 텍스트'),
    italic: () => insertText('<em>', '</em>', '기울임 텍스트'),
    underline: () => insertText('<u>', '</u>', '밑줄 텍스트'),
    strikethrough: () => insertText('<del>', '</del>', '취소선'),
    heading: (level) => insertText(`<h${level}>`, `</h${level}>`, '제목'),
    paragraph: () => insertText('<p>', '</p>', '문단'),
    code: () => insertText('<code>', '</code>', '코드'),
    codeBlock: () => insertText('<pre><code>', '</code></pre>', '코드 블록'),
    list: () => insertText('<ul>\n  <li>', '</li>\n</ul>', '항목'),
    orderedList: () => insertText('<ol>\n  <li>', '</li>\n</ol>', '항목'),
    quote: () => insertText('<blockquote>', '</blockquote>', '인용구'),
    link: () => insertText('<a href="url">', '</a>', '링크 텍스트'),
    image: () => insertText('<img src="url" alt="', '" />', '이미지 설명'),
  };

  const markdownFormats = {
    bold: () => insertText('**', '**', '굵은 텍스트'),
    italic: () => insertText('*', '*', '기울임 텍스트'),
    strikethrough: () => insertText('~~', '~~', '취소선 텍스트'),
    heading: (level) => {
      const prefix = '#'.repeat(level) + ' ';
      insertText(prefix, '', '제목');
    },
    code: () => insertText('`', '`', '코드'),
    codeBlock: () => insertText('\n```\n', '\n```\n', '코드 블록'),
    list: () => insertText('- ', '', '항목'),
    orderedList: () => insertText('1. ', '', '항목'),
    quote: () => insertText('> ', '', '인용구'),
    link: () => insertText('[', '](url)', '링크 텍스트'),
    image: () => insertText('![', '](image-url)', '이미지 설명'),
    horizontalRule: () => insertText('\n---\n', '', ''),
  };

  return { htmlFormats, markdownFormats };
};
