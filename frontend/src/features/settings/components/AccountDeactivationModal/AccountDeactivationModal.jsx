import { FiCheckCircle, FiX, FiArrowLeft } from "react-icons/fi";
import styles from "./AccountDeactivationModal.module.css";

const AccountDeactivationModal = ({
  isOpen,
  currentStep,
  formData,
  handleChange,
  isLoading,
  errors,
  onRequestDeactivation,
  onVerifyDeactivation,
  onResendCode,
  onBackToStep1,
  onClose,
  successMessage,
  resendTimer,
  isResending,
}) => {
  if (!isOpen) return null;

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    await onRequestDeactivation();
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    await onVerifyDeactivation();
  };

  return (
    <div className={styles.backdrop} >
      <div className={`${styles.modal} ${currentStep === 1 ? styles.modalStep1 : styles.modalStep2}`}>
        {currentStep === 2 && (
          <button className={styles.backButton} onClick={onBackToStep1} disabled={isLoading}>
            <FiArrowLeft size={24} />
          </button>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>
        <div className={styles.scrollArea}>
          <div className={styles.content}>
            {currentStep === 1 ? (
              <form onSubmit={handleStep1Submit} noValidate>
                <div className={styles.header}>
                  <p className={styles.subtitle}>
                    탈퇴를 진행하려면 비밀번호를 입력해주세요
                  </p>
                </div>

                <div className={styles["warning-message"]}>
                  <p>
                    <strong>주의:</strong> 탈퇴 후 7일 이내에 같은 계정으로
                    로그인하면 복구할 수 있습니다.
                  </p>
                </div>

                <div className={styles["form-group"]}>
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
                  {errors.password && (
                    <span className={styles.error}>{errors.password}</span>
                  )}
                </div>

                <div className={styles["button-group"]}>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles["button--submit"]}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
                        인증코드 전송 중...
                      </>
                    ) : (
                      '인증코드 받기'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit} noValidate>
                <div className={styles.header}>
                  <p className={styles.subtitle}>
                    5분 안에 이메일로 전송된 인증코드를 입력 후 탈퇴를 진행해주세요.
                  </p>
                </div>

                {successMessage && (
                  <div className={styles["success-message"]}>
                    <FiCheckCircle size={20} />
                    <p>{successMessage}</p>
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
                      onClick={onResendCode}
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
                    <span className={styles.error}>
                      {errors.verificationCode}
                    </span>
                  )}
                </div>

                <div className={styles["final-warning"]}>
                  <p>
                    <strong>최종 확인:</strong> 탈퇴를 완료하시겠습니까? 7일
                    후에는 복구가 불가능하며, 게시글 및 댓글과 같은 활동은
                    유지됩니다.
                  </p>
                </div>

                <div className={styles["button-group"]}>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles["button--danger"]}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
                        탈퇴 처리 중...
                      </>
                    ) : (
                      "탈퇴하기"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeactivationModal;
