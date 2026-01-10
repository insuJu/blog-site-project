export const htmlToMarkdown = (html) => {
  if (!html) return '';

  let markdown = html;

  markdown = markdown.replace(
    /<pre[^>]*?>([\s\S]*?)<\/pre>/gi,
    (_, content) => {
      let codeText = content;
      const codeMatch = content.match(/<code[^>]*?>([\s\S]*?)<\/code>/i);
      if (codeMatch) {
        codeText = codeMatch[1];
      }

      const cleanCode = codeText
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();

      return `\n\`\`\`\n${cleanCode}\n\`\`\`\n`;
    }
  );

  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');

  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');
  markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');

  markdown = markdown.replace(
    /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
    '[$2]($1)'
  );

  markdown = markdown.replace(
    /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
    '![$2]($1)'
  );
  markdown = markdown.replace(
    /<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi,
    '![]($1)'
  );

  markdown = markdown.replace(/<ul[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  markdown = markdown.replace(
    /<blockquote[^>]*>(.*?)<\/blockquote>/gis,
    (_, content) => {
      const cleaned = content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
      const lines = cleaned.split('\n').filter(line => line.trim());
      return lines.map(line => `> ${line.trim()}`).join('\n') + '\n';
    }
  );

  markdown = markdown.replace(/<hr\s*\/?>/gi, '\n---\n');

  markdown = markdown.replace(/<p[^>]*>/gi, '');
  markdown = markdown.replace(/<\/p>/gi, '\n\n');
  markdown = markdown.replace(/<div[^>]*>/gi, '');
  markdown = markdown.replace(/<\/div>/gi, '\n');
  markdown = markdown.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

  markdown = markdown.replace(/<[^>]+>/g, '');

  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
};

export const markdownToHtml = (markdown) => {
  if (!markdown) return '';

  let html = markdown;

  const codeBlocks = [];
  html = html.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/g, (_, lang, code) => {
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push({ lang: lang || 'plaintext', code });
    return placeholder;
  });

  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(code);
    return placeholder;
  });

  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/(<blockquote>.*?<\/blockquote>\s*)+/g, '<blockquote>$&</blockquote>');

  html = html.replace(/^---$/gm, '<hr />');

  const paragraphs = html.split('\n\n');
  html = paragraphs.map(para => {
    const trimmed = para.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') || trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') || trimmed.startsWith('<img')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  inlineCodes.forEach((code, index) => {
    html = html.replace(
      `___INLINE_CODE_${index}___`,
      `<code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e83e8c;">${code}</code>`
    );
  });

  codeBlocks.forEach((block, index) => {
    html = html.replace(
      `___CODE_BLOCK_${index}___`,
      `<pre style="background-color: #282c34; color: #abb2bf; padding: 16px; border-radius: 8px; overflow: auto; font-family: monospace; font-size: 0.9em; line-height: 1.6; white-space: pre-wrap;" contenteditable="true" spellcheck="false"><code>${block.code}</code></pre>`
    );
  });

  return html;
};
