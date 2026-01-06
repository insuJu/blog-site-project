import { useState, useEffect, useRef } from 'react';
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
      setResendTimer(60);
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

  const resendPasswordResetCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setErrors({
      username: '',
      email: '',
      verificationCode: ''
    });
    setSuccessMessage('');

    try {
      await authApi.requestPasswordReset({
        username: formData.username,
        email: formData.email
      });
      setSuccessMessage('인증코드가 재전송되었습니다.');
      setResendTimer(60);
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Resend password reset code failed:', err.response?.data?.message || err.message || 'Unknown error');
        setErrors({ verificationCode: '인증코드 재전송에 실패했습니다. 다시 시도해주세요.' });
      }
      return false;
    } finally {
      setIsResending(false);
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
    setResendTimer(0);
    setIsResending(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
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
    resendPasswordResetCode,
    reset,
    isComplete,
    successMessage,
    resendTimer,
    isResending
  };
};
