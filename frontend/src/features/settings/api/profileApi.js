import client from '../../../api/client';

export const getProfile = () => client.get('/profiles/me');

export const updateNickname = (data) => client.put('/profiles/me/nickname', data);

export const updateBlogName = (data) => client.put('/profiles/me/blog-name', data);

export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client.put('/profiles/me/avatar', formData);
};

