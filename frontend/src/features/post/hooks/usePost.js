import { useState, useEffect, useRef, useCallback } from 'react';
import { getPostById, createPost, updatePost, deletePost } from '../api/postApi';

export const usePost = (postId = null) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  const loadPost = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);
    try {
      const postData = await getPostById(postId);
      setPost(postData);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (postId) {
      loadPost();
    }
  }, [postId, loadPost]);

  const create = async (postData) => {
    try {
      const newPost = await createPost(postData);
      return { success: true, data: newPost };
    } catch (err) {
      console.error('Failed to create post:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const update = async (id, postData) => {
    try {
      const updatedPost = await updatePost(id, postData);
      if (id === postId) {
        setPost(updatedPost);
      }
      return { success: true, data: updatedPost };
    } catch (err) {
      console.error('Failed to update post:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const remove = async (id) => {
    try {
      await deletePost(id);
      if (id === postId) {
        setPost(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete post:', err);
      return false;
    }
  };

  const updateLikeCount = (newLikedStatus) => {
    setPost(prev => ({
      ...prev,
      likeCount: newLikedStatus ? prev.likeCount + 1 : prev.likeCount - 1
    }));
  };

  return {
    post,
    loading,
    error,
    create,
    update,
    remove,
    updateLikeCount,
    reload: loadPost
  };
};
