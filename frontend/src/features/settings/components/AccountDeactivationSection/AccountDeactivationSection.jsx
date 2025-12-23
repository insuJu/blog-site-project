import { useState } from "react";
import { CgDanger } from "react-icons/cg";
import styles from "./AccountDeactivationSection.module.css";

const AccountDeactivationSection = ({ onOpenModal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={styles["danger-zone"]}>
      <div className={styles["danger-zone-header"]}>
        <CgDanger className={styles["warning-icon"]} />
        <h2>위험 구역</h2>
      </div>

      <div className={styles.accordion}>
        <button
          onClick={toggleAccordion}
          className={styles["accordion-header"]}
          type="button"
        >
          <span className={styles["accordion-icon"]}>
            {isExpanded ? "▼" : "▶"}
          </span>
          <div className={styles["accordion-title"]}>
            <h3>회원 탈퇴</h3>
            <p className={styles["accordion-subtitle"]}>
              비활성화 기간이 지난 후에는 복구할 수 없습니다.
            </p>
          </div>
        </button>

        {isExpanded && (
          <div className={styles["accordion-content"]}>
            <div className={styles["warning-box"]}>
              <h4>탈퇴 전 확인해주세요</h4>
              <ul>
                <li>
                  작성하신 게시글과 댓글은 "탈퇴한 사용자"로 표시되어
                  남아있습니다.
                </li>
                <li>
                  탈퇴 후 7일 이내에는 같은 계정으로 재가입하여 복구할 수
                  있습니다.
                </li>
                <li>
                  7일이 지나면 게시글 댓글과 같은 활동은 유지되며 계정은 복구가
                  불가능합니다.
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenModal}
              className={styles["deactivation-button"]}
            >
              회원 탈퇴
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountDeactivationSection;
