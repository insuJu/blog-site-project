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

  // 코드 블록 보호
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/g, (_, lang, code) => {
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push({ lang: lang || 'plaintext', code });
    return placeholder;
  });

  // 인라인 코드 보호
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(code);
    return placeholder;
  });

  // 줄바꿈 포함 인라인 마커 전처리 (~~, **, *)
  // 여러 줄을 감싸는 마커를 줄 단위로 쪼개고, 리스트 마커 안쪽으로 스타일을 이동시킴
  const processMultilineStyles = (text) => {
    let processed = text;
    const styles = [
      { marker: '~~' },
      { marker: '\\*\\*' },
      { marker: '\\*' }
    ];

    styles.forEach(({ marker }) => {
      const actualMarker = marker.replace(/\\/g, '');
      const regex = new RegExp(`${marker}([\\s\\S]+?)${marker}`, 'g');
      
      processed = processed.replace(regex, (match, content) => {
        if (!content.includes('\n')) return match; 

        return content.split('\n').map(line => {
          if (!line.trim()) return line;
          
          let lineText = line;
          const listMatch = lineText.match(/^([-*]\s+|\d+\.\s+)(.+)$/);
          
          if (listMatch) {
            return `${listMatch[1]}${actualMarker}${listMatch[2]}${actualMarker}`;
          }
          return `${actualMarker}${lineText}${actualMarker}`;
        }).join('\n');
      });
    });
    return processed;
  };

  html = processMultilineStyles(html);

  // 헤더 변환
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // 인라인 스타일 최종 변환 (단일 줄 처리)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // 이미지 및 링크
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 리스트 변환
  // 기호 목록 (- 또는 *)
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  // 숫자 목록
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="num-list">$1</li>');

  // 연속된 <li> 태그들을 <ul> 또는 <ol>로 감싸기
  html = html.replace(/(?:^<li>(.*?)<\/li>\n?)+/gm, (match) => {
    return `<ul>\n${match}</ul>\n`;
  });
  html = html.replace(/(?:^<li class="num-list">(.*?)<\/li>\n?)+/gm, (match) => {
    const items = match.replace(/ class="num-list"/g, '');
    return `<ol>\n${items}</ol>\n`;
  });

  // 인용구
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/(?:^<blockquote>.*?<\/blockquote>\n?)+/gm, (match) => {
    return `<blockquote>\n${match.replace(/<\/?blockquote>\n?/g, '')}</blockquote>\n`;
  });

  // 가로줄 및 문단 처리
  html = html.replace(/^---$/gm, '<hr />');

  const paragraphs = html.split('\n\n');
  html = paragraphs.map(para => {
    const trimmed = para.trim();
    if (!trimmed) return '';
    // 이미 HTML 블록 태그로 시작하는 경우 그대로 반환
    if (/^<(h[1-6]|ul|ol|blockquote|hr|img|pre)/i.test(trimmed)) {
      return trimmed;
    }
    // 일반 텍스트인 경우 <p>로 감싸고 내부 줄바꿈은 <br>로 변환
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // 보호된 코드 복원
  inlineCodes.forEach((code, index) => {
    html = html.replace(`___INLINE_CODE_${index}___`, `<code class="inline-code">${code}</code>`);
  });

  codeBlocks.forEach((block, index) => {
    const langClass = block.lang ? `language-${block.lang}` : '';
    html = html.replace(`___CODE_BLOCK_${index}___`, `<pre class="${langClass}"><code class="${langClass}">${block.code}</code></pre>`);
  });

  return html;
};
