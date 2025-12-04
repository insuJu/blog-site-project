export const getPreview = (text, maxLength = 150) => {
  if (!text) return '';

  let cleanText = text;

  cleanText = cleanText.replace(/<[^>]*>/g, '');

  cleanText = cleanText.replace(/&nbsp;/g, ' ')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&quot;/g, '"');

  cleanText = cleanText.replace(/#{1,6}\s+/g, '');
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
  cleanText = cleanText.replace(/~~([^~]+)~~/g, '$1');
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  cleanText = cleanText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');
  cleanText = cleanText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  cleanText = cleanText.replace(/^[-*+]\s+/gm, '');
  cleanText = cleanText.replace(/^>\s+/gm, '');

  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
};
