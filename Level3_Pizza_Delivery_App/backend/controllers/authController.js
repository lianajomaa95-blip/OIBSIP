const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { getVerificationEmail, getPasswordResetEmail } = require('../utils/emailTemplates');
// Helper: generate a random token (e.g., for email verification or password reset)
const generateRandomToken = () => {
return crypto.randomBytes(32).toString('hex');
};
// @desc    Register a new user + send verification email
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
try {
const { name, email, password, role } = req.body;
if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: 'Please provide name, email, and password',
  });
}

const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({
    success: false,
    message: 'User with this email already exists',
  });
}

// Generate verification token (valid 24 hours)
const verificationToken = generateRandomToken();
const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

const user = await User.create({
  name,
  email,
  password,
  role: role === 'admin' ? 'admin' : 'user',
  verificationToken,
  verificationTokenExpires,
});

// Build verification URL
const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

// Send verification email (don't fail registration if email fails)
try {
  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email - Pizza Delivery',
    html: getVerificationEmail(user.name, verificationUrl),
  });
} catch (emailError) {
  console.error('Verification email failed:', emailError.message);
}

const token = generateToken(user._id);

res.status(201).json({
  success: true,
  message: 'User registered successfully. Please check your email to verify your account.',
  data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    token,
  },
});
} catch (error) {
console.error('Register error:', error);
if (error.name === 'ValidationError') {
const messages = Object.values(error.errors).map((err) => err.message);
return res.status(400).json({ success: false, message: messages.join(', ') });
}
res.status(500).json({ success: false, message: 'Server error during registration' });
}
};
// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ success: false, message: 'Please provide email and password' });
}

const user = await User.findOne({ email }).select('+password');

if (!user || !(await user.matchPassword(password))) {
  return res.status(401).json({ success: false, message: 'Invalid email or password' });
}

const token = generateToken(user._id);

res.status(200).json({
  success: true,
  message: 'Login successful',
  data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    token,
  },
});
} catch (error) {
console.error('Login error:', error);
res.status(500).json({ success: false, message: 'Server error during login' });
}
};
// @desc    Get current user profile
// @route   GET /api/auth/profile (protected)
const getUserProfile = async (req, res) => {
res.status(200).json({
success: true,
data: {
_id: req.user._id,
name: req.user.name,
email: req.user.email,
role: req.user.role,
isVerified: req.user.isVerified,
createdAt: req.user.createdAt,
},
});
};
// @desc    Verify email via token from email link
// @route   GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
try {
const { token } = req.params;
const user = await User.findOne({
  verificationToken: token,
  verificationTokenExpires: { $gt: Date.now() },
});

if (!user) {
  return res.status(400).json({
    success: false,
    message: 'Verification link is invalid or has expired',
  });
}

user.isVerified = true;
user.verificationToken = undefined;
user.verificationTokenExpires = undefined;
await user.save();

res.status(200).json({
  success: true,
  message: 'Email verified successfully! You can now login.',
});
} catch (error) {
console.error('Verify email error:', error);
res.status(500).json({ success: false, message: 'Server error during email verification' });
}
};
// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
try {
const { email } = req.body;
if (!email) {
  return res.status(400).json({ success: false, message: 'Please provide an email' });
}

const user = await User.findOne({ email });

// Always return success even if user not found (security: prevents email enumeration)
if (!user) {
  return res.status(200).json({
    success: true,
    message: 'If an account exists with this email, a reset link has been sent.',
  });
}

// Generate reset token (valid 1 hour)
const resetToken = generateRandomToken();
user.resetPasswordToken = resetToken;
user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
await user.save();

const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

try {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - Pizza Delivery',
    html: getPasswordResetEmail(user.name, resetUrl),
  });
} catch (emailError) {
  console.error('Reset email failed:', emailError.message);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.status(500).json({ success: false, message: 'Email could not be sent' });
}

res.status(200).json({
  success: true,
  message: 'If an account exists with this email, a reset link has been sent.',
});
} catch (error) {
console.error('Forgot password error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
try {
const { token } = req.params;
const { password } = req.body;
if (!password) {
  return res.status(400).json({ success: false, message: 'Please provide a new password' });
}

if (password.length < 6) {
  return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
}

const user = await User.findOne({
  resetPasswordToken: token,
  resetPasswordExpires: { $gt: Date.now() },
});

if (!user) {
  return res.status(400).json({
    success: false,
    message: 'Reset link is invalid or has expired',
  });
}

user.password = password; // pre-save hook will hash it
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();

res.status(200).json({
  success: true,
  message: 'Password reset successfully. You can now login with your new password.',
});
} catch (error) {
console.error('Reset password error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
module.exports = {
registerUser,
loginUser,
getUserProfile,
verifyEmail,
forgotPassword,
resetPassword,
};