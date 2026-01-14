import { useState, useEffect, useCallback } from 'react';
import { getAllCategories } from '../api/categoryApi';

export const useCategories = (accountId = null) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories(accountId);
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, reloadCategories: loadCategories };
};
