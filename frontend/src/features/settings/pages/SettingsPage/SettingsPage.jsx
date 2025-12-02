import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import { useAccountSettings } from "../../hooks/useAccountSettings";
import ProfileSettingsForm from "../../components/ProfileSettingsForm/ProfileSettingsForm";
import AccountSettingsForm from "../../components/AccountSettingsForm/AccountSettingsForm";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const { user, loading } = useAuth();

  const profileSettings = useProfileSettings();
  const accountSettings = useAccountSettings();

  useEffect(() => {
    if (!loading && user) {
      profileSettings.setUserProfile(
        user.profile?.nickname || "",
        user.profile?.blogName || ""
      );
      accountSettings.setUserEmail(user.email || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const successMessage =
    profileSettings.successMessage || accountSettings.successMessage;

  const generalError =
    profileSettings.errors.general || accountSettings.errors.general;

  return (
    <div className={styles["settings-page"]}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>설정</h1>
          <p className={styles.subtitle}>계정 및 프로필 정보를 관리하세요</p>
        </div>

        {successMessage && (
          <div className={styles["success-message"]}>
            <FiCheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {generalError && (
          <div className={styles["error-message"]}>
            <FiAlertCircle size={20} />
            <span>{generalError}</span>
          </div>
        )}

        <ProfileSettingsForm
          formData={profileSettings.formData}
          editMode={profileSettings.editMode}
          errors={profileSettings.errors}
          handleChange={profileSettings.handleChange}
          handleEdit={profileSettings.handleEdit}
          handleCancel={(field) =>
            profileSettings.handleCancel(field, {
              nickname: user?.profile?.nickname || "",
              blogName: user?.profile?.blogName || "",
            })
          }
          handleSaveNickname={profileSettings.handleSaveNickname}
          handleSaveBlogName={profileSettings.handleSaveBlogName}
        />

        <AccountSettingsForm
          formData={accountSettings.formData}
          editMode={accountSettings.editMode}
          errors={accountSettings.errors}
          passwordStep={accountSettings.passwordStep}
          handleChange={accountSettings.handleChange}
          handleEdit={accountSettings.handleEdit}
          handleCancel={(field) =>
            accountSettings.handleCancel(field, user?.email || "")
          }
          handleSaveEmail={accountSettings.handleSaveEmail}
          handlePasswordNext={accountSettings.handlePasswordNext}
          handleSavePassword={accountSettings.handleSavePassword}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
