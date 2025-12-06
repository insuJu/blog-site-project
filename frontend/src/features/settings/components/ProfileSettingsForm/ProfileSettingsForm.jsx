import styles from "./ProfileSettingsForm.module.css";

const ProfileSettingsForm = ({
  formData,
  editMode,
  errors,
  handleChange,
  handleEdit,
  handleCancel,
  handleSaveNickname,
  handleSaveBlogName,
}) => {
  return (
    <section className={styles["setting-section"]}>

      <div className={styles["form-group"]}>
        <label>닉네임</label>
        <div className={styles["input-button-wrapper"]}>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            disabled={!editMode.nickname}
            placeholder="2-8자 한글, 영문, 숫자"
            minLength={2}
            maxLength={8}
          />
          {!editMode.nickname ? (
            <button
              onClick={() => handleEdit("nickname")}
              className={styles["edit-button"]}
              type="button"
            >
              수정
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveNickname}
                className={styles["save-button"]}
                type="button"
              >
                저장
              </button>
              <button
                onClick={() => handleCancel("nickname")}
                className={styles["cancel-button"]}
                type="button"
              >
                취소
              </button>
            </>
          )}
        </div>
        {errors.newNickname && (
          <span className={styles.error}>{errors.newNickname}</span>
        )}
      </div>

      <div className={styles["form-group"]}>
        <label>블로그명</label>
        <div className={styles["input-button-wrapper"]}>
          <input
            type="text"
            name="blogName"
            value={formData.blogName}
            onChange={handleChange}
            disabled={!editMode.blogName}
            placeholder="2-30자"
            minLength={2}
            maxLength={30}
          />
          {!editMode.blogName ? (
            <button
              onClick={() => handleEdit("blogName")}
              className={styles["edit-button"]}
              type="button"
            >
              수정
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveBlogName}
                className={styles["save-button"]}
                type="button"
              >
                저장
              </button>
              <button
                onClick={() => handleCancel("blogName")}
                className={styles["cancel-button"]}
                type="button"
              >
                취소
              </button>
            </>
          )}
        </div>
        {errors.newBlogName && (
          <span className={styles.error}>{errors.newBlogName}</span>
        )}
      </div>
    </section>
  );
};

export default ProfileSettingsForm;
