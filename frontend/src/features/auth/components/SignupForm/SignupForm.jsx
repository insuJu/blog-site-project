import { useSignup } from '../../hooks/useSignup';
import LocalWithOAuth2MergeModal from '../LocalWithOAuth2MergeModal/LocalWithOAuth2MergeModal';
import { FiCheckCircle } from "react-icons/fi";
import styles from './SignupForm.module.css';

const SignupForm = ({ onSuccess }) => {
  const {
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
    closeSnsAccountModal,
    successMessage,
    resendTimer
  } = useSignup();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    await sendVerificationCode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup();

    if (result === 'showModal') {
      return;
    }

    if (result && onSuccess) {
      onSuccess();
    }
  };

  const handleMergeConfirm = async () => {
    const success = await mergeAndSignup();
    if (success) {
      closeSnsAccountModal();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <>
      <LocalWithOAuth2MergeModal
        isOpen={showMergeModal}
        email={formData.email}
        username={formData.username}
        nickname={formData.nickname}
        isLoading={isLoading}
        onConfirm={handleMergeConfirm}
        onCancel={closeSnsAccountModal}
      />
      <form onSubmit={handleSubmit} className={styles['signup-form']} noValidate>
      <div className={styles.header}>
        <p className={styles.subtitle}>새로운 Writon 여정을 시작하세요</p>
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
        <div className={styles['input-with-button']}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading || isVerificationSent}
          />
          <button
            type="button"
            className={styles['verification-button']}
            onClick={handleSendVerificationCode}
            disabled={isLoading || isVerificationLoading || isVerificationSent || !formData.email}
          >
            {isVerificationLoading ? '전송 중...' : isVerificationSent ? '전송 완료' : '인증코드 전송'}
          </button>
        </div>
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      {isVerificationSent && (
        <>
          {successMessage && (
            <div className={styles["success-message"]}>
              <FiCheckCircle size={20} />
              <p>{successMessage}</p>
            </div>
          )}

          <div className={styles['form-group']}>
            <label htmlFor="verificationCode">인증코드</label>
            <div className={styles['input-with-button']}>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                placeholder="이메일로 전송된 6자리 코드를 입력하세요"
                value={formData.verificationCode}
                onChange={handleChange}
                disabled={isLoading}
                maxLength="6"
              />
              <button
                type="button"
                className={styles['resend-button']}
                onClick={handleSendVerificationCode}
                disabled={isLoading || isVerificationLoading || resendTimer > 0}
              >
                {isVerificationLoading ? (
                  <>
                    <span className={styles["small-spinner"]}></span>
                    전송 중
                  </>
                ) : resendTimer > 0 ? (
                  `재전송 (${resendTimer}초)`
                ) : (
                  "재전송"
                )}
              </button>
            </div>
            {errors.verificationCode && <span className={styles.error}>{errors.verificationCode}</span>}
          </div>
        </>
      )}

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
    </>
  );
};

export default SignupForm;
