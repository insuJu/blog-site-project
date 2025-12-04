import { useState, useCallback } from 'react';
import { togglePostLike, isPostLiked, toggleCommentLike, isCommentLiked } from '../api/likeApi';

export const useLike = (type, targetId = null) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkLiked = useCallback(async () => {
    if (!targetId) return;

    setLoading(true);
    try {
      const likedStatus = type === 'post'
        ? await isPostLiked(targetId)
        : await isCommentLiked(targetId);
      setLiked(likedStatus);
    } catch (err) {
      console.log('Not authenticated or failed to check like status');
      setLiked(false);
    } finally {
      setLoading(false);
    }
  }, [type, targetId]);

  const toggle = async (id = targetId) => {
    if (!id) return false;

    try {
      const newLikedStatus = type === 'post'
        ? await togglePostLike(id)
        : await toggleCommentLike(id);
      setLiked(newLikedStatus);
      return newLikedStatus;
    } catch (err) {
      console.error('Failed to toggle like:', err);
      return false;
    }
  };

  return {
    liked,
    loading,
    toggle,
    checkLiked
  };
};
