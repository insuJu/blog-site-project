import { useState, useEffect } from 'react';
import { useAdminComments } from '../../hooks/useAdminComments';
import styles from './AdminCommentManagement.module.css';

const AdminCommentManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const { comments, loading, error, loadComments, removeComment } = useAdminComments();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSelectAll = (checked) => {
    if (checked && comments?.content) {
      setSelectedIds(comments.content.map((comment) => comment.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('Delete target not selected');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 댓글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await removeComment(id);
      }
      setSuccessMessage(`${selectedIds.length}개의 댓글이 삭제되었습니다.`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadComments();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete comment');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const commentList = comments?.content || [];
  const allSelected = commentList.length > 0 && selectedIds.length === commentList.length;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (error) {
    return (
      <div className={styles["admin-comment-management"]}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles["admin-comment-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>
            전체 댓글 목록 <span className={styles["count-badge"]}>{commentList.length}</span>
          </h2>
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
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : commentList.length === 0 ? (
          <div className={styles.empty}>댓글이 없습니다.</div>
        ) : (
          <div className={styles["comment-list"]}>
            {commentList.map((comment) => (
              <div key={comment.id} className={styles["comment-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(comment.id)}
                  onChange={(e) => handleSelect(comment.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles["comment-info"]}>
                  <span className={styles["comment-content"]}>{comment.content}</span>
                  <div className={styles["comment-meta"]}>
                    <span>Author: {comment.authorUsername}</span>
                    <span>Post ID: {comment.postId}</span>
                    <span>Created: {formatDate(comment.createdAt)}</span>
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

export default AdminCommentManagement;
