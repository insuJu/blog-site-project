import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup as apiSignup } from '../api/authApi';

export const useSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nickname: '',
    email: '',
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

  const signup = async () => {
    if (isLoading) return false;

    setIsLoading(true);

    setErrors({
      nickname: '',
      email: '',
      username: '',
      password: ''
    });

    try {
      await apiSignup(formData);
      navigate('/');
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Signup failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally{
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFormData({ username: '', password: '', email: '', nickname: '' });
    setErrors({
      nickname: '',
      email: '',
      username: '',
      password: ''
    });
  };

  return { signup, isLoading, errors, formData, handleChange, reset };
};
