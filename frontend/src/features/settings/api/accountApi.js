import client from '../../../api/client';

export const accountApi = {
  updateEmail: (data) => client.put('/users/me/email', data),

  updatePassword: (data) => client.put('/users/me/password', data),
};
