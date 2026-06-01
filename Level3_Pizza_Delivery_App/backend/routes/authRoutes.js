const express = require('express');
const router = express.Router();
const {
registerUser,
loginUser,
getUserProfile,
verifyEmail,
forgotPassword,
resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);module.exports = router;