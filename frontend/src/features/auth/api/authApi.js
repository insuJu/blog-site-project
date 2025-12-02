import client from '../../../api/client';

export const authApi = {
  login: (credentials) =>
    client.post('/auth/login', credentials),

  signup: (userData) =>
    client.post('/users/signup', userData),

  logout: () =>
    client.post('/auth/logout'),

  getCurrentUser: () =>
    client.get('/users/me')
};
