import { useState, useCallback } from 'react';
import { getAllComments, deleteComment } from '../api/adminApi';

export const useAdminComments = () => {
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = useCallback(async (page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllComments({ page, size });
      setComments(data);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeComment = useCallback(async (commentId) => {
    try {
      await deleteComment(commentId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete comment' };
    }
  }, []);

  return { comments, loading, error, loadComments, removeComment };
};
