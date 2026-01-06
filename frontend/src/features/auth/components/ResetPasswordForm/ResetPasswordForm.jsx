import { FiCheckCircle } from "react-icons/fi";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import styles from "./ResetPasswordForm.module.css";

const ResetPasswordForm = () => {
  const {
    currentStep,
    formData,
    handleChange,
    isLoading,
    errors,
    requestReset,
    verifyReset,
    resendPasswordResetCode,
    isComplete,
    successMessage,
    resendTimer,
    isResending,
  } = usePasswordReset();

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    await requestReset();
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    await verifyReset();
  };

  if (isComplete) {
    return (
      <div className={styles["reset-password-form"]}>
        <div className={styles.header}>
          <h1>비밀번호 재설정 완료</h1>
          <p className={styles.subtitle}>
            임시 비밀번호가 이메일로 전송되었습니다
          </p>
        </div>

        <div className={styles["success-message"]}>
          <p>
            이메일로 전송된 임시 비밀번호로 로그인 후<br />
            반드시 비밀번호를 변경해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <form
        onSubmit={handleStep1Submit}
        className={styles["reset-password-form"]}
        noValidate
      >
        <div className={styles.header}>
          <p className={styles.subtitle}>아이디와 이메일을 입력해주세요</p>
        </div>

        <div className={styles["step-indicator"]}>
          <div className={`${styles.step} ${styles.active}`}>1</div>
          <div className={styles["step-line"]}></div>
          <div className={styles.step}>2</div>
        </div>

        <div className={styles["form-group"]}>
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
          {errors.username && (
            <span className={styles.error}>{errors.username}</span>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <button
          type="submit"
          className={styles["submit-button"]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              인증코드 전송 중...
            </>
          ) : (
            "인증코드 받기"
          )}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleStep2Submit}
      className={styles["reset-password-form"]}
      noValidate
    >
      <div className={styles["step-indicator"]}>
        <div className={`${styles.step} ${styles.completed}`}>✓</div>
        <div className={`${styles["step-line"]} ${styles.completed}`}></div>
        <div className={`${styles.step} ${styles.active}`}>2</div>
      </div>

      {successMessage && (
        <div className={styles["success-message"]}>
          <FiCheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className={styles["form-group"]}>
        <label htmlFor="verificationCode">인증코드</label>
        <div className={styles["input-with-button"]}>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            placeholder="인증코드 6자리를 입력하세요"
            value={formData.verificationCode}
            onChange={handleChange}
            disabled={isLoading}
            maxLength={6}
          />
          <button
            type="button"
            onClick={resendPasswordResetCode}
            className={styles["resend-button"]}
            disabled={resendTimer > 0 || isResending || isLoading}
          >
            {isResending ? (
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
        {errors.verificationCode && (
          <span className={styles.error}>{errors.verificationCode}</span>
        )}
      </div>

      <div className={styles["warning-box"]}>
        <ul>
          <li>
            5분 이내에 이메일로 전송된 인증코드를 통해 인증을 완료해주세요.
          </li>
          <li>
            해당 이메일로 전송된 임시 비밀번호를 통해 로그인하여 반드시
            비밀번호를 변경해주세요.
          </li>
        </ul>
      </div>

      <button
        type="submit"
        className={styles["submit-button"]}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            인증 중...
          </>
        ) : (
          "인증 완료"
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
