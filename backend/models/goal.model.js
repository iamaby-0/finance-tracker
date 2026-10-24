const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Contribution amount must be positive']
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: true });

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    maxlength: [100, 'Goal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [1, 'Target amount must be at least ₹1']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current saved amount cannot be negative']
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  category: {
    type: String,
    enum: [
      'Vehicle',
      'Home',
      'Travel',
      'Education',
      'Emergency Fund',
      'Technology',
      'Health',
      'Investment',
      'Other'
    ],
    default: 'Other'
  },
  icon: {
    type: String,
    default: 'Target'
  },
  color: {
    type: String,
    default: '#35E9A0'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  completedAt: {
    type: Date,
    default: null
  },
  contributions: [contributionSchema]
}, { timestamps: true });

// Virtual to determine calculated onTrack status
goalSchema.methods.calculatePaceStatus = function () {
  if (this.status === 'completed' || this.currentAmount >= this.targetAmount) {
    return 'Completed';
  }
  if (this.status === 'paused') {
    return 'Paused';
  }

  const now = new Date();
  const created = new Date(this.createdAt || now);
  const target = new Date(this.targetDate);

  const totalDuration = target.getTime() - created.getTime();
  const elapsedDuration = now.getTime() - created.getTime();

  // If target date is in the past and goal is not met
  if (now > target && this.currentAmount < this.targetAmount) {
    return 'At Risk';
  }

  // Expected progress fraction (clamped 0 to 1)
  const expectedFraction = totalDuration > 0
    ? Math.min(1, Math.max(0, elapsedDuration / totalDuration))
    : 0.5;

  const actualFraction = this.targetAmount > 0
    ? this.currentAmount / this.targetAmount
    : 0;

  // If actual progress is within 15% tolerance of expected pace
  if (actualFraction >= expectedFraction * 0.85) {
    return 'On Track';
  } else {
    return 'At Risk';
  }
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
