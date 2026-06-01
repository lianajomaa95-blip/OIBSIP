const Ingredient = require('../models/Ingredient');
// @desc    Get all ingredients grouped by category
// @route   GET /api/ingredients
// @access  Public (logged-in users only via protect middleware)
const getAllIngredients = async (req, res) => {
try {
const ingredients = await Ingredient.find({ isAvailable: true }).sort({ name: 1 });
// Group by category for easier frontend consumption
const grouped = {
  base: ingredients.filter((i) => i.category === 'base'),
  sauce: ingredients.filter((i) => i.category === 'sauce'),
  cheese: ingredients.filter((i) => i.category === 'cheese'),
  veggies: ingredients.filter((i) => i.category === 'veggie'),
  meats: ingredients.filter((i) => i.category === 'meat'),
};

res.status(200).json({
  success: true,
  data: grouped,
});
} catch (error) {
console.error('Get ingredients error:', error);
res.status(500).json({
success: false,
message: 'Server error fetching ingredients',
});
}
};
// @desc    Get ingredients by category
// @route   GET /api/ingredients/:category
// @access  Public
const getIngredientsByCategory = async (req, res) => {
try {
const { category } = req.params;
const validCategories = ['base', 'sauce', 'cheese', 'veggie', 'meat'];
if (!validCategories.includes(category)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid category',
  });
}

const ingredients = await Ingredient.find({
  category,
  isAvailable: true,
}).sort({ name: 1 });

res.status(200).json({
  success: true,
  count: ingredients.length,
  data: ingredients,
});
} catch (error) {
console.error('Get ingredients by category error:', error);
res.status(500).json({
success: false,
message: 'Server error',
});
}
};
module.exports = {
getAllIngredients,
getIngredientsByCategory,
};