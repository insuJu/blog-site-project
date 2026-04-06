import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePosts } from '../../post/hooks/usePosts';
import { deletePosts } from '../api/manageApi';

export const usePostManage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    posts,
    loading,
    reload
  } = usePosts({
    type: 'author',
    authorId: user?.id,
    params: {
      page: currentPage - 1,
    }
  });

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error('삭제할 게시글을 선택해주세요.');
    }

    try {
      await deletePosts(selectedIds);
      setSelectedIds([]);
      await reload();
    } catch (error) {
      throw error;
    }
  }, [selectedIds, reload]);

  const handleSelectAll = useCallback((checked) => {
    const currentPosts = posts.content || [];
    if (checked) {
      setSelectedIds(currentPosts.map((post) => post.id));
    } else {
      setSelectedIds([]);
    }
  }, [posts]);

  const handleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  return {
    posts: posts.content || [],
    totalElements: posts.totalElements || 0,
    totalPages: posts.totalPages || 1,
    currentPage,
    selectedIds,
    loading,
    handleDelete,
    handleSelectAll,
    handleSelect,
    handlePageChange,
  };
};
