import client from '../../../api/client';

export const createTag = async (tagData) => {
  const response = await client.post('/tags', tagData);
  return response.data.data;
};

export const getAllTags = async () => {
  const response = await client.get('/tags');
  return response.data.data;
};

export const searchTags = async (keyword) => {
  const response = await client.get('/tags/search', {
    params: { keyword }
  });
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
