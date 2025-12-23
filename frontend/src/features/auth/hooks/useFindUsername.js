import { useState } from 'react';
import * as authApi from '../api/authApi';

export const useFindUsername = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const findUsername = async () => {
    setIsLoading(true);
    setErrors({ email: '' });
    setSuccessMessage('');

    try {
      await authApi.findUsername(formData.email);
      setSuccessMessage('이메일로 아이디가 전송되었습니다.');
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Find username failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFormData({ email: '' });
    setErrors({ email: '' });
    setSuccessMessage('');
  };

  return {
    findUsername,
    isLoading,
    errors,
    formData,
    handleChange,
    reset,
    successMessage
  };
};
