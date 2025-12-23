import { useState } from 'react';
import * as authApi from '../api/authApi';

export const usePasswordReset = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    verificationCode: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const requestReset = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({
      username: '',
      email: '',
      verificationCode: ''
    });

    try {
      await authApi.requestPasswordReset({
        username: formData.username,
        email: formData.email
      });
      setSuccessMessage('이메일로 인증코드가 전송되었습니다.');
      setCurrentStep(2);
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Request password reset failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyReset = async () => {
    setIsLoading(true);
    setErrors({
      username: '',
      email: '',
      verificationCode: ''
    });

    try {
      await authApi.verifyPasswordReset({
        username: formData.username,
        verificationCode: formData.verificationCode,
      });
      setIsComplete(true);
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Verify password reset failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCurrentStep(1);
    setFormData({
      username: '',
      email: '',
      verificationCode: ''
    });
    setErrors({
      username: '',
      email: '',
      verificationCode: ''
    });
    setIsComplete(false);
    setSuccessMessage('');
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    handleChange,
    isLoading,
    errors,
    requestReset,
    verifyReset,
    reset,
    isComplete,
    successMessage
  };
};
