import { FiCheckCircle } from "react-icons/fi";
import { useFindUsername } from "../../hooks/useFindUsername";
import styles from "./FindUsernameForm.module.css";

const FindUsernameForm = () => {
  const {
    findUsername,
    isLoading,
    errors,
    formData,
    handleChange,
    successMessage,
  } = useFindUsername();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await findUsername();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["find-username-form"]}
      noValidate
    >
      <div className={styles.header}>
        <h1>아이디 찾기</h1>
        <p className={styles.subtitle}>가입하신 이메일 주소를 입력해주세요</p>
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

      {successMessage && (
        <div className={styles["success-message"]}>
          <FiCheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <button
        type="submit"
        className={styles["submit-button"]}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            아이디 찾는 중...
          </>
        ) : (
          "아이디 찾기"
        )}
      </button>
    </form>
  );
};

export default FindUsernameForm;
