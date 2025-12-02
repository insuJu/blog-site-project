import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import LoginForm from '../LoginForm/LoginForm';
import SignupForm from '../SignupForm/SignupForm';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.content}>
          {mode === 'login' ? (
            <>
              <LoginForm onSuccess={onClose} />
              <p className={styles.switchText}>
                계정이 없으신가요?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className={styles.switchButton}
                >
                  회원가입
                </button>
              </p>
            </>
          ) : (
            <>
              <SignupForm onSuccess={onClose} />
              <p className={styles.switchText}>
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={() => setMode('login')}
                  className={styles.switchButton}
                >
                  로그인
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
