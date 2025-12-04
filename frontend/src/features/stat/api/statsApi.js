import client from '../../../api/client';

export const getStats = async () => {
  const response = await client.get('/stats');
  return response.data.data;
};
