import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await authLogout();
      navigate('/');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};
