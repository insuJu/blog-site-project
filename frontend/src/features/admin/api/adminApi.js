import client from '../../../api/client';

export const getStats = async () => {
  const response = await client.get('/admin/stats');
  return response.data.data;
};

export const getAllAccounts = async (params = {}) => {
  const response = await client.get('/admin/accounts', { params });
  return response.data.data;
};

export const deleteAccount = async (accountId) => {
  const response = await client.delete(`/admin/accounts/${accountId}`);
  return response.data;
};

export const getAllPosts = async (params = {}) => {
  const response = await client.get('/admin/posts', { params });
  return response.data.data;
};

export const deletePost = async (postId) => {
  const response = await client.delete(`/admin/posts/${postId}`);
  return response.data;
};

export const getAllComments = async (params = {}) => {
  const response = await client.get('/admin/comments', { params });
  return response.data.data;
};

export const deleteComment = async (commentId) => {
  const response = await client.delete(`/admin/comments/${commentId}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await client.get('/admin/categories');
  return response.data.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await client.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

export const getAllTags = async (params = {}) => {
  const response = await client.get('/admin/tags', { params });
  return response.data.data;
};

export const deleteTag = async (tagId) => {
  const response = await client.delete(`/admin/tags/${tagId}`);
  return response.data;
};

export const adminApi = {
  getStats,
  getAllAccounts,
  deleteAccount,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
  getAllCategories,
  deleteCategory,
  getAllTags,
  deleteTag,
};

export default adminApi;
