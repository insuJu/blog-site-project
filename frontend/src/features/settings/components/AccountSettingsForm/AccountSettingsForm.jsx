import styles from "./AccountSettingsForm.module.css";

const AccountSettingsForm = ({
  formData,
  editMode,
  errors,
  passwordStep,
  handleChange,
  handleEdit,
  handleCancel,
  handleSaveEmail,
  handlePasswordNext,
  handleSavePassword,
}) => {
  return (
    <section className={styles["setting-section"]}>
      <h2>계정</h2>

      <div className={styles["form-group"]}>
        <label>이메일</label>
        <div className={styles["input-button-wrapper"]}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editMode.email}
            placeholder="이메일 주소를 입력하세요"
          />
          {!editMode.email ? (
            <button
              onClick={() => handleEdit("email")}
              className={styles["edit-button"]}
              type="button"
            >
              수정
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveEmail}
                className={styles["save-button"]}
                type="button"
              >
                저장
              </button>
              <button
                onClick={() => handleCancel("email")}
                className={styles["cancel-button"]}
                type="button"
              >
                취소
              </button>
            </>
          )}
        </div>
        {errors.newEmail && (
          <span className={styles.error}>{errors.newEmail}</span>
        )}
      </div>

      <div className={styles["form-group"]}>
        <label>비밀번호</label>
        {!editMode.password ? (
          <div className={styles["input-button-wrapper"]}>
            <input type="password" value="••••••••" disabled />
            <button
              onClick={() => handleEdit("password")}
              className={styles["edit-button"]}
              type="button"
            >
              수정
            </button>
          </div>
        ) : (
          <div className={styles["password-change"]}>
            <div className={styles["input-button-wrapper"]}>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호"
              />
              {passwordStep === 1 && (
                <button
                  onClick={handlePasswordNext}
                  className={styles["next-button"]}
                  disabled={!formData.currentPassword}
                  type="button"
                >
                  다음
                </button>
              )}
            </div>
            {errors.currentPassword && (
              <span className={styles.error}>{errors.currentPassword}</span>
            )}

            {passwordStep >= 2 && (
              <>
                <div className={styles["input-button-wrapper"]}>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호"
                  />
                  {passwordStep === 2 && (
                    <button
                      onClick={handlePasswordNext}
                      className={styles["next-button"]}
                      disabled={!formData.newPassword}
                      type="button"
                    >
                      다음
                    </button>
                  )}
                </div>
                {errors.newPassword && (
                  <span className={styles.error}>{errors.newPassword}</span>
                )}
              </>
            )}

            {passwordStep === 3 && (
              <>
                <div className={styles["input-button-wrapper"]}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="새 비밀번호 확인"
                  />
                  <button
                    onClick={handleSavePassword}
                    className={styles["save-button"]}
                    type="button"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => handleCancel("password")}
                    className={styles["cancel-button"]}
                    type="button"
                  >
                    취소
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className={styles.error}>{errors.confirmPassword}</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountSettingsForm;
