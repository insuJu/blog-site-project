import client from '../../../api/client';

export const getStats = async () => {
  const response = await client.get('/stats');
  return response.data.data;
};

export const getAuthorStats = async (authorId) => {
  const response = await client.get(`/stats/author/${authorId}`);
  return response.data.data;
};
