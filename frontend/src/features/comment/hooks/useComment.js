import { useState, useEffect, useRef, useCallback } from 'react';
import { getCommentById, createComment, updateComment, deleteComment } from '../api/commentApi';

export const useComment = (postId, commentId = null) => {
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(!!commentId);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  const loadComment = useCallback(async () => {
    if (!postId || !commentId) return;

    setLoading(true);
    setError(null);
    try {
      const commentData = await getCommentById(postId, commentId);
      setComment(commentData);
    } catch (err) {
      console.error('Failed to load comment:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, commentId]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (postId && commentId) {
      loadComment();
    }
  }, [postId, commentId, loadComment]);

  const create = async (commentData) => {
    if (!postId) return { success: false, errors: {} };

    try {
      const newComment = await createComment(postId, commentData);
      return { success: true, data: newComment };
    } catch (err) {
      console.error('Failed to create comment:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const update = async (id, commentData) => {
    if (!postId) return { success: false, errors: {} };

    try {
      const updatedComment = await updateComment(postId, id, commentData);
      if (id === commentId) {
        setComment(updatedComment);
      }
      return { success: true, data: updatedComment };
    } catch (err) {
      console.error('Failed to update comment:', err);
      const errors = err.response?.data?.errors || {};
      return { success: false, errors };
    }
  };

  const remove = async (id) => {
    if (!postId) return false;

    try {
      await deleteComment(postId, id);
      if (id === commentId) {
        setComment(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete comment:', err);
      return false;
    }
  };

  const updateLikeCount = (newLikedStatus) => {
    setComment(prev => ({
      ...prev,
      likeCount: newLikedStatus ? prev.likeCount + 1 : prev.likeCount - 1
    }));
  };

  return {
    comment,
    loading,
    error,
    create,
    update,
    remove,
    updateLikeCount,
    reload: loadComment
  };
};
