import { FiX } from "react-icons/fi";
import styles from "./OAuth2AccountDeactivationModal.module.css";

const OAuth2AccountDeactivationModal = ({
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} disabled={isLoading}>
          <FiX size={24} />
        </button>
        <div className={styles.content}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.header}>
              <h2 className={styles.title}>회원 탈퇴</h2>
              <p className={styles.subtitle}>
                정말로 탈퇴하시겠습니까?
              </p>
            </div>

            <div className={styles.warningMessage}>
              <p>
                <strong>주의:</strong> SNS 계정은 즉시 삭제되며 복구할 수 없습니다.
              </p>
              <p className={styles.warningDetail}>
                게시글 및 댓글과 같은 활동 기록은 유지됩니다.
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.deleteButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    탈퇴 처리 중...
                  </>
                ) : (
                  '탈퇴하기'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OAuth2AccountDeactivationModal;
