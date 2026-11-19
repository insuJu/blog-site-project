import { Compartment, EditorState, Transaction } from '@codemirror/state';
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { defaultHighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { html } from '@codemirror/lang-html';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

const sourceLanguages = new Map([
  ['html', html],
  ['markdown', () => markdown({ base: markdownLanguage })],
]);

export const SOURCE_INDENT_WIDTH = 4;

// format이 있으면 해당 구문 설정을 적용한다. 빈 값이면 소스를 일반 텍스트로 연다.
export function sourceOptions({ format, readOnly, label }) {
  const language = sourceLanguages.get(format);
  return [
    ...(language ? [language()] : []),
    // 읽기 전용이면 타이핑과 편집 단축키를 막는다.
    EditorState.readOnly.of(readOnly),
    EditorView.editable.of(!readOnly),
    EditorView.contentAttributes.of({ 'aria-label': label, 'aria-readonly': String(readOnly) }),
  ];
}

export function createSourceState(value, options, onChange) {
  const settings = new Compartment();
  const state = EditorState.create({
    doc: value,
    extensions: [
      // 줄바꿈을 \n으로 나누고 \r은 남겨 두면 원래 줄바꿈을 그대로 되돌릴 수 있다.
      EditorState.lineSeparator.of('\n'),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      // 화면 폭을 넘는 긴 소스를 접어서 보여 준다. 실제 줄바꿈은 문서에 추가하지 않는다.
      EditorView.lineWrapping,
      // 언어 확장이 파싱한 제목, 강조, 태그 등을 편집 화면에서도 구분해 보여 준다.
      syntaxHighlighting(defaultHighlightStyle),
      history(),
      // Tab은 현재 줄이나 선택한 줄을 들여쓰고, Shift+Tab은 들여쓰기를 줄인다.
      indentUnit.of(' '.repeat(SOURCE_INDENT_WIDTH)),
      keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
      settings.of(sourceOptions(options)),
      EditorView.updateListener.of((update) => {
        // 사용자가 글을 바꿨을 때만 onChange를 호출한다. 바깥에서 받은 값이나 설정 변경은 제외한다.
        if (update.transactions.some((transaction) => (
          transaction.docChanged && !transaction.annotation(Transaction.remote)
        ))) {
          onChange(update.state.sliceDoc());
        }
      }),
    ],
  });

  return { state, settings };
}

export function replaceSourceValue(view, value) {
  if (view.state.sliceDoc() === value) return;

  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: value },
    // 바깥에서 받은 값은 실행 취소 기록에 추가하지 않는다.
    annotations: [Transaction.remote.of(true), Transaction.addToHistory.of(false)],
  });
}
