import client from '../../../api/client';

export const getUserInfo = (userId) => client.get(`/users/${userId}`);

export const updateEmail = (data) => client.put('/users/me/email', data);

export const updatePassword = (data) => client.put('/users/me/password', data);
