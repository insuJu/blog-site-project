import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import styles from './CategoryListPage.module.css';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('카테고리를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadCategories();
  }, []);

  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState('');

  const flattenForSelect = (cats, depth = 0, out = []) => {
    cats.forEach((c) => {
      // depth N: 카테고리의 계층 깊이 (0~N <-> 최상위~N번째 하위)
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

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const payload = { name: newName.trim() };
      if (parentId !== '' && parentId != null) payload.parentId = Number(parentId);
      await createCategory(payload);
      setNewName('');
      setParentId('');
      await reloadCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('카테고리 생성에 실패했습니다.');
    }
  };

  const handleCreateChild = async (parentId, childName, setChildName, setOpen) => {
    if (!childName || !childName.trim()) return;
    try {
      await createCategory({ name: childName.trim(), parentId });
      setChildName('');
      setOpen(false);
      await reloadCategories();
    } catch (err) {
      console.error('Failed to create child category:', err);
      setError('자식 카테고리 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`'${name}' 카테고리를 삭제하시겠습니까?`)) return;
    try {
      await deleteCategory(id);
      await reloadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('카테고리 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={styles.categoryListPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>카테고리를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.categoryListPage}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryListPage}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.mainTitle}>카테고리 관리</h1>
          <p className={styles.subtitle}>
            총 {countCategories(categories)}개의 카테고리
          </p>
        </div>

        <div className={styles.createSection}>
          <h2 className={styles.createTitle}>새 카테고리 만들기</h2>
          <div className={styles.createForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>부모 카테고리</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className={styles.parentSelect}
              >
                <option value="">최상위</option>
                {flattenForSelect(categories).map(opt => (
                  <option key={opt.id} value={String(opt.id)}>
                    {'　'.repeat(opt.depth)}{opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>카테고리 이름</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="예: React, Java, Algorithm"
                className={styles.createInput}
              />
            </div>

            <button onClick={handleCreate} className={styles.createButton}>
              생성
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>아직 카테고리가 없습니다</h3>
            <p className={styles.emptyText}>위에서 첫 번째 카테고리를 만들어보세요</p>
          </div>
        ) : (
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                depth={0}
                handleCreateChild={handleCreateChild}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryTreeItem = ({ category, depth = 0, handleCreateChild, handleDelete }) => {
  const [showChildForm, setShowChildForm] = useState(false);
  const [childName, setChildName] = useState('');

  return (
    <>
      <div className={styles.categoryCard} data-depth={depth}>
        <div className={styles.categoryHeader}>
          <div className={styles.categoryInfo}>
            <div className={styles.categoryDetails}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <div className={styles.categoryMeta}>
                <span className={styles.postCount}>
                  게시글 {category.postCount || 0}
                </span>
                {category.children && category.children.length > 0 && (
                  <span className={styles.childCount}>
                    하위 {category.children.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.categoryActions}>
            {/* 최상위 카테고리만 하위 추가 가능 (depth 0) */}
            {depth === 0 && (
              <button
                className={`${styles.actionButton} ${styles.addChildButton}`}
                onClick={() => setShowChildForm(!showChildForm)}
              >
                {showChildForm ? '취소' : '하위 추가'}
              </button>
            )}
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => handleDelete(category.id, category.name)}
            >
              삭제
            </button>
          </div>
        </div>

        {showChildForm && (
          <div className={styles.childForm}>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateChild(category.id, childName, setChildName, setShowChildForm)}
              placeholder="하위 카테고리 이름"
              className={styles.childInput}
              autoFocus
            />
            <button
              className={styles.childButton}
              onClick={() => handleCreateChild(category.id, childName, setChildName, setShowChildForm)}
            >
              추가
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setShowChildForm(false);
                setChildName('');
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {category.children && category.children.length > 0 && (
        <>
          {category.children.map(child => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              depth={depth + 1}
              handleCreateChild={handleCreateChild}
              handleDelete={handleDelete}
            />
          ))}
        </>
      )}
    </>
  );
};

export default CategoryListPage;
