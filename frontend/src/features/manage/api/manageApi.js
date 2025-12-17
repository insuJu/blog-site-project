import client from '../../../api/client';

export const deleteTags = async (ids) => {
  const response = await client.delete('/tags', { data: ids });
  return response.data;
};

export const deleteCategories = async (ids) => {
  const response = await client.delete('/categories', { data: ids });
  return response.data;
};

export const deletePosts = async (ids) => {
  const response = await client.delete('/posts', { data: ids });
  return response.data;
};

export const deleteComments = async (postId, ids) => {
  const response = await client.delete(`/posts/${postId}/comments`, { data: ids });
  return response.data;
};

export const getMyComments = async () => {
  const response = await client.get('/comments/me');
  return response.data.data;
};

export const getMyPostLikes = async () => {
  const response = await client.get('/posts/likes/me');
  return response.data.data;
};

export const getMyCommentLikes = async () => {
  const response = await client.get('/comments/likes/me');
  return response.data.data;
};
