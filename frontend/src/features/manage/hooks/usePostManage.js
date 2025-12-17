import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getPostsByAuthor } from '../../post/api/postApi';
import { deletePosts } from '../api/manageApi';

export const usePostManage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getPostsByAuthor(user.id, { size: 100 });
      setPosts(data.content || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error('삭제할 게시글을 선택해주세요.');
    }

    try {
      await deletePosts(selectedIds);
      setSelectedIds([]);
      await loadPosts();
    } catch (error) {
      throw error;
    }
  }, [selectedIds, loadPosts]);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedIds(posts.map((post) => post.id));
    } else {
      setSelectedIds([]);
    }
  }, [posts]);

  const handleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  return {
    posts,
    selectedIds,
    loading,
    handleDelete,
    handleSelectAll,
    handleSelect,
  };
};
