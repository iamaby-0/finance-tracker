const goalController = require('../controllers/goal.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
  // Goals Analytics & Summary
  app.get(
    '/aft/api/v1/goals/analytics',
    authMiddleware.isAuthenticated,
    goalController.getGoalsAnalytics
  );

  // Seed sample goals if empty
  app.post(
    '/aft/api/v1/goals/seed',
    authMiddleware.isAuthenticated,
    goalController.seedSampleGoals
  );

  // List goals
  app.get(
    '/aft/api/v1/goals',
    authMiddleware.isAuthenticated,
    goalController.getGoals
  );

  // Create goal
  app.post(
    '/aft/api/v1/goals',
    authMiddleware.isAuthenticated,
    goalController.createGoal
  );

  // Get goal by id
  app.get(
    '/aft/api/v1/goals/:id',
    authMiddleware.isAuthenticated,
    goalController.getGoalById
  );

  // Update goal
  app.put(
    '/aft/api/v1/goals/:id',
    authMiddleware.isAuthenticated,
    goalController.updateGoal
  );
  app.patch(
    '/aft/api/v1/goals/:id',
    authMiddleware.isAuthenticated,
    goalController.updateGoal
  );

  // Delete goal
  app.delete(
    '/aft/api/v1/goals/:id',
    authMiddleware.isAuthenticated,
    goalController.deleteGoal
  );

  // Add savings contribution
  app.post(
    '/aft/api/v1/goals/:id/savings',
    authMiddleware.isAuthenticated,
    goalController.addSavings
  );
};

module.exports = routes;
