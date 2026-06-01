const express = require('express');
const router = express.Router();
const {
registerUser,
loginUser,
getUserProfile,
verifyEmail,
forgotPassword,
resetPassword,
smtpDebug,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/smtp-debug', smtpDebug); // TEMPORARY - remove after SMTP is fixed
module.exports = router;