import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useLogin } from '../../hooks/useLogin';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSuccess }) => {
  const { login, isLoading, errors, formData, handleChange } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['login-form']} noValidate>
      <div className={styles.header}>
        <h1>Writon에 오신 것을 환영합니다</h1>
        <p className={styles.subtitle}>로그인을 하여 Writon를 이용하세요!</p>
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.username && <span className={styles.error}>{errors.username}</span>}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.password && <span className={styles.error}>{errors.password}</span>}
      </div>

      <button type="submit" className={styles['submit-button']} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            로그인 중...
          </>
        ) : (
          '로그인'
        )}
      </button>

      <div className={styles.divider}>
        <span>또는</span>
      </div>

      <div className={styles['social-login']}>
        <button
          type="button"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`}
          className={`${styles['social-button']} ${styles.github}`}
        >
          <FaGithub size={20} />
          GitHub로 로그인
        </button>

        <button
          type="button"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}
          className={`${styles['social-button']} ${styles.google}`}
        >
          <FcGoogle size={20} />
          Google로 로그인
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
