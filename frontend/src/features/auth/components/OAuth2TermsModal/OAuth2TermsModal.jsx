import { useState } from 'react';
import styles from './OAuth2TermsModal.module.css';

const OAuth2TermsModal = ({ isOpen, onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [errors, setErrors] = useState({
    agreeToTerms: '',
    agreeToPrivacy: ''
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleConfirm = () => {
    let hasError = false;
    const newErrors = { agreeToTerms: '', agreeToPrivacy: '' };

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '이용약관에 동의해주세요.';
      hasError = true;
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = '개인정보처리방침에 동의해주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>서비스 이용 약관 동의</h2>
        <p className={styles.description}>
          Writon 서비스를 이용하시려면 아래 약관에 동의해주세요.
        </p>

        <div className={styles['terms-group']}>
          <div className={styles['checkbox-item']}>
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
              <a href="/terms" target="_blank" rel="noopener noreferrer">이용약관</a>에 동의합니다 (필수)
            </label>
          </div>
          {errors.agreeToTerms && <span className={styles.error}>{errors.agreeToTerms}</span>}

          <div className={styles['checkbox-item']}>
            <input
              type="checkbox"
              id="agreeToPrivacy"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleChange}
            />
            <label htmlFor="agreeToPrivacy">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>에 동의합니다 (필수)
            </label>
          </div>
          {errors.agreeToPrivacy && <span className={styles.error}>{errors.agreeToPrivacy}</span>}
        </div>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles['cancel-button']}>
            취소
          </button>
          <button onClick={handleConfirm} className={styles['confirm-button']}>
            동의하고 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuth2TermsModal;
