import { useSignup } from '../../hooks/useSignup';
import styles from './SignupForm.module.css';

const SignupForm = ({ onSuccess }) => {
  const { signup, isLoading, errors, formData, handleChange } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['signup-form']} noValidate>
      <div className={styles.header}>
        <h1>환영합니다</h1>
        <p className={styles.subtitle}>새로운 쭈로그 여정을 시작하세요</p>
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          placeholder="사용하실 닉네임을 입력하세요"
          value={formData.nickname}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.nickname && <span className={styles.error}>{errors.nickname}</span>}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="로그인에 사용할 아이디를 입력하세요"
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
          placeholder="안전한 비밀번호를 입력하세요"
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
            처리 중...
          </>
        ) : (
          '회원가입'
        )}
      </button>
    </form>
  );
};

export default SignupForm;
