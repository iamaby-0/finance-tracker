const Category = require('../models/category.model');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

// Default system categories matching schema and UI reference
const DEFAULT_SYSTEM_CATEGORIES = [
  // Expense Categories
  { id: 'def-1', name: 'Food & Dining', type: 'Expense', icon: 'Utensils', color: '#FF667A', isCustom: false },
  { id: 'def-2', name: 'Shopping', type: 'Expense', icon: 'ShoppingBag', color: '#B18AFF', isCustom: false },
  { id: 'def-3', name: 'Transport', type: 'Expense', icon: 'Car', color: '#45B7F5', isCustom: false },
  { id: 'def-4', name: 'Bills & Utilities', type: 'Expense', icon: 'FileText', color: '#F6C85F', isCustom: false },
  { id: 'def-5', name: 'Entertainment', type: 'Expense', icon: 'Gamepad', color: '#FF6EA7', isCustom: false },
  { id: 'def-6', name: 'Health & Fitness', type: 'Expense', icon: 'Heart', color: '#FF8A48', isCustom: false },
  { id: 'def-7', name: 'Others', type: 'Expense', icon: 'MoreHorizontal', color: '#A5B4B8', isCustom: false },
  // Income Categories
  { id: 'def-8', name: 'Salary', type: 'Income', icon: 'Briefcase', color: '#35E9A0', isCustom: false },
  { id: 'def-9', name: 'Freelance', type: 'Income', icon: 'Laptop', color: '#B18AFF', isCustom: false },
  { id: 'def-10', name: 'Investment', type: 'Income', icon: 'TrendingUp', color: '#F6C85F', isCustom: false },
  { id: 'def-11', name: 'Side Income', type: 'Income', icon: 'Coins', color: '#FF8A48', isCustom: false }
];

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const customCategories = await Category.find({ userId }).sort({ createdAt: -1 });

    const formattedCustom = customCategories.map((c) => ({
      _id: c._id,
      id: c._id.toString(),
      name: c.name,
      type: c.type,
      icon: c.icon,
      color: c.color,
      description: c.description,
      isCustom: true
    }));

    const all = [...DEFAULT_SYSTEM_CATEGORIES, ...formattedCustom];

    successResponseBody.data = {
      categories: all,
      totalCount: all.length,
      customCount: formattedCustom.length,
      expenseCount: all.filter((c) => c.type === 'Expense').length,
      incomeCount: all.filter((c) => c.type === 'Income').length
    };
    successResponseBody.message = 'Categories retrieved successfully';
    return res.status(200).json(successResponseBody);
  } catch (err) {
    errorResponseBody.error = err.message || err;
    return res.status(500).json(errorResponseBody);
  }
};

const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, icon, color, description } = req.body;

    if (!name || !name.trim()) {
      errorResponseBody.error = 'Category name is required';
      return res.status(400).json(errorResponseBody);
    }

    if (!type || !['Expense', 'Income'].includes(type)) {
      errorResponseBody.error = 'Valid category type (Expense or Income) is required';
      return res.status(400).json(errorResponseBody);
    }

    // Check if category already exists for user
    const existing = await Category.findOne({
      userId,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    if (existing) {
      errorResponseBody.error = `A category named "${name.trim()}" already exists`;
      return res.status(409).json(errorResponseBody);
    }

    const newCategory = await Category.create({
      userId,
      name: name.trim(),
      type,
      icon: icon || (type === 'Income' ? 'Briefcase' : 'Utensils'),
      color: color || (type === 'Income' ? '#35E9A0' : '#FF667A'),
      description: description ? description.trim() : '',
      isCustom: true
    });

    successResponseBody.data = newCategory;
    successResponseBody.message = 'Category created successfully';
    return res.status(201).json(successResponseBody);
  } catch (err) {
    errorResponseBody.error = err.message || err;
    return res.status(500).json(errorResponseBody);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Category.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      errorResponseBody.error = 'Category not found or unauthorized to delete';
      return res.status(404).json(errorResponseBody);
    }

    successResponseBody.data = deleted;
    successResponseBody.message = 'Category deleted successfully';
    return res.status(200).json(successResponseBody);
  } catch (err) {
    errorResponseBody.error = err.message || err;
    return res.status(500).json(errorResponseBody);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
