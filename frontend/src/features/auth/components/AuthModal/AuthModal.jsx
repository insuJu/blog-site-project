import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import LoginForm from '../LoginForm/LoginForm';
import SignupForm from '../SignupForm/SignupForm';
import FindUsernameForm from '../FindUsernameForm/FindUsernameForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.content}>
          {mode === 'login' && (
            <>
              <LoginForm onSuccess={onClose} />
              <div className={styles.links}>
                <button
                  onClick={() => setMode('find-username')}
                  className={styles.linkButton}
                >
                  아이디 찾기
                </button>
                <span className={styles.separator}>|</span>
                <button
                  onClick={() => setMode('reset-password')}
                  className={styles.linkButton}
                >
                  비밀번호 재설정
                </button>
              </div>
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
          )}

          {mode === 'signup' && (
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

          {mode === 'find-username' && (
            <>
              <FindUsernameForm/>
              <p className={styles.switchText}>
                <button
                  onClick={() => setMode('login')}
                  className={styles.switchButton}
                >
                  로그인으로 돌아가기
                </button>
              </p>
            </>
          )}

          {mode === 'reset-password' && (
            <>
              <ResetPasswordForm/>
              <p className={styles.switchText}>
                <button
                  onClick={() => setMode('login')}
                  className={styles.switchButton}
                >
                  로그인으로 돌아가기
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
