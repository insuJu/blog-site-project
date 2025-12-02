import client from '../../../api/client';

export const profileApi = {
  getProfile: () => client.get('/profiles/me'),

  updateNickname: (data) => client.put('/profiles/me/nickname', data),

  updateBlogName: (data) => client.put('/profiles/me/blog-name', data),
};
