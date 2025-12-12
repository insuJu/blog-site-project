import { useState } from "react";
import { updateNickname, updateBlogName, updateAvatar } from "../api/profileApi";
import { useAuth } from "../../../contexts/AuthContext";

export const useProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState({
    nickname: false,
    blogName: false,
  });

  const [formData, setFormData] = useState({
    nickname: "",
    blogName: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const setUserProfile = (nickname, blogName) => {
    setFormData({ nickname, blogName });
  };

  const handleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
    setErrors({});
    setSuccessMessage("");
  };

  const handleCancel = (field, originalData) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setFormData((prev) => ({ ...prev, [field]: originalData[field] }));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveNickname = async () => {
    setErrors({});
    setSuccessMessage("");

    try {
      await updateNickname({ newNickname: formData.nickname });
      updateUser({
        ...user,
        profile: { ...user.profile, nickname: formData.nickname },
      });
      setEditMode((prev) => ({ ...prev, nickname: false }));
      setSuccessMessage("닉네임이 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || "닉네임 변경에 실패했습니다.",
        });
      }
    }
  };

  const handleSaveBlogName = async () => {
    setErrors({});
    setSuccessMessage("");

    try {
      await updateBlogName({ newBlogName: formData.blogName });
      updateUser({
        ...user,
        profile: { ...user.profile, blogName: formData.blogName },
      });
      setEditMode((prev) => ({ ...prev, blogName: false }));
      setSuccessMessage("블로그명이 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general:
            error.response?.data?.message || "블로그명 변경에 실패했습니다.",
        });
      }
    }
  };

  const handleAvatarUpload = async (file) => {
    setErrors({});
    setSuccessMessage("");

    try {
      await updateAvatar(file);
      updateUser({
        ...user,
        profile: { ...user.profile, avatar: URL.createObjectURL(file) },
      });
      setSuccessMessage("프로필 이미지가 성공적으로 변경되었습니다.");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general:
            error.response?.data?.message || "이미지 업로드에 실패했습니다.",
        });
      }
    }
  };

  return {
    editMode,
    formData,
    errors,
    successMessage,
    setUserProfile,
    handleEdit,
    handleCancel,
    handleChange,
    handleSaveNickname,
    handleSaveBlogName,
    handleAvatarUpload,
  };
};
