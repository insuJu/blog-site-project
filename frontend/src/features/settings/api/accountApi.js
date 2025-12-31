import client from '../../../api/client';

export const getUserInfo = (userId) => client.get(`/users/${userId}`);

export const updateEmail = (data) => client.put('/users/me/email', data);

export const updatePassword = (data) => client.put('/users/me/password', data);

export const requestAccountDeactivation = (password) =>
  client.post('/users/me/deactivation/request', { password });

export const verifyAccountDeactivation = (data) =>
  client.post('/users/me/deactivation/verify', data);

export const reactivateAccount = (data) =>
  client.post('/users/me/reactivate', data);

export const unlinkOAuth2 = () =>
  client.post('/users/me/oauth2/unlink');

export const mergeAccounts = (data) =>
  client.post('/users/me/merge', data);
