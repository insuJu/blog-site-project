import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup as apiSignup, sendSignupVerificationCode as apiSendVerificationCode, mergeLocalWithOAuth2 } from '../api/authApi';

export const useSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
    verificationCode: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [isSnsAccountDetected, setIsSnsAccountDetected] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const timerRef = useRef(null);
  const [errors, setErrors] = useState({
    nickname: '',
    email: '',
    username: '',
    password: '',
    verificationCode: '',
    agreeToTerms: '',
    agreeToPrivacy: ''
  });

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sendVerificationCode = async () => {
    if (isVerificationLoading || !formData.email || resendTimer > 0) return false;

    setIsVerificationLoading(true);
    setErrors(prev => ({ ...prev, email: '', verificationCode: '' }));
    setSuccessMessage('');

    try {
      await apiSendVerificationCode(formData.email);
      setIsVerificationSent(true);
      setIsSnsAccountDetected(false);
      setSuccessMessage('이메일로 인증코드가 전송되었습니다.');
      setResendTimer(60);
      return true;
    } catch (err) {
      if (err.response?.data?.code === 'ACCOUNT014') {
        setIsSnsAccountDetected(true);
        setIsVerificationSent(true);
        setSuccessMessage('이메일로 인증코드가 전송되었습니다.');
        setResendTimer(60);
        return true;
      }

      if (err.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...err.response.data.errors }));
      } else if (err.response?.data?.message) {
        setErrors(prev => ({ ...prev, email: err.response.data.message }));
      } else {
        setErrors(prev => ({ ...prev, email: '인증코드 전송에 실패했습니다.' }));
      }
      return false;
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const signup = async () => {
    if (isLoading) return false;

    if (isSnsAccountDetected) {
      setShowMergeModal(true);
      return 'showModal';
    }

    setIsLoading(true);

    setErrors({
      nickname: '',
      email: '',
      username: '',
      password: '',
      verificationCode: '',
      agreeToTerms: '',
      agreeToPrivacy: ''
    });

    if (!formData.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: '이용약관에 동의해주세요.' }));
      setIsLoading(false);
      return false;
    }

    if (!formData.agreeToPrivacy) {
      setErrors(prev => ({ ...prev, agreeToPrivacy: '개인정보처리방침에 동의해주세요.' }));
      setIsLoading(false);
      return false;
    }

    try {
      const { agreeToTerms, agreeToPrivacy, ...signupData } = formData;
      await apiSignup(signupData);
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
    setFormData({ username: '', password: '', email: '', nickname: '', verificationCode: '', agreeToTerms: false, agreeToPrivacy: false });
    setErrors({
      nickname: '',
      email: '',
      username: '',
      password: '',
      verificationCode: '',
      agreeToTerms: '',
      agreeToPrivacy: ''
    });
    setIsVerificationSent(false);
    setSuccessMessage('');
    setResendTimer(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const closeSnsAccountModal = () => {
    setShowMergeModal(false);
  };

  const mergeAndSignup = async () => {
    if (isLoading) return false;

    setIsLoading(true);
    setErrors({
      nickname: '',
      email: '',
      username: '',
      password: '',
      verificationCode: '',
      agreeToTerms: '',
      agreeToPrivacy: ''
    });

    if (!formData.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: '이용약관에 동의해주세요.' }));
      setIsLoading(false);
      return false;
    }

    if (!formData.agreeToPrivacy) {
      setErrors(prev => ({ ...prev, agreeToPrivacy: '개인정보처리방침에 동의해주세요.' }));
      setIsLoading(false);
      return false;
    }

    try {
      await mergeLocalWithOAuth2({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
        verificationCode: formData.verificationCode
      });
      navigate('/');
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error('Merge failed:', err.response?.data?.message || err.message || 'Unknown error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    sendVerificationCode,
    mergeAndSignup,
    isLoading,
    isVerificationSent,
    isVerificationLoading,
    showMergeModal,
    errors,
    formData,
    handleChange,
    reset,
    closeSnsAccountModal,
    successMessage,
    resendTimer
  };
};
