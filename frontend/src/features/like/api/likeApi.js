import client from '../../../api/client';

export const togglePostLike = async (postId) => {
  const response = await client.post(`/posts/${postId}/like`);
  return response.data.data;
};

export const isPostLiked = async (postId) => {
  const response = await client.get(`/posts/${postId}/like`);
  return response.data.data;
};

export const toggleCommentLike = async (commentId) => {
  const response = await client.post(`/comments/${commentId}/like`);
  return response.data.data;
};

export const isCommentLiked = async (commentId) => {
  const response = await client.get(`/comments/${commentId}/like`);
  return response.data.data;
};
