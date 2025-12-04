import styles from './CommentForm.module.css';

const CommentForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isAuthenticated,
  placeholder = '댓글을 작성해주세요...',
  submitText = '댓글 작성',
  rows = 3,
  isReply = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={`${styles.commentForm} ${isReply ? styles.reply : ''}`} onSubmit={handleSubmit}>
      <textarea
        name="content"
        className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
        placeholder={
          isAuthenticated
            ? placeholder
            : '로그인 후 댓글을 작성할 수 있습니다.'
        }
        value={formData.content}
        onChange={onChange}
        disabled={!isAuthenticated}
        rows={rows}
      />
      {errors.content && <span className={styles.errorMessage}>{errors.content}</span>}

      <div className={styles.formActions}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={onChange}
            disabled={!isAuthenticated}
          />
          <span>공개</span>
        </label>

        <div className={styles.buttonGroup}>
          {onCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isAuthenticated || !formData.content.trim()}
          >
            {submitText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
