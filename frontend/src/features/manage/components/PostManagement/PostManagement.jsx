import { useNavigate } from 'react-router-dom';
import { usePostManage } from '../../hooks/usePostManage';
import styles from './PostManagement.module.css';

const PostManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const navigate = useNavigate();
  const {
    posts,
    selectedIds,
    loading,
    handleDelete,
    handleSelectAll,
    handleSelect,
  } = usePostManage();

  const onDeletePosts = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('삭제할 게시글을 선택해주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await handleDelete();
      setSuccessMessage(`${selectedIds.length}개의 게시글이 삭제되었습니다.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const allSelected = posts.length > 0 && selectedIds.length === posts.length;

  return (
    <div className={styles["post-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>내 게시글 목록 <span className={styles["count-badge"]}>{posts.length}</span></h2>
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
              onClick={onDeletePosts}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>게시글이 없습니다.</div>
        ) : (
          <div className={styles["post-list"]}>
            {posts.map((post) => (
              <div key={post.id} className={styles["post-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(post.id)}
                  onChange={(e) => handleSelect(post.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles["post-info"]}>
                  <span className={styles["post-title"]}>{post.title}</span>
                  <div className={styles["post-meta"]}>
                    <span>카테고리: {post.category?.name || '없음'}</span>
                    <span>태그: {post.tags?.map((t) => t.name).join(', ') || '없음'}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  className={styles["edit-button"]}
                >
                  수정
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManagement;
