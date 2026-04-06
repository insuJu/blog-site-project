import { useState, useEffect } from 'react';
import { useAdminPosts } from '../../hooks/useAdminPosts';
import styles from './AdminPostManagement.module.css';

const AdminPostManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const { 
    posts: postList, 
    loading, 
    error, 
    currentPage,
    totalPages,
    totalElements,
    loadPosts, 
    removePost,
    handlePageChange
  } = useAdminPosts();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  const handleSelectAll = (checked) => {
    if (checked && postList) {
      setSelectedIds(postList.map((post) => post.id));
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

  const onPageChange = (page) => {
    handlePageChange(page);
    setSelectedIds([]); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('삭제할 게시글을 선택해주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await removePost(id);
      }
      setSuccessMessage(`${selectedIds.length}개의 게시글이 삭제되었습니다.`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadPosts(currentPage);
    } catch (err) {
      setErrorMessage(err.message || '게시글 삭제에 실패했습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const allSelected = postList.length > 0 && selectedIds.length === postList.length;

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
      <div className={styles["admin-post-management"]}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles["admin-post-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>
            전체 게시글 목록 <span className={styles["count-badge"]}>{totalElements}</span>
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
        ) : postList.length === 0 ? (
          <div className={styles.empty}>게시글이 없습니다.</div>
        ) : (
          <>
            <div className={styles["post-list"]}>
              {postList.map((post) => (
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
                      <span>작성자: {post.authorUsername}</span>
                      <span>카테고리: {post.categoryName || '없음'}</span>
                      <span>작성일: {formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ""}`}
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  className={styles.pageButton}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPostManagement;
