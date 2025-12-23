import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../../../contexts/AuthContext";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import { useAccountSettings } from "../../hooks/useAccountSettings";
import { useAccountDeactivation } from "../../hooks/useAccountDeactivation";
import ProfileSettingsForm from "../../components/ProfileSettingsForm/ProfileSettingsForm";
import AccountSettingsForm from "../../components/AccountSettingsForm/AccountSettingsForm";
import AccountDeactivationSection from "../../components/AccountDeactivationSection/AccountDeactivationSection";
import AccountDeactivationModal from "../../components/AccountDeactivationModal/AccountDeactivationModal";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const { user, loading } = useAuth();

  const profileSettings = useProfileSettings();
  const accountSettings = useAccountSettings();
  const accountDeactivation = useAccountDeactivation();

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
          avatarUrl={user?.profile?.avatar}
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
          handleAvatarUpload={profileSettings.handleAvatarUpload}
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

        <AccountDeactivationSection onOpenModal={accountDeactivation.openModal} />

        <AccountDeactivationModal
          isOpen={accountDeactivation.isModalOpen}
          currentStep={accountDeactivation.currentStep}
          formData={accountDeactivation.formData}
          handleChange={accountDeactivation.handleChange}
          isLoading={accountDeactivation.isLoading}
          errors={accountDeactivation.errors}
          onRequestDeactivation={accountDeactivation.requestDeactivation}
          onVerifyDeactivation={accountDeactivation.verifyDeactivation}
          onResendCode={accountDeactivation.resendDeactivationCode}
          onBackToStep1={accountDeactivation.backToStep1}
          onClose={accountDeactivation.closeModal}
          successMessage={accountDeactivation.successMessage}
          resendTimer={accountDeactivation.resendTimer}
          isResending={accountDeactivation.isResending}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
