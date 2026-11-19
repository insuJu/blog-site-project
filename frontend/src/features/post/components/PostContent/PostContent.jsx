import { useEffect, useMemo, useRef } from 'react';
import Prism from '../../../../utils/prismConfig';
import { renderPostHtml } from './postContentHtml.mjs';
import styles from './PostContent.module.css';

export default function PostContent({ content, preview = false, className = '' }) {
  const ref = useRef(null);
  const html = useMemo(
    () => renderPostHtml(content, { preview }),
    [content, preview],
  );

  useEffect(() => {
    if (ref.current) Prism.highlightAllUnder(ref.current);
  }, [html]);

  function handlePreviewLink(event) {
    if (preview && event.target.closest('a[href]')) event.preventDefault();
  }

  return (
    <div
      ref={ref}
      className={`${styles.body} ${className}`}
      aria-label={preview ? '본문 미리보기' : undefined}
      onClick={preview ? handlePreviewLink : undefined}
      onAuxClick={preview ? handlePreviewLink : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
