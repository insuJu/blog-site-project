import { useState, useEffect } from 'react';
import { getAllTags } from '../api/tagApi';

export const useTags = (accountId = null, limit = 8) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllTags(accountId);
        setTags((data || []).slice(0, limit));
      } catch (err) {
        console.error('Failed to load tags:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountId, limit]);

  return { tags, loading, error };
};
