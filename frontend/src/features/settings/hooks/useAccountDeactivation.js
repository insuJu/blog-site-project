import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import * as accountApi from '../api/accountApi';

export const useAccountDeactivation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    password: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    verificationCode: ''
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

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setFormData({ password: '', verificationCode: '' });
    setErrors({ password: '', verificationCode: '' });
    setSuccessMessage('');
    setResendTimer(0);
    setIsResending(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setFormData({ password: '', verificationCode: '' });
    setErrors({ password: '', verificationCode: '' });
    setSuccessMessage('');
    setResendTimer(0);
    setIsResending(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const backToStep1 = () => {
    setCurrentStep(1);
    setFormData(prev => ({ ...prev, verificationCode: '' }));
    setErrors({ password: '', verificationCode: '' });
    setSuccessMessage('');
    setResendTimer(0);
    setIsResending(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const requestDeactivation = async () => {
    setIsLoading(true);
    setErrors({ password: '', verificationCode: '' });
    setSuccessMessage('');

    try {
      await accountApi.requestAccountDeactivation(formData.password);
      setSuccessMessage('이메일로 인증코드가 전송되었습니다.');
      setCurrentStep(2);
      setResendTimer(30);
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Request account deactivation failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendDeactivationCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setErrors({ password: '', verificationCode: '' });
    setSuccessMessage('');

    try {
      await accountApi.requestAccountDeactivation(formData.password);
      setSuccessMessage('인증코드가 재전송되었습니다.');
      setResendTimer(30);
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Resend deactivation code failed:', err.response?.data?.message || err.message || 'Unknown error');
        setErrors({ verificationCode: '인증코드 재전송에 실패했습니다. 다시 시도해주세요.' });
      }
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const verifyDeactivation = async () => {
    setIsLoading(true);
    setErrors({ password: '', verificationCode: '' });

    try {
      await accountApi.verifyAccountDeactivation({
        verificationCode: formData.verificationCode
      });

      await logout();
      closeModal();
      navigate('/');
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Verify account deactivation failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    currentStep,
    formData,
    handleChange,
    isLoading,
    errors,
    openModal,
    closeModal,
    backToStep1,
    requestDeactivation,
    verifyDeactivation,
    resendDeactivationCode,
    successMessage,
    resendTimer,
    isResending
  };
};
