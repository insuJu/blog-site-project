import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useCategories } from '../../../category/hooks/useCategories';
import EditorModeSelector from './components/EditorModeSelector';
import EditorToolbar from './components/EditorToolbar';
import { useEditorFormat } from './hooks/useEditorFormat';
import styles from './PostEditor.module.css';

const PostEditor = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    tags: initialData?.tags || '',
    isPublic: initialData?.isPublic !== undefined ? initialData.isPublic : true,
  });
  const [currentTagInput, setCurrentTagInput] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorMode, setEditorMode] = useState('wysiwyg');
  const [showPreview, setShowPreview] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const textareaRef = useRef(null);
  const wysiwygRef = useRef(null);
  const latestContentRef = useRef(formData.content);

  const { htmlFormats, markdownFormats } = useEditorFormat(textareaRef, setFormData);
  const { categories } = useCategories();

  const flattenForSelect = (cats, depth = 0, out = []) => {
    (cats || []).forEach((c) => {
      out.push({ id: c.id, name: c.name, depth });
      if (c.children && c.children.length > 0) flattenForSelect(c.children, depth + 1, out);
    });
    return out;
  };

  useEffect(() => {
    if (wysiwygRef.current && initialData?.content) {
      wysiwygRef.current.innerHTML = initialData.content;
    }
  }, []);

  const wysiwygFormats = {
    bold: () => {
      document.execCommand('bold', false, null);
      wysiwygRef.current?.focus();
    },
    italic: () => {
      document.execCommand('italic', false, null);
      wysiwygRef.current?.focus();
    },
    underline: () => {
      document.execCommand('underline', false, null);
      wysiwygRef.current?.focus();
    },
    strikethrough: () => {
      document.execCommand('strikeThrough', false, null);
      wysiwygRef.current?.focus();
    },
    heading: (level) => {
      document.execCommand('formatBlock', false, `<h${level}>`);
      wysiwygRef.current?.focus();
    },
    list: () => {
      document.execCommand('insertUnorderedList', false, null);
      wysiwygRef.current?.focus();
    },
    orderedList: () => {
      document.execCommand('insertOrderedList', false, null);
      wysiwygRef.current?.focus();
    },
    quote: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        let existingBlockquote = element.closest('blockquote');

        if (existingBlockquote) {
          document.execCommand('formatBlock', false, '<p>');
        } else {
          document.execCommand('formatBlock', false, '<blockquote>');
        }
      }
      wysiwygRef.current?.focus();
    },
    code: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        let existingCode = element.closest('code');

        if (existingCode && existingCode.parentElement) {
          const textContent = existingCode.textContent;
          const textNode = document.createTextNode(textContent);
          existingCode.parentNode.replaceChild(textNode, existingCode);

          const newRange = document.createRange();
          newRange.setStart(textNode, textContent.length);
          newRange.setEnd(textNode, textContent.length);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          const selectedText = range.toString();
          if (selectedText) {
            const code = document.createElement('code');
            code.style.backgroundColor = '#f8f9fa';
            code.style.padding = '2px 6px';
            code.style.borderRadius = '4px';
            code.style.fontFamily = 'monospace';
            code.style.fontSize = '0.9em';
            code.style.color = '#e83e8c';
            code.textContent = selectedText;

            range.deleteContents();
            range.insertNode(code);

            range.setStartAfter(code);
            range.setEndAfter(code);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
      wysiwygRef.current?.focus();
    },
    codeBlock: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        let existingPre = element.closest('pre');

        if (existingPre) {
          const textContent = existingPre.textContent;
          const p = document.createElement('p');
          p.textContent = textContent;
          existingPre.parentNode.replaceChild(p, existingPre);

          const newRange = document.createRange();
          newRange.selectNodeContents(p);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          const selectedText = range.toString() || '';

          const pre = document.createElement('pre');
          pre.style.backgroundColor = '#282c34';
          pre.style.color = '#abb2bf';
          pre.style.padding = '16px';
          pre.style.borderRadius = '8px';
          pre.style.overflow = 'auto';
          pre.style.fontFamily = 'monospace';
          pre.style.fontSize = '0.9em';
          pre.style.lineHeight = '1.6';
          pre.style.whiteSpace = 'pre-wrap';
          pre.contentEditable = 'true';

          const code = document.createElement('code');
          code.textContent = selectedText || '';
          pre.appendChild(code);

          range.deleteContents();
          range.insertNode(pre);

          const exitParagraph = document.createElement('p');
          exitParagraph.innerHTML = '<br>';
          pre.parentNode.insertBefore(exitParagraph, pre.nextSibling);

          const newRange = document.createRange();
          newRange.selectNodeContents(code);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      wysiwygRef.current?.focus();
    },
    link: () => {
      const url = prompt('링크 URL을 입력하세요:', 'https://');
      if (url) document.execCommand('createLink', false, url);
      wysiwygRef.current?.focus();
    },
    image: () => {
      const url = prompt('이미지 URL을 입력하세요:', 'https://');
      if (url) document.execCommand('insertImage', false, url);
      wysiwygRef.current?.focus();
    },
    horizontalRule: () => {
      document.execCommand('insertHorizontalRule', false, null);
      wysiwygRef.current?.focus();
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'content') {
      latestContentRef.current = newValue;
    }

    if (name === 'tags') {
      setCurrentTagInput(newValue);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagsKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const cur = currentTagInput.trim();
      if (!cur) return;

      e.preventDefault();

      const hashMatch = cur.match(/#([^\s#,]+)/);
      if (hashMatch) {
        const tagName = hashMatch[1].trim();
        const currentTags = parseTags(formData.tags);

        if (!currentTags.includes(tagName)) {
          const newTags = [...currentTags, tagName];
          setFormData(prev => ({
            ...prev,
            tags: newTags.map(t => `#${t}`).join(' ')
          }));
        }
      }

      setCurrentTagInput('');
    }

    if (e.key === 'Backspace' && currentTagInput === '') {
      e.preventDefault();
      const currentTags = parseTags(formData.tags);
      if (currentTags.length > 0) {
        const newTags = currentTags.slice(0, -1);
        setFormData(prev => ({
          ...prev,
          tags: newTags.map(t => `#${t}`).join(' ')
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자를 초과할 수 없습니다.';
    }

    const content = editorMode === 'wysiwyg' && wysiwygRef.current
      ? wysiwygRef.current.innerText || wysiwygRef.current.textContent
      : formData.content;

    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseTags = (tagsString) => {
    if (!tagsString) return [];

    const hashMatches = [...tagsString.matchAll(/#([^\s#,]+)/g)].map(m => m[1].trim()).filter(Boolean);
    if (hashMatches.length > 0) {
      return hashMatches;
    }

    return tagsString.split(',').map(t => t.trim()).filter(Boolean);
  };

  const removeTag = (tagToRemove) => {
    const currentTags = parseTags(formData.tags);
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      tags: updatedTags.map(tag => `#${tag}`).join(' ')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editorMode === 'wysiwyg' && wysiwygRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: wysiwygRef.current.innerHTML,
      }));
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = editorMode === 'wysiwyg' && wysiwygRef.current
        ? { ...formData, content: wysiwygRef.current.innerHTML }
        : formData;

      await onSubmit(submitData);
    } catch (error) {
      console.error('Failed to save post:', error);
      setErrors({ submit: error.message || '글 저장에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (newMode) => {
    if (editorMode === 'wysiwyg' && wysiwygRef.current) {
      const htmlContent = wysiwygRef.current.innerHTML;

      latestContentRef.current = htmlContent;

      flushSync(() => {
        setFormData((prev) => {
          return { ...prev, content: htmlContent };
        });
      });
    }
    else if (newMode === 'wysiwyg') {
      if (wysiwygRef.current && formData.content) {
        wysiwygRef.current.innerHTML = formData.content;
      }
    }

    setEditorMode(newMode);
    setShowPreview(false);
  };

  const renderPreview = () => {
    let html = formData.content;

    if (editorMode === 'markdown') {
      html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

      html = html.replace(/\n/g, '<br>');
    }

    return html;
  };

  const handleWysiwygKeyDown = (e) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;

        let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

        let blockquote = element.closest('blockquote');
        if (blockquote) {
          const currentText = element.textContent.trim();

          if (currentText === '' || currentText === '\n') {
            e.preventDefault();

            const newP = document.createElement('p');
            newP.innerHTML = '<br>';
            blockquote.parentNode.insertBefore(newP, blockquote.nextSibling);

            const newRange = document.createRange();
            newRange.setStart(newP, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
          return;
        }

        let pre = element.closest('pre');
        if (pre) {
          e.preventDefault();
          document.execCommand('insertLineBreak');
        }
      }
    }
  };

  const getPlaceholder = () => {
    if (editorMode === 'wysiwyg') {
      return '내용을 입력하세요...\n\n툴바의 버튼을 사용하여 텍스트를 꾸밀 수 있습니다.';
    } else if (editorMode === 'markdown') {
      return '마크다운 문법을 사용하여 내용을 작성하세요...\n\n예: **굵게**, *기울임*, # 제목';
    } else {
      return 'HTML 코드를 직접 작성하세요...\n\n예: <p>문단</p>, <strong>굵게</strong>, <h1>제목</h1>';
    }
  };

  const currentFormats = editorMode === 'wysiwyg' ? wysiwygFormats : editorMode === 'markdown' ? markdownFormats : htmlFormats;

  return (
    <form className={styles.editorForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className={`${styles.titleInput} ${errors.title ? styles.error : ''}`}
          disabled={isSubmitting}
        />
        {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
      </div>

      <div className={styles.metaRow}>
        <div className={styles.formGroup}>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={styles.categorySelect}
            disabled={isSubmitting}
          >
            <option value="">카테고리 선택</option>
            {flattenForSelect(categories).map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                style={{
                  paddingLeft: `${opt.depth * 16}px`,
                  fontWeight: opt.depth === 0 ? '600' : '400',
                  color: opt.depth === 0 ? '#212529' : '#6c757d'
                }}
              >
                {opt.depth > 0 ? '└ ' : ''}{opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.tagInputWrapper}>
            <div className={styles.tagInputContainer} onClick={() => document.querySelector('[name="tags"]').focus()}>
              {parseTags(formData.tags).map((tag, index) => (
                <div key={index} className={styles.tagChip}>
                  <span className={styles.tagChipText}>#{tag}</span>
                  <button
                    type="button"
                    className={styles.tagChipRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    disabled={isSubmitting}
                    aria-label={`${tag} 태그 제거`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                name="tags"
                value={currentTagInput}
                onChange={handleChange}
                onKeyDown={handleTagsKeyDown}
                placeholder={parseTags(formData.tags).length === 0 ? "태그 (예: #React #JavaScript)" : ""}
                className={styles.tagsInput}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      <EditorModeSelector
        editorMode={editorMode}
        onModeChange={handleModeChange}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {editorMode === 'wysiwyg' && (
        <EditorToolbar
          editorMode={editorMode}
          formats={currentFormats}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
      )}

      <div className={styles.editorContainer}>
        <div
          ref={wysiwygRef}
          className={`${styles.preview} ${styles.wysiwygPreview} ${styles[`fontSize-${fontSize}`]} ${errors.content ? styles.error : ''}`}
          contentEditable={!isSubmitting}
          suppressContentEditableWarning
          style={{ display: editorMode === 'wysiwyg' ? 'block' : 'none' }}
          onInput={() => {
            if (errors.content) {
              setErrors((prev) => ({ ...prev, content: '' }));
            }
          }}
          onKeyDown={handleWysiwygKeyDown}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const container = range.startContainer;
              let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
              let pre = element.closest('pre');

              if (pre) {
                const textNode = document.createTextNode(text);
              
                range.deleteContents();
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);

                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                const lines = text.split('\n');
                const fragment = document.createDocumentFragment();

                lines.forEach((line, index) => {
                  fragment.appendChild(document.createTextNode(line));
                  if (index < lines.length - 1) {
                    fragment.appendChild(document.createElement('br'));
                  }
                });

                range.deleteContents();
                range.insertNode(fragment);

                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }}
        />

        {editorMode !== 'wysiwyg' && !showPreview && (
          <div className={styles.formGroup}>
            <textarea
              ref={textareaRef}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder={getPlaceholder()}
              className={`${styles.contentTextarea} ${styles.codeMode} ${styles[`fontSize-${fontSize}`]} ${errors.content ? styles.error : ''}`}
              disabled={isSubmitting}
            />
            {errors.content && (
              <span className={styles.errorMessage}>{errors.content}</span>
            )}
          </div>
        )}

        {editorMode !== 'wysiwyg' && showPreview && (
          <div
            className={`${styles.preview} ${styles[`fontSize-${fontSize}`]}`}
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        )}

        {errors.content && editorMode === 'wysiwyg' && (
          <span className={styles.errorMessage}>{errors.content}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className={styles.checkbox}
            disabled={isSubmitting}
          />
          <span>공개 설정</span>
        </label>
      </div>

      {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          취소
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : isEditing ? '수정' : '발행'}
        </button>
      </div>
    </form>
  );
};

export default PostEditor;
