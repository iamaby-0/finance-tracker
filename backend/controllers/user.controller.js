const userService = require('../services/user.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getUserProfile(userId);

    return res.status(200).json({
      ...successResponseBody,
      data: profile,
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('getProfile controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.message || error.error || error,
      message: error.message || 'Failed to retrieve user profile'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userService.updateProfile(userId, req.body);

    return res.status(200).json({
      ...successResponseBody,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('updateProfile controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.message || error.error || error,
      message: error.message || 'Failed to update profile'
    });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userService.updatePreferences(userId, req.body);

    return res.status(200).json({
      ...successResponseBody,
      data: {
        currency: updatedUser.currency,
        dateFormat: updatedUser.dateFormat,
        firstDayOfWeek: updatedUser.firstDayOfWeek,
        language: updatedUser.language,
        theme: updatedUser.theme
      },
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('updatePreferences controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.message || error.error || error,
      message: error.message || 'Failed to update preferences'
    });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await userService.updateNotifications(userId, req.body);

    return res.status(200).json({
      ...successResponseBody,
      data: notifications,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('updateNotifications controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.message || error.error || error,
      message: error.message || 'Failed to update notification settings'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await userService.changePassword(userId, req.body);

    return res.status(200).json({
      ...successResponseBody,
      data: result,
      message: result.message || 'Password changed successfully'
    });
  } catch (error) {
    console.error('changePassword controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.error || error.message || error,
      message: error.error || error.message || 'Failed to change password'
    });
  }
};

const getStorageUsage = async (req, res) => {
  try {
    const userId = req.user.id;
    const storageUsage = await userService.getStorageUsage(userId);

    return res.status(200).json({
      ...successResponseBody,
      data: storageUsage,
      message: 'Storage usage retrieved successfully'
    });
  } catch (error) {
    console.error('getStorageUsage controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to retrieve storage usage'
    });
  }
};

const exportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const exportResult = await userService.exportUserData(userId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=my-finance-track-export-${Date.now()}.json`);
    return res.status(200).json({
      ...successResponseBody,
      data: exportResult,
      message: 'Data exported successfully'
    });
  } catch (error) {
    console.error('exportData controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to export user data'
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirmation } = req.body;
    const result = await userService.deleteAccount(userId, confirmation);

    return res.status(200).json({
      ...successResponseBody,
      data: result,
      message: 'Account deleted permanently'
    });
  } catch (error) {
    console.error('deleteAccount controller error:', error);
    return res.status(error.code || 500).json({
      ...errorResponseBody,
      error: error.error || error.message || error,
      message: error.error || error.message || 'Failed to delete account'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  changePassword,
  getStorageUsage,
  exportData,
  deleteAccount
};
