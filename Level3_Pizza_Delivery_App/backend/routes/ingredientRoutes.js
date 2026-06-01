const express = require('express');
const router = express.Router();
const {
getAllIngredients,
getIngredientsByCategory,
} = require('../controllers/ingredientController');
const { protect } = require('../middleware/authMiddleware');
router.get('/', protect, getAllIngredients);
router.get('/:category', protect, getIngredientsByCategory);
module.exports = router;