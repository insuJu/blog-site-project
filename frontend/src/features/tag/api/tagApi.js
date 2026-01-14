import client from '../../../api/client';

export const createTag = async (tagData) => {
  const response = await client.post('/tags', tagData);
  return response.data.data;
};

export const getAllTags = async (accountId = null) => {
  const params = accountId ? { accountId } : {};
  const response = await client.get('/tags', { params });
  return response.data.data;
};

export const searchTags = async (keyword, accountId = null) => {
  const params = { keyword };
  if (accountId) {
    params.accountId = accountId;
  }
  const response = await client.get('/tags/search', { params });
  return response.data.data;
};

export const getTagById = async (id) => {
  const response = await client.get(`/tags/${id}`);
  return response.data.data;
};

export const updateTag = async (id, tagData) => {
  const response = await client.put(`/tags/${id}`, tagData);
  return response.data.data;
};

export const deleteTag = async (id) => {
  await client.delete(`/tags/${id}`);
};
