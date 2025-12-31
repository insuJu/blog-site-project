import client from '../../../api/client';

export const login = (credentials) =>
  client.post('/auth/login', credentials);

export const sendSignupVerificationCode = (email) =>
  client.post('/users/signup/verification', { email });

export const signup = (userData) =>
  client.post('/users/signup', userData);

export const mergeLocalWithOAuth2 = (userData) =>
  client.post('/users/signup/merge-oauth2', userData);

export const logout = () =>
  client.post('/auth/logout');

export const getCurrentUser = () =>
  client.get('/users/me');

export const findUsername = (email) =>
  client.post('/users/find-username', { email });

export const requestPasswordReset = (data) =>
  client.post('/users/password-reset/request', data);

export const verifyPasswordReset = (data) =>
  client.post('/users/password-reset/verify', data);
