const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
  // Get full user profile with preferences and connected accounts
  app.get(
    '/aft/api/v1/user/profile',
    authMiddleware.isAuthenticated,
    userController.getProfile
  );

  // Update profile
  app.put(
    '/aft/api/v1/user/profile',
    authMiddleware.isAuthenticated,
    userController.updateProfile
  );

  // Update preferences
  app.put(
    '/aft/api/v1/user/preferences',
    authMiddleware.isAuthenticated,
    userController.updatePreferences
  );

  // Update notification settings
  app.put(
    '/aft/api/v1/user/notifications',
    authMiddleware.isAuthenticated,
    userController.updateNotifications
  );

  // Change password
  app.post(
    '/aft/api/v1/user/change-password',
    authMiddleware.isAuthenticated,
    userController.changePassword
  );

  // Get storage usage
  app.get(
    '/aft/api/v1/user/storage-usage',
    authMiddleware.isAuthenticated,
    userController.getStorageUsage
  );

  // Export all user data as JSON
  app.get(
    '/aft/api/v1/user/export-data',
    authMiddleware.isAuthenticated,
    userController.exportData
  );

  // Delete account permanently
  app.post(
    '/aft/api/v1/user/delete-account',
    authMiddleware.isAuthenticated,
    userController.deleteAccount
  );
};

module.exports = routes;
