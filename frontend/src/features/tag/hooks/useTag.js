import { useState, useEffect, useRef, useCallback } from 'react';
import { getTagById, createTag, updateTag, deleteTag } from '../api/tagApi';

export const useTag = (tagId = null) => {
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(!!tagId);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  const loadTag = useCallback(async () => {
    if (!tagId) return;

    setLoading(true);
    setError(null);
    try {
      const tagData = await getTagById(tagId);
      setTag(tagData);
    } catch (err) {
      console.error('Failed to load tag:', err);
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (tagId) {
      loadTag();
    }
  }, [tagId, loadTag]);

  const create = async (tagData) => {
    try {
      const newTag = await createTag(tagData);
      return { success: true, data: newTag };
    } catch (err) {
      console.error('Failed to create tag:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const update = async (id, tagData) => {
    try {
      const updatedTag = await updateTag(id, tagData);
      if (id === tagId) {
        setTag(updatedTag);
      }
      return { success: true, data: updatedTag };
    } catch (err) {
      console.error('Failed to update tag:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const remove = async (id) => {
    try {
      await deleteTag(id);
      if (id === tagId) {
        setTag(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete tag:', err);
      return false;
    }
  };

  return {
    tag,
    loading,
    error,
    create,
    update,
    remove,
    reload: loadTag
  };
};
