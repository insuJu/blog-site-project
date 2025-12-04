import { useState, useEffect, useRef, useCallback } from 'react';
import { getCategoryById, createCategory, updateCategory, deleteCategory, getCategoriesByParentId } from '../api/categoryApi';

export const useCategory = (categoryId = null) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(!!categoryId);
  const [error, setError] = useState(null);
  const [children, setChildren] = useState([]);
  const hasLoadedRef = useRef(false);

  const loadCategory = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    try {
      const categoryData = await getCategoryById(categoryId);
      setCategory(categoryData);

      try {
        const childrenData = await getCategoriesByParentId(categoryId);
        setChildren(childrenData || []);
      } catch (err) {
        console.log('No children or failed to load children');
        setChildren([]);
      }
    } catch (err) {
      console.error('Failed to load category:', err);
      setError('Failed to load category');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId, loadCategory]);

  const create = async (categoryData) => {
    try {
      const newCategory = await createCategory(categoryData);
      return { success: true, data: newCategory };
    } catch (err) {
      console.error('Failed to create category:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const update = async (id, categoryData) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      if (id === categoryId) {
        setCategory(updatedCategory);
      }
      return { success: true, data: updatedCategory };
    } catch (err) {
      console.error('Failed to update category:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const remove = async (id) => {
    try {
      await deleteCategory(id);
      if (id === categoryId) {
        setCategory(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete category:', err);
      return false;
    }
  };

  return {
    category,
    loading,
    error,
    children,
    create,
    update,
    remove,
    reload: loadCategory
  };
};
