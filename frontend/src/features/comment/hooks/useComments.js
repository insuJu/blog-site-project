import { useState, useEffect, useCallback } from 'react';
import { getCommentsByPostId } from '../api/commentApi';
import { isCommentLiked } from '../../like/api/likeApi';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const list = await getCommentsByPostId(postId);

      const mergeLiked = async (comments) => {
        return Promise.all(
          comments.map(async (c) => {
            let liked = false;
            try {
              liked = await isCommentLiked(c.id);
            } catch (e) {
              liked = false;
            }

            return {
              ...c,
              liked,
              children: c.children?.length
                ? await mergeLiked(c.children)
                : []
            };
          })
        );
      };

      const merged = await mergeLiked(list);
      setComments(merged);

    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    reload: loadComments
  };
};
