import { formatHtmlBlockLayout, hasEquivalentHtmlFormatting, readProtectedHtmlRanges } from './htmlFragment.mjs';
import { SOURCE_INDENT_WIDTH } from './sourceState.mjs';

export async function formatHtmlSource(source) {
  try {
    const protectedRanges = readProtectedHtmlRanges(source);
    if (protectedRanges === null) return { ok: false, reason: 'invalid_html' };
    if (!source.trim()) return { ok: true, value: source };

    // 블록 경계를 정리할 수 있으면 본문과 태그의 기존 표기를 그대로 둔다.
    const layout = formatHtmlBlockLayout(source, SOURCE_INDENT_WIDTH);
    if (layout !== null && hasEquivalentHtmlFormatting(source, layout)) {
      return { ok: true, value: layout };
    }
    const candidate = await formatWithPrettier(source, protectedRanges);
    return typeof candidate === 'string' && hasEquivalentHtmlFormatting(source, candidate)
      ? { ok: true, value: candidate }
      : { ok: false, reason: candidate === undefined ? 'format_failed' : 'format_information_loss' };
  } catch {
    return { ok: false, reason: 'format_failed' };
  }
}

async function formatWithPrettier(source, protectedRanges) {
  try {
    // 블록 경계 정렬만으로 처리할 수 없을 때 Prettier를 불러온다.
    const [{ format }, htmlPlugin] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/html'),
    ]);
    const formatted = await format(source, {
      parser: 'html',
      plugins: [htmlPlugin],
      tabWidth: SOURCE_INDENT_WIDTH,
      htmlWhitespaceSensitivity: 'css',
      embeddedLanguageFormatting: 'off',
      endOfLine: 'auto',
    });
    return restoreProtectedContents(source, protectedRanges, formatted);
  } catch {
    // Prettier가 읽지 못한 유효한 HTML도 안전한 태그 경계는 정리할 수 있다.
    return undefined;
  }
}

function restoreProtectedContents(source, protectedRanges, formatted) {
  const formattedRanges = readProtectedHtmlRanges(formatted);
  if (formattedRanges?.length !== protectedRanges.length) return null;

  // 코드와 별도 서식이 적용될 수 있는 요소 안에는 원문을 그대로 돌려놓는다.
  let value = '';
  let from = 0;
  formattedRanges.forEach((range, index) => {
    const original = protectedRanges[index];
    value += formatted.slice(from, range.from) + source.slice(original.from, original.to);
    from = range.to;
  });
  return value + formatted.slice(from);
}
