import { useState } from "react";
import { accountApi } from "../api/accountApi";
import { useAuth } from "../../../contexts/AuthContext";

export const useAccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState({
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordStep, setPasswordStep] = useState(1);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const setUserEmail = (email) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  const handleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
    setErrors({});
    setSuccessMessage("");

    if (field === "password") {
      setPasswordStep(1);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const handleCancel = (field, originalEmail) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setErrors({});

    if (field === "email") {
      setFormData((prev) => ({ ...prev, email: originalEmail }));
    }

    if (field === "password") {
      setPasswordStep(1);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveEmail = async () => {
    setErrors({});
    setSuccessMessage("");

    try {
      await accountApi.updateEmail({ newEmail: formData.email });
      updateUser({ ...user, email: formData.email });
      setEditMode((prev) => ({ ...prev, email: false }));
      setSuccessMessage("이메일이 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || "이메일 변경에 실패했습니다.",
        });
      }
    }
  };

  const handlePasswordNext = () => {
    if (passwordStep === 1 && formData.currentPassword) {
      setPasswordStep(2);
    } else if (passwordStep === 2 && formData.newPassword) {
      setPasswordStep(3);
    }
  };

  const handleSavePassword = async () => {
    setErrors({});
    setSuccessMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    try {
      await accountApi.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setEditMode((prev) => ({ ...prev, password: false }));
      setPasswordStep(1);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general:
            error.response?.data?.message || "비밀번호 변경에 실패했습니다.",
        });
      }
    }
  };

  return {
    user,
    editMode,
    formData,
    passwordStep,
    errors,
    successMessage,
    setUserEmail,
    handleEdit,
    handleCancel,
    handleChange,
    handleSaveEmail,
    handlePasswordNext,
    handleSavePassword,
  };
};
