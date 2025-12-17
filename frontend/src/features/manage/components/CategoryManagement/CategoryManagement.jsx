import { useState } from "react";
import { useCategoryManage } from "../../hooks/useCategoryManage";
import { createCategory } from "../../../category/api/categoryApi";
import styles from "./CategoryManagement.module.css";

const CategoryTreeItem = ({
  category,
  depth = 0,
  onReload,
  selectedIds,
  onSelect,
}) => {
  const [showChildForm, setShowChildForm] = useState(false);
  const [childName, setChildName] = useState("");

  const handleCreateChild = async () => {
    if (!childName || !childName.trim()) return;
    try {
      await createCategory({ name: childName.trim(), parentId: category.id });
      setChildName("");
      setShowChildForm(false);
      await onReload();
    } catch (err) {
      console.error("Failed to create child category:", err);
    }
  };

  return (
    <>
      <div className={styles["category-card"]} data-depth={depth}>
        <div className={styles["category-header"]}>
          <input
            type="checkbox"
            checked={selectedIds.includes(category.id)}
            onChange={(e) => onSelect(category.id, e.target.checked)}
            className={styles.checkbox}
          />
          <div className={styles["category-info"]}>
            <div className={styles["category-details"]}>
              <h3 className={styles["category-name"]}>{category.name}</h3>
              <div className={styles["category-meta"]}>
                <span className={styles["post-count"]}>
                  게시글 {category.postCount || 0}
                </span>
                {category.children && category.children.length > 0 && (
                  <span className={styles["child-count"]}>
                    하위 {category.children.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles["category-actions"]}>
            {depth === 0 && (
              <button
                className={`${styles["action-button"]} ${styles["add-child-button"]}`}
                onClick={() => setShowChildForm(!showChildForm)}
              >
                {showChildForm ? "취소" : "하위 추가"}
              </button>
            )}
          </div>
        </div>

        {showChildForm && (
          <div className={styles["child-form"]}>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateChild()}
              placeholder="하위 카테고리 이름"
              className={styles["child-input"]}
              autoFocus
            />
            <button
              className={styles["child-button"]}
              onClick={handleCreateChild}
            >
              추가
            </button>
            <button
              className={styles["cancel-button"]}
              onClick={() => {
                setShowChildForm(false);
                setChildName("");
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {category.children && category.children.length > 0 && (
        <>
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              depth={depth + 1}
              onReload={onReload}
              selectedIds={selectedIds}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </>
  );
};

const CategoryManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const { categories, loading, formData, setFormData, handleDeleteBulk } =
    useCategoryManage();

  const [parentId, setParentId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const flattenForSelect = (cats, depth = 0, out = []) => {
    cats.forEach((c) => {
      if (depth === 0) {
        out.push({ id: c.id, name: c.name, depth });
      }
    });
    return out;
  };

  const countCategories = (cats) => {
    let count = cats.length;
    cats.forEach((c) => {
      if (c.children && c.children.length > 0) {
        count += countCategories(c.children);
      }
    });
    return count;
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("카테고리 이름을 입력해주세요.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const payload = { name: formData.name.trim() };
      if (parentId !== "" && parentId != null) {
        payload.parentId = Number(parentId);
      }
      await createCategory(payload);
      setFormData({ name: "", parentId: null });
      setParentId("");
      setSuccessMessage("카테고리가 생성되었습니다.");
      setTimeout(() => setSuccessMessage(""), 3000);
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.name || "카테고리 생성에 실패했습니다."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSelect = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = [];
      const collectIds = (cats) => {
        cats.forEach((cat) => {
          allIds.push(cat.id);
          if (cat.children && cat.children.length > 0) {
            collectIds(cat.children);
          }
        });
      };
      collectIds(categories);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("삭제할 카테고리를 선택해주세요.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (
      !window.confirm(
        `선택한 ${selectedIds.length}개의 카테고리를 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      await handleDeleteBulk(selectedIds);
      setSelectedIds([]);
      setSuccessMessage(`${selectedIds.length}개의 카테고리가 삭제되었습니다.`);
      setTimeout(() => setSuccessMessage(""), 3000);
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "카테고리 삭제에 실패했습니다."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className={styles["category-management"]}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>카테고리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const allCategoryIds = [];
  const collectAllIds = (cats) => {
    cats.forEach((cat) => {
      allCategoryIds.push(cat.id);
      if (cat.children && cat.children.length > 0) {
        collectAllIds(cat.children);
      }
    });
  };
  collectAllIds(categories);
  const allSelected =
    allCategoryIds.length > 0 && selectedIds.length === allCategoryIds.length;

  return (
    <div className={styles["category-management"]}>
      <div className={styles.section}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>카테고리 목록 <span className={styles["count-badge"]}>{countCategories(categories)}</span></h2>
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
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className={styles["delete-button"]}
            >
              선택 삭제 ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>

      <div className={styles["create-section"]}>
        <h3 className={styles["create-title"]}>새 카테고리 만들기</h3>
        <div className={styles["create-form"]}>
          <div className={styles["form-group"]}>
            <label className={styles.label}>부모 카테고리</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className={styles["parent-select"]}
            >
              <option value="">최상위</option>
              {flattenForSelect(categories).map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {"　".repeat(opt.depth)}
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles.label}>카테고리 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleCreateCategory()}
              placeholder="예: React, Java, Algorithm"
              className={styles["create-input"]}
            />
          </div>

          <button
            onClick={handleCreateCategory}
            className={styles["create-button"]}
          >
            생성
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className={styles["empty-state"]}>
          <h3 className={styles["empty-title"]}>아직 카테고리가 없습니다</h3>
          <p className={styles["empty-text"]}>
            위에서 첫 번째 카테고리를 만들어보세요
          </p>
        </div>
      ) : (
        <div className={styles["category-list"]}>
          {categories.map((category) => (
            <CategoryTreeItem
              key={category.id}
              category={category}
              depth={0}
              onReload={handleReload}
              selectedIds={selectedIds}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
