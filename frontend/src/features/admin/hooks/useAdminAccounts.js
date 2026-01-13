import { useState, useCallback } from 'react';
import { getAllAccounts, deleteAccount } from '../api/adminApi';

export const useAdminAccounts = () => {
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAccounts = useCallback(async (page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAccounts({ page, size });
      setAccounts(data);
    } catch (err) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAccount = useCallback(async (accountId) => {
    try {
      await deleteAccount(accountId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete account' };
    }
  }, []);

  return { accounts, loading, error, loadAccounts, removeAccount };
};
