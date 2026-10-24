const goalService = require('../services/goal.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

const createGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goal = await goalService.createGoal(userId, req.body);

    return res.status(201).json({
      ...successResponseBody,
      data: goal,
      message: 'Financial goal created successfully'
    });
  } catch (error) {
    console.error('createGoal controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to create financial goal'
    });
  }
};

const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await goalService.getGoals(userId, req.query);

    return res.status(200).json({
      ...successResponseBody,
      data: goals,
      message: 'Financial goals retrieved successfully'
    });
  } catch (error) {
    console.error('getGoals controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to retrieve financial goals'
    });
  }
};

const getGoalById = async (req, res) => {
  try {
    const userId = req.user.id;
    const goal = await goalService.getGoalById(userId, req.params.id);

    if (!goal) {
      return res.status(404).json({
        ...errorResponseBody,
        message: 'Goal not found'
      });
    }

    return res.status(200).json({
      ...successResponseBody,
      data: goal,
      message: 'Goal details retrieved successfully'
    });
  } catch (error) {
    console.error('getGoalById controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to retrieve goal details'
    });
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goal = await goalService.updateGoal(userId, req.params.id, req.body);

    return res.status(200).json({
      ...successResponseBody,
      data: goal,
      message: 'Goal updated successfully'
    });
  } catch (error) {
    console.error('updateGoal controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to update goal'
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    await goalService.deleteGoal(userId, req.params.id);

    return res.status(200).json({
      ...successResponseBody,
      data: { deleted: true },
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('deleteGoal controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to delete goal'
    });
  }
};

const addSavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, note, date } = req.body;

    const goal = await goalService.addSavings(userId, req.params.id, {
      amount,
      note,
      date
    });

    return res.status(200).json({
      ...successResponseBody,
      data: goal,
      message: `Successfully added ₹${Number(amount).toLocaleString('en-IN')} to ${goal.name}`
    });
  } catch (error) {
    console.error('addSavings controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: error.message || 'Failed to add savings'
    });
  }
};

const getGoalsAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const analytics = await goalService.getGoalsAnalytics(userId);

    return res.status(200).json({
      ...successResponseBody,
      data: analytics,
      message: 'Goals analytics retrieved successfully'
    });
  } catch (error) {
    console.error('getGoalsAnalytics controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to retrieve goals analytics'
    });
  }
};

const seedSampleGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const seeded = await goalService.seedSampleGoalsIfEmpty(userId);

    return res.status(200).json({
      ...successResponseBody,
      data: { seeded },
      message: seeded ? 'Sample goals seeded successfully' : 'Goals already exist'
    });
  } catch (error) {
    console.error('seedSampleGoals controller error:', error);
    return res.status(500).json({
      ...errorResponseBody,
      error: error.message || error,
      message: 'Failed to seed sample goals'
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  addSavings,
  getGoalsAnalytics,
  seedSampleGoals
};
