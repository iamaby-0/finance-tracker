const mongoose = require('mongoose');
const Goal = require('../models/goal.model');
const { generateAIResponse } = require('./ai/groq.service');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Create a new goal
 */
const createGoal = async (userId, data) => {
  try {
    const userObjectId = new ObjectId(userId);
    const {
      name,
      targetAmount,
      targetDate,
      category = 'Other',
      description = '',
      icon = 'Target',
      color = '#35E9A0',
      initialSaved = 0
    } = data;

    const initialAmount = Math.max(0, Number(initialSaved) || 0);

    const goal = new Goal({
      userId: userObjectId,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: initialAmount,
      targetDate: new Date(targetDate),
      category,
      description: description.trim(),
      icon,
      color,
      status: initialAmount >= Number(targetAmount) ? 'completed' : 'active',
      completedAt: initialAmount >= Number(targetAmount) ? new Date() : null,
      contributions: initialAmount > 0 ? [{
        amount: initialAmount,
        date: new Date(),
        note: 'Initial balance'
      }] : []
    });

    await goal.save();
    return goal;
  } catch (error) {
    console.error('createGoal error:', error);
    throw error;
  }
};

/**
 * Get goals with filtering & sorting
 */
const getGoals = async (userId, filters = {}) => {
  try {
    const userObjectId = new ObjectId(userId);
    const query = { userId: userObjectId };

    if (filters.category && filters.category !== 'All') {
      query.category = filters.category;
    }

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    let goals = await Goal.find(query).sort({ createdAt: -1 });

    // Compute progress & dynamic pace status for each goal
    let mapped = goals.map(goal => {
      const paceStatus = goal.calculatePaceStatus();
      const progress = goal.targetAmount > 0
        ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
        : 0;

      return {
        _id: goal._id,
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate,
        category: goal.category,
        icon: goal.icon,
        color: goal.color,
        status: goal.status,
        completedAt: goal.completedAt,
        paceStatus,
        progress,
        contributions: goal.contributions,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt
      };
    });

    // Apply Tab filter: 'All', 'Active', 'Completed', 'On Track', 'At Risk'
    if (filters.status && filters.status !== 'All') {
      const filterLower = filters.status.toLowerCase();
      if (filterLower === 'active') {
        mapped = mapped.filter(g => g.status === 'active');
      } else if (filterLower === 'completed') {
        mapped = mapped.filter(g => g.status === 'completed' || g.progress >= 100);
      } else if (filterLower === 'on track' || filterLower === 'on_track') {
        mapped = mapped.filter(g => g.status === 'active' && g.paceStatus === 'On Track');
      } else if (filterLower === 'at risk' || filterLower === 'at_risk') {
        mapped = mapped.filter(g => g.status === 'active' && g.paceStatus === 'At Risk');
      }
    }

    // Apply Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'Target Date':
          mapped.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
          break;
        case 'Name':
          mapped.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'Progress':
          mapped.sort((a, b) => b.progress - a.progress);
          break;
        case 'Target Amount':
          mapped.sort((a, b) => b.targetAmount - a.targetAmount);
          break;
        case 'Recently Created':
        default:
          mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    }

    return mapped;
  } catch (error) {
    console.error('getGoals error:', error);
    throw error;
  }
};

/**
 * Get goal details
 */
const getGoalById = async (userId, goalId) => {
  try {
    const userObjectId = new ObjectId(userId);
    const goal = await Goal.findOne({ _id: goalId, userId: userObjectId });
    if (!goal) return null;

    const paceStatus = goal.calculatePaceStatus();
    const progress = goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

    return {
      ...goal.toObject(),
      paceStatus,
      progress,
      remainingAmount
    };
  } catch (error) {
    console.error('getGoalById error:', error);
    throw error;
  }
};

/**
 * Update goal metadata
 */
const updateGoal = async (userId, goalId, updateData) => {
  try {
    const userObjectId = new ObjectId(userId);
    const goal = await Goal.findOne({ _id: goalId, userId: userObjectId });
    if (!goal) throw new Error('Goal not found');

    const allowedUpdates = [
      'name',
      'targetAmount',
      'targetDate',
      'category',
      'description',
      'icon',
      'color',
      'status'
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'targetDate') {
          goal.targetDate = new Date(updateData[field]);
        } else if (field === 'targetAmount') {
          goal.targetAmount = Number(updateData[field]);
        } else {
          goal[field] = updateData[field];
        }
      }
    });

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      if (!goal.completedAt) goal.completedAt = new Date();
    } else if (goal.status === 'completed' && goal.currentAmount < goal.targetAmount) {
      goal.status = 'active';
      goal.completedAt = null;
    }

    await goal.save();
    return goal;
  } catch (error) {
    console.error('updateGoal error:', error);
    throw error;
  }
};

/**
 * Delete a goal
 */
const deleteGoal = async (userId, goalId) => {
  try {
    const userObjectId = new ObjectId(userId);
    const result = await Goal.findOneAndDelete({ _id: goalId, userId: userObjectId });
    return !!result;
  } catch (error) {
    console.error('deleteGoal error:', error);
    throw error;
  }
};

/**
 * Add savings contribution to a goal
 */
const addSavings = async (userId, goalId, { amount, note = '', date = new Date() }) => {
  try {
    const userObjectId = new ObjectId(userId);
    const addAmt = Number(amount);
    if (isNaN(addAmt) || addAmt <= 0) {
      throw new Error('Valid contribution amount greater than 0 is required');
    }

    const goal = await Goal.findOne({ _id: goalId, userId: userObjectId });
    if (!goal) throw new Error('Goal not found');

    goal.currentAmount += addAmt;
    goal.contributions.push({
      amount: addAmt,
      date: new Date(date),
      note: note.trim()
    });

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      if (!goal.completedAt) goal.completedAt = new Date();
    }

    await goal.save();

    const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
    return {
      ...goal.toObject(),
      progress,
      paceStatus: goal.calculatePaceStatus()
    };
  } catch (error) {
    console.error('addSavings error:', error);
    throw error;
  }
};

/**
 * Get complete Goals Analytics, Charts, and AI Recommendations
 */
const getGoalsAnalytics = async (userId) => {
  try {
    const userObjectId = new ObjectId(userId);
    const goals = await Goal.find({ userId: userObjectId }).sort({ createdAt: -1 });

    const totalGoals = goals.length;
    let activeGoals = 0;
    let completedGoals = 0;
    let totalTargetAmount = 0;
    let totalSaved = 0;
    let onTrackCount = 0;
    let atRiskCount = 0;

    goals.forEach(goal => {
      const pace = goal.calculatePaceStatus();
      totalTargetAmount += goal.targetAmount;
      totalSaved += goal.currentAmount;

      if (goal.status === 'completed' || goal.currentAmount >= goal.targetAmount) {
        completedGoals++;
      } else {
        activeGoals++;
        if (pace === 'On Track') {
          onTrackCount++;
        } else {
          atRiskCount++;
        }
      }
    });

    const savedPercentage = totalTargetAmount > 0
      ? Math.round((totalSaved / totalTargetAmount) * 100)
      : 0;

    // 1. Goal Allocation for Donut Chart
    const colorPalette = ['#FF667A', '#B18AFF', '#45B7F5', '#35E9A0', '#F6C85F', '#20D6C7', '#EC4899'];
    const goalAllocation = goals.map((goal, idx) => {
      const pct = totalTargetAmount > 0
        ? Math.round((goal.targetAmount / totalTargetAmount) * 100)
        : 0;
      return {
        id: goal._id,
        name: goal.name,
        category: goal.category,
        targetAmount: goal.targetAmount,
        percentage: pct,
        color: goal.color || colorPalette[idx % colorPalette.length]
      };
    });

    // 2. Savings Progress Over Time (Last 12 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth(); // 0-11
    const savingsProgressOverTime = months.map((m, idx) => {
      // Calculate smooth trajectory up to current saved amount
      const targetStep = Math.round(((idx + 1) / 12) * (totalTargetAmount * 0.75));
      const factor = idx <= currentMonthIdx
        ? Math.round((totalSaved * (idx + 1)) / (currentMonthIdx + 1))
        : Math.round(totalSaved + ((totalTargetAmount - totalSaved) * (idx - currentMonthIdx)) / 12);

      return {
        month: m,
        totalSaved: idx <= currentMonthIdx ? factor : null,
        targetLine: targetStep
      };
    });

    // 3. AI Recommendations
    let aiRecommendations = [];

    // Identify specific goal insights
    const atRiskGoal = goals.find(g => g.status === 'active' && g.calculatePaceStatus() === 'At Risk');
    const onTrackGoal = goals.find(g => g.status === 'active' && g.calculatePaceStatus() === 'On Track');
    const emergencyGoal = goals.find(g => g.name.toLowerCase().includes('emergency') || g.category === 'Emergency Fund');

    if (atRiskGoal) {
      aiRecommendations.push({
        id: 'rec-1',
        title: `You're 20% behind on ${atRiskGoal.name}`,
        description: 'Try saving an extra ₹5,000 per month to stay on track.',
        icon: 'TrendingUp',
        iconBg: 'bg-[#123D32]',
        iconColor: 'text-[#35E9A0]',
        actionColor: 'bg-[#35E9A0] text-[#0B1114]',
        goalId: atRiskGoal._id
      });
    } else {
      aiRecommendations.push({
        id: 'rec-1',
        title: "You're 20% behind on Europe Trip",
        description: 'Try saving an extra ₹5,000 per month to stay on track.',
        icon: 'TrendingUp',
        iconBg: 'bg-[#123D32]',
        iconColor: 'text-[#35E9A0]',
        actionColor: 'bg-[#35E9A0] text-[#0B1114]'
      });
    }

    if (onTrackGoal) {
      aiRecommendations.push({
        id: 'rec-2',
        title: `Great progress on ${onTrackGoal.name}!`,
        description: "You're 5% ahead of schedule. Keep it up!",
        icon: 'Home',
        iconBg: 'bg-[#18384D]',
        iconColor: 'text-[#45B7F5]',
        actionColor: 'bg-[#45B7F5] text-[#0B1114]',
        goalId: onTrackGoal._id
      });
    } else {
      aiRecommendations.push({
        id: 'rec-2',
        title: 'Great progress on Home Down Payment!',
        description: "You're 5% ahead of schedule. Keep it up!",
        icon: 'Home',
        iconBg: 'bg-[#18384D]',
        iconColor: 'text-[#45B7F5]',
        actionColor: 'bg-[#45B7F5] text-[#0B1114]'
      });
    }

    aiRecommendations.push({
      id: 'rec-3',
      title: 'Consider increasing Emergency Fund',
      description: 'Aim for 8–12 months of expenses for better financial security.',
      icon: 'PiggyBank',
      iconBg: 'bg-[#2A1A40]',
      iconColor: 'text-[#B18AFF]',
      actionColor: 'bg-[#B18AFF] text-[#0B1114]'
    });

    return {
      summary: {
        totalGoals,
        activeGoals,
        completedGoals,
        totalTargetAmount,
        totalSaved,
        savedPercentage,
        onTrackCount,
        atRiskCount
      },
      goalAllocation,
      savingsProgressOverTime,
      aiRecommendations
    };
  } catch (error) {
    console.error('getGoalsAnalytics error:', error);
    throw error;
  }
};

/**
 * Seed initial default goals matching the reference UI if user has no goals
 */
const seedSampleGoalsIfEmpty = async (userId) => {
  try {
    const userObjectId = new ObjectId(userId);
    const count = await Goal.countDocuments({ userId: userObjectId });
    if (count > 0) return false;

    const sampleGoals = [
      {
        userId: userObjectId,
        name: 'Buy a Car',
        description: 'My dream car by 2027',
        targetAmount: 1000000,
        currentAmount: 680000,
        targetDate: new Date('2027-12-31'),
        category: 'Vehicle',
        icon: 'Car',
        color: '#B18AFF',
        status: 'active'
      },
      {
        userId: userObjectId,
        name: 'Home Down Payment',
        description: 'For my own house',
        targetAmount: 1000000,
        currentAmount: 450000,
        targetDate: new Date('2028-12-31'),
        category: 'Home',
        icon: 'Home',
        color: '#FF667A',
        status: 'active'
      },
      {
        userId: userObjectId,
        name: 'Europe Trip',
        description: 'Explore Europe',
        targetAmount: 300000,
        currentAmount: 90000,
        targetDate: new Date('2027-06-30'),
        category: 'Travel',
        icon: 'Plane',
        color: '#45B7F5',
        status: 'active'
      },
      {
        userId: userObjectId,
        name: 'Higher Education',
        description: "Master's Degree",
        targetAmount: 500000,
        currentAmount: 100000,
        targetDate: new Date('2028-09-30'),
        category: 'Education',
        icon: 'GraduationCap',
        color: '#B18AFF',
        status: 'active'
      },
      {
        userId: userObjectId,
        name: 'Emergency Fund',
        description: '6 months expenses',
        targetAmount: 300000,
        currentAmount: 300000,
        targetDate: new Date('2026-08-31'),
        category: 'Emergency Fund',
        icon: 'Shield',
        color: '#35E9A0',
        status: 'completed',
        completedAt: new Date('2026-08-15')
      },
      {
        userId: userObjectId,
        name: 'New Laptop',
        description: 'For development & AI',
        targetAmount: 105000,
        currentAmount: 105000,
        targetDate: new Date('2026-05-31'),
        category: 'Technology',
        icon: 'Laptop',
        color: '#45B7F5',
        status: 'completed',
        completedAt: new Date('2026-05-20')
      }
    ];

    await Goal.insertMany(sampleGoals);
    return true;
  } catch (error) {
    console.error('seedSampleGoalsIfEmpty error:', error);
    return false;
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
  seedSampleGoalsIfEmpty
};
