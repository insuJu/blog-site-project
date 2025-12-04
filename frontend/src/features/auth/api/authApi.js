import client from '../../../api/client';

export const login = (credentials) =>
  client.post('/auth/login', credentials);

export const signup = (userData) =>
  client.post('/users/signup', userData);

export const logout = () =>
  client.post('/auth/logout');

export const getCurrentUser = () =>
  client.get('/users/me');
