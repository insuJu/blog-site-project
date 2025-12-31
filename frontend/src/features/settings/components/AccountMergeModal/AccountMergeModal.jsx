import { FiX } from "react-icons/fi";
import styles from "./AccountMergeModal.module.css";

const AccountMergeModal = ({
  isOpen,
  targetEmail,
  formData,
  errors,
  isLoading,
  onMerge,
  onCancel,
  handleChange,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onMerge();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onCancel}>
          <FiX size={24} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>계정 병합</h2>
          <p className={styles.subtitle}>
            이 이메일로 이미 가입된 계정이 있습니다. 계정을 병합하시겠습니까?
          </p>

          <div className={styles.infoBox}>
            <p><strong>이메일:</strong> {targetEmail}</p>
            <p className={styles.description}>
              병합 후 이 계정으로 일반 로그인과 소셜 로그인을 모두 사용할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="password">기존 계정 비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="기존 계정의 비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.mergeButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    병합 중...
                  </>
                ) : (
                  "병합하기"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountMergeModal;
