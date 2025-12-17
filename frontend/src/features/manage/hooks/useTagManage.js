import { useState, useCallback, useEffect } from 'react';
import { deleteTags } from '../api/manageApi';

export const useTagManage = () => {
  const [tags, setTags] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tags`, {
        credentials: 'include',
      });
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error('Failed to load tags:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error('삭제할 태그를 선택해주세요.');
    }

    try {
      await deleteTags(selectedIds);
      setSelectedIds([]);
      await loadTags();
    } catch (error) {
      throw error;
    }
  }, [selectedIds, loadTags]);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedIds(tags.map((tag) => tag.id));
    } else {
      setSelectedIds([]);
    }
  }, [tags]);

  const handleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  return {
    tags,
    selectedIds,
    loading,
    handleDelete,
    handleSelectAll,
    handleSelect,
  };
};
