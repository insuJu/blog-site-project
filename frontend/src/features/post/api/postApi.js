import client from '../../../api/client';

export const createPost = async (postData) => {
  const response = await client.post('/posts', postData);
  return response.data.data;
};

export const getAllPosts = async (params = {}) => {
  const response = await client.get('/posts', { params });
  return response.data.data;
};

export const getPostById = async (id) => {
  const response = await client.get(`/posts/${id}`);
  return response.data.data;
};

export const getPostsByAuthor = async (authorId, params = {}) => {
  const response = await client.get(`/posts/author/${authorId}`, { params });
  return response.data.data;
};

export const getPostsByCategory = async (categoryId, params = {}) => {
  const response = await client.get(`/posts/category/${categoryId}`, { params });
  return response.data.data;
};

export const getPostsByTag = async (tagName, params = {}) => {
  const response = await client.get(`/posts/tag/${tagName}`, { params });
  return response.data.data;
};

export const searchPosts = async (keyword, params = {}) => {
  const response = await client.get('/posts/search', {
    params: { keyword, ...params }
  });
  return response.data.data;
};

export const searchPostsByAuthor = async (authorId, keyword, params = {}) => {
  const response = await client.get(`/posts/author/${authorId}/search`, {
    params: { keyword, ...params }
  });
  return response.data.data;
};

export const updatePost = async (id, postData) => {
  const response = await client.put(`/posts/${id}`, postData);
  return response.data.data;
};

export const deletePost = async (id) => {
  await client.delete(`/posts/${id}`);
};
