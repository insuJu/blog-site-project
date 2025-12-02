import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const login = async () => {
    setIsLoading(true);
    setErrors({
      username: '',
      password: ''
    });

    try {
      await authLogin(formData);
      navigate('/');
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Non-field error occurred:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFormData({ username: '', password: '' });
    setErrors({
      username: '',
      password: ''
    });
  };

  return { login, isLoading, errors, formData, handleChange, reset };
};
