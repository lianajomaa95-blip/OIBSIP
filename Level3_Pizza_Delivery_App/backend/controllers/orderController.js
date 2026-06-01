const Order = require('../models/Order');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { getLowStockEmail } = require('../utils/emailTemplates');
// @desc    Create a new pizza order (deducts stock automatically)
// @route   POST /api/orders
// @access  Protected (logged-in users only)
const createOrder = async (req, res) => {
try {
const { pizza, totalPrice, paymentId, paymentStatus } = req.body;
// 1. Validate required fields
if (!pizza || !pizza.base || !pizza.sauce || !pizza.cheese) {
  return res.status(400).json({
    success: false,
    message: 'Pizza must have a base, sauce, and cheese',
  });
}

if (!totalPrice || totalPrice <= 0) {
  return res.status(400).json({
    success: false,
    message: 'Invalid total price',
  });
}

// 2. Collect all ingredient IDs that need their stock deducted
const ingredientIds = [
  pizza.base.id,
  pizza.sauce.id,
  pizza.cheese.id,
  ...(pizza.veggies || []).map((v) => v.id),
  ...(pizza.meats || []).map((m) => m.id),
];

// 3. Check stock availability for all ingredients
const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } });

for (const ingredient of ingredients) {
  if (ingredient.stock <= 0) {
    return res.status(400).json({
      success: false,
      message: `Sorry, ${ingredient.name} is out of stock`,
    });
  }
}

// 4. Create the order
const order = await Order.create({
  user: req.user._id,
  pizza,
  totalPrice,
  paymentId: paymentId || '',
  paymentStatus: paymentStatus || 'Pending',
  status: 'Order Received',
});

// 5. Deduct stock for each ingredient used (decrement by 1)
await Ingredient.updateMany(
  { _id: { $in: ingredientIds } },
  { $inc: { stock: -1 } }
);
    // 6. Check for low stock and alert admin if needed
    try {
      const lowStockItems = await Ingredient.find({
        _id: { $in: ingredientIds },
        $expr: { $lte: ['$stock', '$threshold'] },
      });
      if (lowStockItems.length > 0) {
    // Find an admin to email
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await sendEmail({
        to: admin.email,
        subject: '⚠️ Low Stock Alert - Pizza Delivery',
        html: getLowStockEmail(lowStockItems),
      });
      console.log(`Low stock alert sent to admin for ${lowStockItems.length} items`);
    }
  }
} catch (alertError) {
  console.error('Low stock alert failed:', alertError.message);
  // Don't fail the order if the alert email fails
}
res.status(201).json({
  success: true,
  message: 'Order placed successfully!',
  data: order,
});
} catch (error) {
console.error('Create order error:', error);
res.status(500).json({
success: false,
message: 'Server error creating order',
});
}
};
// @desc    Get all orders for the logged-in user
// @route   GET /api/orders/my-orders
// @access  Protected
const getMyOrders = async (req, res) => {
try {
const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
res.status(200).json({
  success: true,
  count: orders.length,
  data: orders,
});
} catch (error) {
console.error('Get my orders error:', error);
res.status(500).json({
success: false,
message: 'Server error fetching orders',
});
}
};
// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Protected
const getOrderById = async (req, res) => {
try {
const order = await Order.findById(req.params.id);
if (!order) {
  return res.status(404).json({
    success: false,
    message: 'Order not found',
  });
}

// Security: only the order owner OR admin can view it
if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
  return res.status(403).json({
    success: false,
    message: 'Not authorized to view this order',
  });
}

res.status(200).json({
  success: true,
  data: order,
});
} catch (error) {
console.error('Get order error:', error);
res.status(500).json({
success: false,
message: 'Server error',
});
}
};
// @desc    Update order payment status (after mock payment)
// @route   PUT /api/orders/:id/confirm-payment
// @access  Protected
const confirmPayment = async (req, res) => {
try {
const { paymentId } = req.body;
const order = await Order.findById(req.params.id);
if (!order) {
  return res.status(404).json({ success: false, message: 'Order not found' });
}

// Ensure only the owner can confirm their own payment
if (order.user.toString() !== req.user._id.toString()) {
  return res.status(403).json({ success: false, message: 'Not authorized' });
}

order.paymentId = paymentId || `mock_pay_${Date.now()}`;
order.paymentStatus = 'Paid';
await order.save();

res.status(200).json({
  success: true,
  message: 'Payment confirmed successfully',
  data: order,
});
} catch (error) {
console.error('Confirm payment error:', error);
res.status(500).json({ success: false, message: 'Server error' });
}
};
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
    confirmPayment,
};