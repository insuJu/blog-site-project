import { useState, useCallback } from 'react';
import { getAllPosts, deletePost } from '../api/adminApi';

export const useAdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPosts({ page: page - 1 });
      setPosts(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
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

  const handlePageChange = (page) => {
    loadPosts(page);
  };

  return { 
    posts, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    totalElements, 
    loadPosts, 
    removePost, 
    handlePageChange 
  };
};
