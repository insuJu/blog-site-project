import { useState, useEffect, useRef } from 'react';
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
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const findUsername = async () => {
    if (resendTimer > 0) return false;

    setIsLoading(true);
    setIsResending(true);
    setErrors({ email: '' });
    setSuccessMessage('');

    try {
      await authApi.findUsername(formData.email);
      setSuccessMessage('이메일로 아이디가 전송되었습니다.');
      setResendTimer(60);
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
      setIsResending(false);
    }
  };

  const reset = () => {
    setFormData({ email: '' });
    setErrors({ email: '' });
    setSuccessMessage('');
    setResendTimer(0);
    setIsResending(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return {
    findUsername,
    isLoading,
    errors,
    formData,
    handleChange,
    reset,
    successMessage,
    resendTimer,
    isResending
  };
};
