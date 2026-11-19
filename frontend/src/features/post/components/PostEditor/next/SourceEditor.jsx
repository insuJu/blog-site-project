import { useEffect, useImperativeHandle, useRef } from 'react';
import { isolateHistory } from '@codemirror/commands';
import { EditorView } from '@codemirror/view';
import { formatHtmlSource } from './htmlSourceFormatter.mjs';
import { createSourceState, replaceSourceValue, sourceOptions } from './sourceState.mjs';

// 상위 편집기가 value로 넘긴 초안을 연다. format은 CodeMirror의 구문 설정에 사용한다.
export default function SourceEditor({
  ref, value, onChange, format, readOnly = false, label = '본문 소스',
}) {
  const parentRef = useRef(null);
  const instanceRef = useRef(null);
  // 편집기를 다시 만들지 않고도 가장 최근에 받은 onChange를 쓸 수 있게 저장한다.
  const onChangeRef = useRef(onChange);
  const initial = useRef({ value, format, readOnly, label });

  useImperativeHandle(ref, () => ({
    async formatHtml() {
      const instance = instanceRef.current;
      const view = instance?.view;
      if (format !== 'html' || !view || view.state.readOnly) return null;

      instance.skipInitialFormat = true;
      const original = view.state.doc;
      const result = await formatHtmlSource(view.state.sliceDoc());
      // 정렬을 기다리다가 입력하거나 모드를 바꾸면 이전 초안을 덮어쓰지 않는다.
      if (instanceRef.current?.view !== view || view.state.doc !== original || view.state.readOnly) return null;
      if (result.ok && result.value !== view.state.sliceDoc()) {
        view.dispatch({
          changes: { from: 0, to: original.length, insert: result.value },
          // 정렬도 편집 기록에 남겨 한 번에 실행 취소할 수 있게 한다.
          annotations: isolateHistory.of('full'),
          userEvent: 'input.format',
        });
      }
      return result;
    },
  }), [format]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    // 화면이 열릴 때 편집기를 만들고, 이후에는 그 편집기에서 글과 설정을 바꾼다.
    const { value, ...options } = initial.current;
    const { state, settings } = createSourceState(value, options, (source) => {
      const layout = instanceRef.current?.initialLayout;
      onChangeRef.current(source === layout?.formatted ? layout.original : source);
    });
    const view = new EditorView({ state, parent: parentRef.current });
    const instance = { view, settings, initialLayout: null, skipInitialFormat: false };
    instanceRef.current = instance;
    if (options.format === 'html') {
      // 처음 표시할 소스만 정렬하고 저장할 초안과 실행 취소 기록에는 넣지 않는다.
      void formatHtmlSource(value).then(result => {
        if (instanceRef.current !== instance || instance.skipInitialFormat
          || view.state.doc !== state.doc || view.compositionStarted
          || !result.ok || result.value === value) return;

        instance.initialLayout = { original: value, formatted: result.value };
        replaceSourceValue(view, result.value);
      });
    }
    return () => {
      view.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const { view, initialLayout } = instanceRef.current;
    // 편집을 실행 취소해 첫 화면으로 돌아오면 정렬된 표시와 저장 원문을 함께 복원한다.
    replaceSourceValue(view, value === initialLayout?.original ? initialLayout.formatted : value);
  }, [value]);

  useEffect(() => {
    const { view, settings } = instanceRef.current;
    // 설정만 바꾸면 쓰던 글, 커서 위치, 실행 취소 기록이 그대로 남는다.
    view.dispatch({ effects: settings.reconfigure(sourceOptions({ format, readOnly, label })) });
  }, [format, readOnly, label]);

  return <div ref={parentRef} />;
}
