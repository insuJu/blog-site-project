import { useState, useEffect, useCallback } from 'react';
import { getMyComments, getReceivedComments, deleteComments } from '../api/manageApi';

export const useCommentManage = () => {
  const [comments, setComments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' or 'received'

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = activeTab === 'mine' 
        ? await getMyComments() 
        : await getReceivedComments();
      setComments(data || []);
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSelect = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? comments.map((c) => c.id) : []);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    // 댓글은 postId별로 그룹화해서 삭제해야 함
    const commentsByPost = {};
    selectedIds.forEach((id) => {
      const comment = comments.find((c) => c.id === id);
      if (comment) {
        if (!commentsByPost[comment.postId]) {
          commentsByPost[comment.postId] = [];
        }
        commentsByPost[comment.postId].push(id);
      }
    });

    // 각 postId별로 삭제 요청
    for (const [postId, ids] of Object.entries(commentsByPost)) {
      await deleteComments(Number(postId), ids);
    }

    await loadComments();
  };

  return {
    comments,
    selectedIds,
    loading,
    activeTab,
    setActiveTab,
    handleSelect,
    handleSelectAll,
    handleDelete,
    reload: loadComments
  };
};
