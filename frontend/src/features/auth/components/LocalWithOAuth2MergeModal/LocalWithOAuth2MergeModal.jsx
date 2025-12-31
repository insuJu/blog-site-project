import { FiX } from "react-icons/fi";
import styles from "./LocalWithOAuth2MergeModal.module.css";

const LocalWithOAuth2MergeModal = ({
  isOpen,
  email,
  username,
  nickname,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onCancel} disabled={isLoading}>
          <FiX size={24} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>SNS 계정에 일반 로그인 추가</h2>
          <p className={styles.subtitle}>
            이 이메일로 이미 SNS 계정이 있습니다. 입력하신 정보로 일반 로그인을 추가하시겠습니까?
          </p>

          <div className={styles.infoBox}>
            <p><strong>이메일:</strong> {email}</p>
            <p><strong>아이디:</strong> {username}</p>
            <p><strong>닉네임:</strong> {nickname}</p>
            <p className={styles.description}>
              확인을 누르면 SNS 로그인과 일반 로그인 모두 사용할 수 있습니다.
            </p>
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
              type="button"
              onClick={onConfirm}
              className={styles.mergeButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  추가 중...
                </>
              ) : (
                "확인"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalWithOAuth2MergeModal;
