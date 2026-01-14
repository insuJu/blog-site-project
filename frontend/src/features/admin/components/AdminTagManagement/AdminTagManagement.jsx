import { useState, useEffect } from "react";
import * as adminApi from "../../api/adminApi";
import styles from "./AdminTagManagement.module.css";

const AdminTagManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllTags();
      setTags(data.content || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load tags");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(tags.map((tag) => tag.id));
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
      setErrorMessage("Delete target not selected");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (
      !window.confirm(
        `선택한 ${selectedIds.length}개의 태그를 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await adminApi.deleteTag(id);
      }
      setSuccessMessage(`${selectedIds.length}개의 태그가 삭제되었습니다.`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchTags();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete tag");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const allSelected = tags.length > 0 && selectedIds.length === tags.length;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className={styles["admin-tag-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>
            전체 태그 목록{" "}
            <span className={styles["count-badge"]}>{tags.length}</span>
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
                <div className={styles["tag-info"]}>
                  <span className={styles["tag-name"]}>{tag.name}</span>
                  <div className={styles["tag-meta"]}>
                    <span>Owner: {tag.ownerUsername}</span>
                    <span>Created: {formatDate(tag.createdAt)}</span>
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

export default AdminTagManagement;
