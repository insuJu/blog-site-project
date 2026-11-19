import { useRef, useState } from "react";
import { useCategories } from "../../../category/hooks/useCategories";
import { uploadPostImage } from "../../api/postApi";
import PostBodyModeSwitcher from "./next/PostBodyModeSwitcher";
import styles from "./PostEditor.module.css";

const PostEditor = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags || "",
    isPublic: initialData?.isPublic ?? true,
  });
  const [currentTagInput, setCurrentTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const bodyEditor = useRef(null);
  const pendingImages = useRef(new Map());
  const submitting = useRef(false);
  const isBusy = isSubmitting || isPreparingImage;
  const { categories } = useCategories();

  const flattenForSelect = (cats, depth = 0, out = []) => {
    (cats || []).forEach((c) => {
      out.push({ id: c.id, name: c.name, depth });
      if (c.children && c.children.length > 0)
        flattenForSelect(c.children, depth + 1, out);
    });
    return out;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "tags") {
      setCurrentTagInput(newValue);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTagsKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      const cur = currentTagInput.trim();
      if (!cur) return;

      e.preventDefault();

      const hashMatch = cur.match(/#([^\s#,]+)/);
      if (hashMatch) {
        const tagName = hashMatch[1].trim();
        const currentTags = parseTags(formData.tags);

        if (!currentTags.includes(tagName)) {
          const newTags = [...currentTags, tagName];
          setFormData((prev) => ({
            ...prev,
            tags: newTags.map((t) => `#${t}`).join(" "),
          }));
        }
      }

      setCurrentTagInput("");
    }

    if (e.key === "Backspace" && currentTagInput === "") {
      e.preventDefault();
      const currentTags = parseTags(formData.tags);
      if (currentTags.length > 0) {
        const newTags = currentTags.slice(0, -1);
        setFormData((prev) => ({
          ...prev,
          tags: newTags.map((t) => `#${t}`).join(" "),
        }));
      }
    }
  };

  const parseTags = (tagsString) => {
    if (!tagsString) return [];

    const hashMatches = [...tagsString.matchAll(/#([^\s#,]+)/g)]
      .map((m) => m[1].trim())
      .filter(Boolean);
    if (hashMatches.length > 0) {
      return hashMatches;
    }

    return tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const removeTag = (tagToRemove) => {
    const currentTags = parseTags(formData.tags);
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
    setFormData((prev) => ({
      ...prev,
      tags: updatedTags.map((tag) => `#${tag}`).join(" "),
    }));
  };

  async function prepareImage(file) {
    if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 첨부할 수 있습니다.");

    setIsPreparingImage(true);
    try {
      const src = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reader.onabort = () => reject(new Error("이미지 파일을 읽지 못했습니다."));
        reader.readAsDataURL(file);
      });
      if (!pendingImages.current.has(src)) pendingImages.current.set(src, { file });
      return src;
    } finally {
      setIsPreparingImage(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting.current || isPreparingImage) return;

    // Markdown 모드에 머무르고 있어도 저장 시점의 초안을 읽는다.
    const result = bodyEditor.current?.readHtml();
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.length > 100) {
      newErrors.title = "제목은 100자를 초과할 수 없습니다.";
    }

    const body = document.createElement("template");
    if (!result?.ok) {
      newErrors.content = "현재 초안을 HTML로 변환할 수 없습니다. 본문을 확인해주세요.";
    } else {
      body.innerHTML = result.value;
      if (!body.content.textContent.trim() && !body.content.querySelector("img[src]")) {
        newErrors.content = "내용을 입력해주세요.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    submitting.current = true;
    setIsSubmitting(true);
    try {
      let content = result.value;
      const sources = new Set(Array.from(body.content.querySelectorAll("img[src]"), image => image.getAttribute("src")));
      for (const src of sources) {
        const image = pendingImages.current.get(src);
        if (!image) continue;

        try {
          // 이미지를 삭제한 경우 업로드하지 않고, 다시 저장할 때 성공한 업로드는 재사용한다.
          image.uploadedUrl ||= await uploadPostImage(image.file);
          if (!image.uploadedUrl) throw new Error();
          const url = image.uploadedUrl.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
          content = content.replaceAll(src, url);
        } catch {
          throw new Error("이미지 업로드에 실패했습니다.");
        }
      }
      await onSubmit({ ...formData, content });
    } catch (error) {
      setErrors({ submit: error.message || "글 저장에 실패했습니다." });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.editorForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className={`${styles.titleInput} ${errors.title ? styles.error : ""}`}
          disabled={isBusy}
        />
        {errors.title && (
          <span className={styles.errorMessage}>{errors.title}</span>
        )}
      </div>

      <div className={styles.metaRow}>
        <div className={styles.formGroup}>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={styles.categorySelect}
            disabled={isBusy}
          >
            <option value="">카테고리 선택</option>
            {flattenForSelect(categories).map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                style={{
                  paddingLeft: `${opt.depth * 16}px`,
                  fontWeight: opt.depth === 0 ? "600" : "400",
                  color: opt.depth === 0 ? "#212529" : "#6c757d",
                }}
              >
                {opt.depth > 0 ? "└ " : ""}
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.tagInputWrapper}>
            <div
              className={styles.tagInputContainer}
              onClick={() => document.querySelector('[name="tags"]').focus()}
            >
              {parseTags(formData.tags).map((tag, index) => (
                <div key={index} className={styles.tagChip}>
                  <span className={styles.tagChipText}>#{tag}</span>
                  <button
                    type="button"
                    className={styles.tagChipRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    disabled={isSubmitting}
                    aria-label={`${tag} 태그 제거`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                name="tags"
                value={currentTagInput}
                onChange={handleChange}
                onKeyDown={handleTagsKeyDown}
                placeholder={
                  parseTags(formData.tags).length === 0
                    ? "태그 (예: #React #JavaScript)"
                    : ""
                }
                className={styles.tagsInput}
                disabled={isBusy}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <PostBodyModeSwitcher
          ref={bodyEditor}
          initialHtml={initialData?.content || "<p></p>"}
          prepareImage={prepareImage}
          readOnly={isBusy}
          onDraftChange={() => setErrors(current => current.content ? { ...current, content: "" } : current)}
        />
        {errors.content && <span className={styles.errorMessage} role="alert">{errors.content}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className={styles.checkbox}
            disabled={isBusy}
          />
          <span>공개 설정</span>
        </label>
      </div>

      {errors.submit && (
        <div className={styles.submitError}>{errors.submit}</div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isBusy}
          onClick={() => window.history.back()}
        >
          취소
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isBusy}
        >
          {isSubmitting ? "저장 중..." : isEditing ? "수정" : "발행"}
        </button>
      </div>
    </form>
  );
};

export default PostEditor;
