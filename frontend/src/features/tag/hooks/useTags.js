import { useState, useEffect } from 'react';
import { getAllTags } from '../api/tagApi';

export const useTags = (limit = 8) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllTags();
        setTags((data || []).slice(0, limit));
      } catch (err) {
        console.error('Failed to load tags:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  return { tags, loading, error };
};
