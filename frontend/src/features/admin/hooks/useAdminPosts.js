import { useState, useCallback } from 'react';
import { getAllPosts, deletePost } from '../api/adminApi';

export const useAdminPosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async (page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts({ page, size });
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const removePost = useCallback(async (postId) => {
    try {
      await deletePost(postId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete post' };
    }
  }, []);

  return { posts, loading, error, loadPosts, removePost };
};
