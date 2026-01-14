import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  createCategory,
  getAllCategories,
} from "../../category/api/categoryApi";
import { usePosts } from "../../post/hooks/usePosts";
import { deleteCategories } from "../api/manageApi";

export const useCategoryManage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", parentId: null });
  const { posts: postsData } = usePosts({ type: "author", authorId: user.id });

  const allPosts = postsData?.content || postsData || [];

  const getAllDescendantIds = useCallback((category) => {
    const ids = [category.id];
    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        ids.push(...getAllDescendantIds(child));
      });
    }
    return ids;
  }, []);

  const addPostCountToCategories = useCallback(
    (cats, allPostsArray) => {
      return cats.map((cat) => {
        const descendantIds = getAllDescendantIds(cat);
        const count = allPostsArray.filter(
          (post) =>
            post.category?.id && descendantIds.includes(post.category.id)
        ).length;

        const categoryWithCount = {
          ...cat,
          postCount: count,
        };

        if (cat.children && cat.children.length > 0) {
          categoryWithCount.children = addPostCountToCategories(
            cat.children,
            allPostsArray
          );
        }

        return categoryWithCount;
      });
    },
    [getAllDescendantIds]
  );

  const loadCategories = useCallback(async () => {

    try {
      setLoading(true);
      const data = await getAllCategories();

      const categoriesWithCount = addPostCountToCategories(data, allPosts);

      const uncategorizedCount = allPosts.filter(
        (post) => !post.category?.id
      ).length;

      if (uncategorizedCount > 0) {
        categoriesWithCount.push({
          id: "uncategorized",
          name: "미분류",
          postCount: uncategorizedCount,
          children: [],
        });
      }

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error("Failed to load categories:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [allPosts, addPostCountToCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = useCallback(async () => {
    if (!formData.name.trim()) {
      throw new Error("카테고리 이름을 입력해주세요.");
    }

    try {
      await createCategory(formData);
      setFormData({ name: "", parentId: null });
      await loadCategories();
    } catch (error) {
      throw error;
    }
  }, [formData, loadCategories]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error("삭제할 카테고리를 선택해주세요.");
    }

    try {
      await deleteCategories(selectedIds);
      setSelectedIds([]);
      await loadCategories();
    } catch (error) {
      throw error;
    }
  }, [selectedIds, loadCategories]);

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIds = [];
        const collectIds = (cats) => {
          cats.forEach((cat) => {
            allIds.push(cat.id);
            if (cat.children && cat.children.length > 0) {
              collectIds(cat.children);
            }
          });
        };
        collectIds(categories);
        setSelectedIds(allIds);
      } else {
        setSelectedIds([]);
      }
    },
    [categories]
  );

  const handleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  const handleDeleteBulk = useCallback(
    async (ids) => {
      try {
        await deleteCategories(ids);
        await loadCategories();
      } catch (error) {
        throw error;
      }
    },
    [loadCategories]
  );

  return {
    categories,
    selectedIds,
    loading,
    formData,
    setFormData,
    handleCreate,
    handleDelete,
    handleDeleteBulk,
    handleSelectAll,
    handleSelect,
  };
};
