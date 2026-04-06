import client from '../../../api/client';

export const createComment = async (postId, commentData) => {
  const response = await client.post(`/posts/${postId}/comments`, commentData);
  return response.data.data;
};

export const getCommentsByPostId = async (postId) => {
  const response = await client.get(`/posts/${postId}/comments`);
  return response.data.data;
};

export const getCommentById = async (postId, commentId) => {
  const response = await client.get(`/posts/${postId}/comments/${commentId}`);
  return response.data.data;
};

export const getCommentsByAuthorId = async (authorId) => {
  const response = await client.get(`/comments/author/${authorId}`);
  return response.data.data;
};

export const updateComment = async (postId, commentId, commentData) => {
  const response = await client.put(`/posts/${postId}/comments/${commentId}`, commentData);
  return response.data.data;
};

export const deleteComment = async (postId, commentId) => {
  await client.delete(`/posts/${postId}/comments/${commentId}`);
};
