export const getPreview = (text, maxLength = 150) => {
  if (!text) return '';

  let cleanText = text;

  // HTML 태그 처리: 블록 태그들을 공백으로 치환하여 텍스트가 붙지 않게 함
  cleanText = cleanText.replace(/<\/p>|<\/div>|<\/li>|<\/h[1-6]>|<br\s*\/?>/gi, ' ');
  cleanText = cleanText.replace(/<[^>]*>/g, '');

  cleanText = cleanText.replace(/&nbsp;/g, ' ')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&quot;/g, '"');

  // 마크다운 문법 제거
  cleanText = cleanText.replace(/#{1,6}\s+/g, '');
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
  cleanText = cleanText.replace(/~~([^~]+)~~/g, '$1');
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  cleanText = cleanText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');
  cleanText = cleanText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // 리스트 및 인용구 마커 제거 (줄 단위)
  cleanText = cleanText.split('\n').map(line => {
    return line.replace(/^[-*+]\s+|^(\d+\.)\s+|^>\s+/gm, '').trim();
  }).join(' ');

  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
};
