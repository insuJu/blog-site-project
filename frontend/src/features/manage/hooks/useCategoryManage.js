import { useState, useCallback, useEffect } from 'react';
import { getAllCategories, createCategory } from '../../category/api/categoryApi';
import { deleteCategories } from '../api/manageApi';

export const useCategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', parentId: null });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = useCallback(async () => {
    if (!formData.name.trim()) {
      throw new Error('카테고리 이름을 입력해주세요.');
    }

    try {
      await createCategory(formData);
      setFormData({ name: '', parentId: null });
      await loadCategories();
    } catch (error) {
      throw error;
    }
  }, [formData, loadCategories]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error('삭제할 카테고리를 선택해주세요.');
    }

    try {
      await deleteCategories(selectedIds);
      setSelectedIds([]);
      await loadCategories();
    } catch (error) {
      throw error;
    }
  }, [selectedIds, loadCategories]);

  const handleSelectAll = useCallback((checked) => {
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
  }, [categories]);

  const handleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  const handleDeleteBulk = useCallback(async (ids) => {
    try {
      await deleteCategories(ids);
      await loadCategories();
    } catch (error) {
      throw error;
    }
  }, [loadCategories]);

  return {
    categories,
    selectedIds,
    loading,
    formData,
    setFormData,
    handleCreate,
    handleDelete,
    handleDeleteBulk,
    handleSelectAll,
    handleSelect,
  };
};
