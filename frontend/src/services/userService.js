import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await api.put('/user/preferences', preferencesData);
  return response.data;
};

export const updateNotifications = async (notificationsData) => {
  const response = await api.put('/user/notifications', notificationsData);
  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.post('/user/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

export const getStorageUsage = async () => {
  const response = await api.get('/user/storage-usage');
  return response.data;
};

export const exportUserData = async () => {
  const response = await api.get('/user/export-data');
  return response.data;
};

export const deleteAccount = async (confirmation) => {
  const response = await api.post('/user/delete-account', {
    confirmation
  });
  return response.data;
};
