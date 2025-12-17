import { useNavigate } from 'react-router-dom';
import { useCommentManage } from '../../hooks/useCommentManage';
import styles from './CommentManagement.module.css';

const CommentManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const navigate = useNavigate();
  const {
    comments,
    selectedIds,
    loading,
    handleSelect,
    handleSelectAll,
    handleDelete,
  } = useCommentManage();

  const onDeleteComments = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('삭제할 댓글을 선택해주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 댓글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await handleDelete();
      setSuccessMessage(`${selectedIds.length}개의 댓글이 삭제되었습니다.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const allSelected = comments.length > 0 && selectedIds.length === comments.length;

  return (
    <div className={styles["comment-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>내 댓글 목록 <span className={styles["count-badge"]}>{comments.length}</span></h2>
          <div className={styles.actions}>
            <label className={styles["select-all"]}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className={styles.checkbox}
              />
              <span>전체 선택</span>
            </label>
            <button
              onClick={onDeleteComments}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : comments.length === 0 ? (
          <div className={styles.empty}>작성한 댓글이 없습니다.</div>
        ) : (
          <div className={styles["comment-list"]}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles["comment-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(comment.id)}
                  onChange={(e) => handleSelect(comment.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles["comment-info"]}>
                  <div
                    className={styles["post-title"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/posts/${comment.postId}`);
                    }}
                  >
                    {comment.postTitle}
                  </div>
                  <div className={styles["comment-content"]}>{comment.content}</div>
                  <div className={styles["comment-meta"]}>
                    <span>좋아요: {comment.likeCount}</span>
                    <span>{comment.isPublic ? '공개' : '비공개'}</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentManagement;
