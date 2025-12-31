import styles from "./AccountSettingsForm.module.css";

const AccountSettingsForm = ({
  formData,
  editMode,
  errors,
  passwordStep,
  currentLoginMethod,
  isLinkedAccount,
  handleChange,
  handleEdit,
  handleCancel,
  handleSaveEmail,
  handlePasswordNext,
  handleSavePassword,
  handleUnlinkOAuth2,
}) => {
  const isOAuth2 = currentLoginMethod === 'OAUTH2';

  return (
    <section className={styles["setting-section"]}>

      <div className={styles["form-group"]}>
        <label>이메일</label>
        {!editMode.email ? (
          <div className={styles["input-button-wrapper"]}>
            <input
              type="email"
              value={formData.email}
              disabled
            />
            {!isOAuth2 && (
              <button
                onClick={() => handleEdit("email")}
                className={styles["edit-button"]}
                type="button"
              >
                수정
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles["input-button-wrapper"]}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="새 이메일 주소를 입력하세요"
              />
            </div>
            {errors.newEmail && (
              <span className={styles.error}>{errors.newEmail}</span>
            )}
            <div className={styles["input-button-wrapper"]}>
              <input
                type="password"
                name="emailCurrentPassword"
                value={formData.emailCurrentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호를 입력하세요"
              />
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
            </div>
            {errors.emailCurrentPassword && (
              <span className={styles.error}>{errors.emailCurrentPassword}</span>
            )}
            {errors.currentPassword && (
              <span className={styles.error}>{errors.currentPassword}</span>
            )}
          </>
        )}
      </div>

      {isLinkedAccount && (
        <div className={styles["form-group"]}>
          <label>소셜 로그인 연동</label>
          <div className={styles["linked-account-info"]}>
            <p>이 계정은 소셜 로그인과 연동되어 있습니다.</p>
            <button
              onClick={handleUnlinkOAuth2}
              className={styles["unlink-button"]}
              type="button"
            >
              연동 해제
            </button>
          </div>
        </div>
      )}

      {!isOAuth2 && (
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
      )}
    </section>
  );
};

export default AccountSettingsForm;
