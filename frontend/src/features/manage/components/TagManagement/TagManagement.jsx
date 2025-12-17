import { useTagManage } from '../../hooks/useTagManage';
import styles from './TagManagement.module.css';

const TagManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const {
    tags,
    selectedIds,
    loading,
    handleDelete,
    handleSelectAll,
    handleSelect,
  } = useTagManage();

  const onDeleteTags = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage('삭제할 태그를 선택해주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!window.confirm(`선택한 ${selectedIds.length}개의 태그를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await handleDelete();
      setSuccessMessage(`${selectedIds.length}개의 태그가 삭제되었습니다.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '태그 삭제에 실패했습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const allSelected = tags.length > 0 && selectedIds.length === tags.length;

  return (
    <div className={styles["tag-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>태그 목록 <span className={styles["count-badge"]}>{tags.length}</span></h2>
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
              onClick={onDeleteTags}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : tags.length === 0 ? (
          <div className={styles.empty}>태그가 없습니다.</div>
        ) : (
          <div className={styles["tag-list"]}>
            {tags.map((tag) => (
              <div key={tag.id} className={styles["tag-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(tag.id)}
                  onChange={(e) => handleSelect(tag.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles["tag-name"]}>{tag.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagManagement;
