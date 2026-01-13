import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import styles from './AdminCategoryManagement.module.css';

const AdminCategoryManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load categories');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(categories.map((cat) => cat.id));
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

    if (!window.confirm(`선택한 ${selectedIds.length}개의 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await adminApi.deleteCategory(id);
      }
      setSuccessMessage(`${selectedIds.length}개의 카테고리가 삭제되었습니다.`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchCategories();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete category');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const allSelected = categories.length > 0 && selectedIds.length === categories.length;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className={styles["admin-category-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>
            전체 카테고리 목록 <span className={styles["count-badge"]}>{categories.length}</span>
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
        ) : categories.length === 0 ? (
          <div className={styles.empty}>카테고리가 없습니다.</div>
        ) : (
          <div className={styles["category-list"]}>
            {categories.map((category) => (
              <div key={category.id} className={styles["category-item"]}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(category.id)}
                  onChange={(e) => handleSelect(category.id, e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles["category-info"]}>
                  <span className={styles["category-name"]}>{category.name}</span>
                  <div className={styles["category-meta"]}>
                    <span>Owner: {category.ownerUsername}</span>
                    <span>Created: {formatDate(category.createdAt)}</span>
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

export default AdminCategoryManagement;
