import { useState, useEffect } from 'react';
import { getMyPostLikes, getMyCommentLikes } from '../api/manageApi';

export const useLikeManage = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const [postLikes, commentLikes] = await Promise.all([
        getMyPostLikes(),
        getMyCommentLikes(),
      ]);

      const allLikes = [...(postLikes || []), ...(commentLikes || [])];
      allLikes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLikes(allLikes);
    } catch (error) {
      console.error('Failed to load likes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLikes();
  }, []);

  return {
    likes,
    loading,
  };
};
